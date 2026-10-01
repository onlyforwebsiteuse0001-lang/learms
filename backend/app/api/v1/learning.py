"""Concept graph, diagnostic mastery, and explainable path endpoints."""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.api.dependencies import get_current_student
from backend.app.database import get_db_session
from backend.app.models.document import Student
from backend.app.models.learning import (
    BanditState,
    BKTParameter,
    Concept,
    DiagnosticQuestion,
    DiagnosticSession,
    LearningPath,
    MasteryState,
    PathStep,
    Prerequisite,
)
from backend.app.services.api_errors import APIError
from backend.app.services.bandit_service import update_posterior
from backend.app.services.bkt_service import BKTParams, update_mastery
from backend.app.services.graph_service import bandit_topological_order, build_graph

router = APIRouter(tags=["learning engine"])


class DiagnosticStart(BaseModel):
    """Course diagnostic request."""
    course_key: str = Field(min_length=1, max_length=120)
    max_questions: int = Field(default=12, ge=3, le=30)


class DiagnosticAnswer(BaseModel):
    """One selected option for the current diagnostic item."""
    question_id: uuid.UUID
    selected_index: int = Field(ge=0, le=10)


class PathRequest(BaseModel):
    """Course path generation request."""
    course_key: str = Field(min_length=1, max_length=120)


def _question_payload(question: DiagnosticQuestion) -> dict:
    """Serialize a question without leaking its answer or evidence."""
    return {"question_id": str(question.question_id), "prompt": question.prompt, "options": question.options, "difficulty": question.difficulty}


@router.get("/concepts")
async def concepts(course: str, student: Annotated[Student, Depends(get_current_student)], session: Annotated[AsyncSession, Depends(get_db_session)]) -> list[dict]:
    """List source-grounded concepts for one student course key."""
    rows = list((await session.execute(select(Concept).where(Concept.student_id == student.student_id, Concept.course_key == course).order_by(Concept.name))).scalars())
    return [{"concept_id": str(row.concept_id), "name": row.name, "description": row.description, "phase": row.phase, "confidence": row.confidence, "extraction_method": row.extraction_method, "evidence": row.evidence} for row in rows]


@router.get("/concepts/{concept_id}/prerequisites")
async def prerequisites(concept_id: uuid.UUID, student: Annotated[Student, Depends(get_current_student)], session: Annotated[AsyncSession, Depends(get_db_session)]) -> list[dict]:
    """Return evidence and confidence for owned prerequisite edges."""
    owned = await session.scalar(select(Concept.concept_id).where(Concept.concept_id == concept_id, Concept.student_id == student.student_id))
    if not owned:
        raise APIError(404, "concept_not_found", "Concept not found. / Concept nahi mila.")
    rows = list((await session.execute(select(Prerequisite, Concept).join(Concept, Concept.concept_id == Prerequisite.prerequisite_concept_id).where(Prerequisite.concept_id == concept_id, Prerequisite.student_id == student.student_id))).all())
    return [{"concept_id": str(concept.concept_id), "name": concept.name, "confidence": edge.confidence, "evidence": edge.evidence, "approved": edge.approved} for edge, concept in rows]


@router.post("/diagnostic/start", status_code=201)
async def start_diagnostic(data: DiagnosticStart, student: Annotated[Student, Depends(get_current_student)], session: Annotated[AsyncSession, Depends(get_db_session)]) -> dict:
    """Start only when at least three real source-grounded questions exist."""
    questions = list((await session.execute(select(DiagnosticQuestion).join(Concept).where(Concept.student_id == student.student_id, Concept.course_key == data.course_key).order_by(DiagnosticQuestion.difficulty).limit(data.max_questions))).scalars())
    if len(questions) < 3:
        raise APIError(409, "diagnostic_unavailable", "Not enough validated source questions are available. Upload material with at least three clear headings. / Diagnostic ke liye source questions kam hain.")
    diagnostic = DiagnosticSession(student_id=student.student_id, course_key=data.course_key, status="active", question_ids=[str(item.question_id) for item in questions], answers=[])
    session.add(diagnostic); await session.flush()
    return {"session_id": str(diagnostic.session_id), "status": "active", "total_questions": len(questions), "question": _question_payload(questions[0])}


@router.post("/diagnostic/{session_id}/answer")
async def answer_diagnostic(session_id: uuid.UUID, data: DiagnosticAnswer, student: Annotated[Student, Depends(get_current_student)], db: Annotated[AsyncSession, Depends(get_db_session)]) -> dict:
    """Score current item and update the associated BKT mastery state."""
    diagnostic = await db.get(DiagnosticSession, session_id)
    if not diagnostic or diagnostic.student_id != student.student_id:
        raise APIError(404, "diagnostic_not_found", "Diagnostic session not found. / Diagnostic session nahi mila.")
    if diagnostic.status != "active" or diagnostic.current_index >= len(diagnostic.question_ids):
        raise APIError(409, "diagnostic_complete", "This diagnostic is already complete. / Diagnostic pehle hi complete hai.")
    expected_id = uuid.UUID(diagnostic.question_ids[diagnostic.current_index])
    if data.question_id != expected_id:
        raise APIError(409, "wrong_question", "Answer the current question before continuing. / Pehle current question ka jawab dein.")
    question = await db.get(DiagnosticQuestion, expected_id)
    if not question or data.selected_index >= len(question.options):
        raise APIError(422, "invalid_option", "Selected option is invalid. / Selected option durust nahi.")
    correct = data.selected_index == question.correct_index
    params = await db.get(BKTParameter, question.concept_id)
    if params is None:
        params = BKTParameter(concept_id=question.concept_id, p_learn=.15, p_slip=.10, p_guess=.20, source="documented_default", sample_size=0)
        db.add(params)
    state = await db.get(MasteryState, (student.student_id, question.concept_id))
    if state is None:
        state = MasteryState(student_id=student.student_id, concept_id=question.concept_id, p_know=.20, attempts=0, correct_attempts=0)
        db.add(state)
    before = state.p_know
    state.p_know = update_mastery(before, correct, BKTParams(params.p_learn, params.p_slip, params.p_guess))
    state.attempts += 1; state.correct_attempts += int(correct); state.last_updated = datetime.now(timezone.utc)
    bandit = await db.get(BanditState, (student.student_id, question.concept_id))
    if bandit is None:
        bandit = BanditState(student_id=student.student_id, concept_id=question.concept_id, alpha=1.0, beta=1.0, observations=0)
        db.add(bandit)
    reward = max(0.0, min(1.0, state.p_know - before))
    bandit.alpha, bandit.beta = update_posterior(bandit.alpha, bandit.beta, reward)
    bandit.observations += 1; bandit.last_reward = reward
    diagnostic.answers = [*diagnostic.answers, {"question_id": str(expected_id), "correct": correct, "mastery_before": before, "mastery_after": state.p_know}]
    diagnostic.current_index += 1
    response = {"correct": correct, "mastery_percent": round(state.p_know * 100, 1), "evidence": question.evidence}
    if diagnostic.current_index >= len(diagnostic.question_ids):
        diagnostic.status = "complete"; diagnostic.completed_at = datetime.now(timezone.utc); response.update({"status": "complete", "question": None})
    else:
        next_question = await db.get(DiagnosticQuestion, uuid.UUID(diagnostic.question_ids[diagnostic.current_index])); response.update({"status": "active", "question": _question_payload(next_question)})
    return response


@router.get("/diagnostic/{session_id}/result")
async def diagnostic_result(session_id: uuid.UUID, student: Annotated[Student, Depends(get_current_student)], session: Annotated[AsyncSession, Depends(get_db_session)]) -> dict:
    """Return observed diagnostic outcomes without fabricated aggregate claims."""
    diagnostic = await session.get(DiagnosticSession, session_id)
    if not diagnostic or diagnostic.student_id != student.student_id:
        raise APIError(404, "diagnostic_not_found", "Diagnostic session not found. / Diagnostic session nahi mila.")
    return {"session_id": str(session_id), "status": diagnostic.status, "answered": len(diagnostic.answers), "total": len(diagnostic.question_ids), "answers": diagnostic.answers}


@router.get("/mastery/{student_id}")
async def mastery(student_id: uuid.UUID, student: Annotated[Student, Depends(get_current_student)], session: Annotated[AsyncSession, Depends(get_db_session)]) -> list[dict]:
    """Return only the authenticated student's evidence-counted mastery states."""
    if student_id != student.student_id:
        raise APIError(403, "forbidden", "You cannot view another student's mastery. / Doosray student ki mastery nahi dekh sakte.")
    rows = list((await session.execute(select(MasteryState, Concept).join(Concept).where(MasteryState.student_id == student_id))).all())
    return [{"concept_id": str(concept.concept_id), "concept": concept.name, "mastery_percent": round(state.p_know * 100, 1), "attempts": state.attempts, "parameter_status": "default_until_sufficient_data"} for state, concept in rows]


@router.get("/mastery/{student_id}/concept/{concept_id}")
async def concept_mastery(student_id: uuid.UUID, concept_id: uuid.UUID, student: Annotated[Student, Depends(get_current_student)], session: Annotated[AsyncSession, Depends(get_db_session)]) -> dict:
    """Return one owned concept state with transparent BKT parameters."""
    if student_id != student.student_id:
        raise APIError(403, "forbidden", "Access denied. / Access nahi hai.")
    state, params = await session.get(MasteryState, (student_id, concept_id)), await session.get(BKTParameter, concept_id)
    if not state or not params:
        raise APIError(404, "mastery_unavailable", "No mastery evidence exists for this concept. / Is concept ka mastery evidence nahi hai.")
    return {"concept_id": str(concept_id), "mastery_percent": round(state.p_know * 100, 1), "attempts": state.attempts, "parameters": {"p_learn": params.p_learn, "p_slip": params.p_slip, "p_guess": params.p_guess, "source": params.source}}


@router.post("/path/generate", status_code=201)
async def generate_path(data: PathRequest, student: Annotated[Student, Depends(get_current_student)], session: Annotated[AsyncSession, Depends(get_db_session)]) -> dict:
    """Generate prerequisite-first path and use bandit uncertainty only for safe ties."""
    concepts = list((await session.execute(select(Concept).where(Concept.student_id == student.student_id, Concept.course_key == data.course_key))).scalars())
    if not concepts:
        raise APIError(409, "path_unavailable", "No extracted concepts exist for this course. / Course ke concepts available nahi hain.")
    edges = list((await session.execute(select(Prerequisite).where(Prerequisite.student_id == student.student_id, Prerequisite.confidence >= .85))).scalars())
    graph = build_graph([str(item.concept_id) for item in concepts], [(str(edge.prerequisite_concept_id), str(edge.concept_id)) for edge in edges])
    bandit_rows = list((await session.execute(select(BanditState).where(BanditState.student_id == student.student_id))).scalars())
    posteriors = {str(item.concept_id): (item.alpha, item.beta) for item in bandit_rows}
    order = bandit_topological_order(graph, posteriors, f"{student.student_id}:{data.course_key}")
    by_id = {str(item.concept_id): item for item in concepts}
    mastery_rows = list((await session.execute(select(MasteryState).where(MasteryState.student_id == student.student_id))).scalars()); known = {str(item.concept_id): item.p_know for item in mastery_rows}
    await session.execute(update(LearningPath).where(LearningPath.student_id == student.student_id, LearningPath.status == "active").values(status="superseded"))
    path = LearningPath(student_id=student.student_id, course_key=data.course_key, status="active"); session.add(path); await session.flush()
    steps=[]
    for position, concept_id in enumerate([item for item in order if known.get(item, 0) < .85], 1):
        concept=by_id[concept_id]; parents=list(graph.predecessors(concept_id)); reason = "Foundation concept from your uploaded material." if not parents else f"Recommended after prerequisites: {', '.join(by_id[parent].name for parent in parents)}."
        step=PathStep(path_id=path.path_id, concept_id=concept.concept_id, position=position, phase=concept.phase, reason=reason); session.add(step); steps.append(step)
        if await session.get(BanditState, (student.student_id, concept.concept_id)) is None: session.add(BanditState(student_id=student.student_id, concept_id=concept.concept_id))
    return {"path_id": str(path.path_id), "course_key": data.course_key, "steps": [{"concept_id": str(step.concept_id), "position": step.position, "phase": step.phase, "reason": step.reason} for step in steps]}


@router.get("/path/current")
async def current_path(student: Annotated[Student, Depends(get_current_student)], session: Annotated[AsyncSession, Depends(get_db_session)]) -> dict:
    """Return the latest active path and ordered explanations."""
    path = (await session.execute(select(LearningPath).where(LearningPath.student_id == student.student_id, LearningPath.status == "active").order_by(LearningPath.created_at.desc()))).scalars().first()
    if not path: raise APIError(404, "path_not_found", "No active learning path exists. / Active learning path nahi hai.")
    steps=list((await session.execute(select(PathStep, Concept).join(Concept).where(PathStep.path_id == path.path_id).order_by(PathStep.position))).all())
    return {"path_id": str(path.path_id), "course_key": path.course_key, "steps": [{"concept_id": str(c.concept_id), "concept": c.name, "position": s.position, "phase": s.phase, "reason": s.reason, "completed": s.completed} for s,c in steps]}


@router.get("/path/why/{concept_id}")
async def why_concept(concept_id: uuid.UUID, student: Annotated[Student, Depends(get_current_student)], session: Annotated[AsyncSession, Depends(get_db_session)]) -> dict:
    """Explain a recommendation with its persisted reason and evidence."""
    row=(await session.execute(select(PathStep,Concept,LearningPath).join(Concept,Concept.concept_id==PathStep.concept_id).join(LearningPath).where(PathStep.concept_id==concept_id,LearningPath.student_id==student.student_id,LearningPath.status=="active"))).first()
    if not row: raise APIError(404,"recommendation_not_found","Recommendation not found. / Recommendation nahi mili.")
    step,concept,_=row; return {"concept_id":str(concept_id),"concept":concept.name,"reason":step.reason,"source_evidence":concept.evidence,"mastery_basis":"real attempts when available; otherwise no mastery claim"}
