"""Persistence orchestration for source-grounded concepts and graph edges."""
from __future__ import annotations

import uuid
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ai_services.concept_router import extract_concepts
from backend.app.core.config import get_settings
from backend.app.models.document import Document, DocumentText
from backend.app.models.learning import (
    BKTParameter,
    Concept,
    ConceptDocument,
    DiagnosticQuestion,
    Prerequisite,
)
from backend.app.services.concept_extraction_service import normalize_name
from backend.app.services.graph_service import GraphCycleError, build_graph


async def extract_and_store_concepts(session: AsyncSession, document_id: uuid.UUID) -> int:
    """Extract source-only concepts, deduplicate, reject graph cycles, and create grounded questions."""
    document = await session.get(Document, document_id)
    if not document:
        raise ValueError("Document not found")
    pages = list((await session.execute(select(DocumentText).where(DocumentText.document_id == document_id).order_by(DocumentText.page_number))).scalars())
    text = "\n".join(page.content for page in pages)
    routed = extract_concepts(text, get_settings())
    candidates, edge_candidates = routed.concepts, routed.prerequisites
    if not candidates:
        return 0
    course_key = normalize_name(Path(document.original_name).stem)[:120] or "uploaded-course"
    existing = list((await session.execute(select(Concept).where(Concept.student_id == document.student_id, Concept.course_key == course_key))).scalars())
    by_name = {item.normalized_name: item for item in existing}
    for candidate in candidates:
        normalized = normalize_name(candidate.name)
        concept = by_name.get(normalized)
        if concept is None:
            concept = Concept(student_id=document.student_id, course_key=course_key, name=candidate.name, normalized_name=normalized, description=candidate.description, extraction_method=candidate.method, confidence=candidate.confidence, evidence=candidate.evidence)
            session.add(concept); await session.flush(); by_name[normalized] = concept
            session.add(BKTParameter(concept_id=concept.concept_id))
        link = await session.get(ConceptDocument, (concept.concept_id, document_id))
        if link is None:
            session.add(ConceptDocument(concept_id=concept.concept_id, document_id=document_id, evidence=candidate.evidence))
    await session.flush()
    current_edges = list((await session.execute(select(Prerequisite).where(Prerequisite.student_id == document.student_id))).scalars())
    graph_edges = [(str(edge.prerequisite_concept_id), str(edge.concept_id)) for edge in current_edges]
    ids = [str(concept.concept_id) for concept in by_name.values()]
    for edge in edge_candidates:
        source, target = by_name.get(normalize_name(edge.source_name)), by_name.get(normalize_name(edge.target_name))
        if not source or not target:
            continue
        try:
            build_graph(ids, graph_edges + [(str(source.concept_id), str(target.concept_id))])
        except GraphCycleError:
            continue
        session.add(Prerequisite(student_id=document.student_id, prerequisite_concept_id=source.concept_id, concept_id=target.concept_id, confidence=edge.confidence, evidence=edge.evidence, extraction_method=edge.method, approved=False))
        graph_edges.append((str(source.concept_id), str(target.concept_id)))
    concepts = list(by_name.values())
    if len(concepts) >= 3:
        evidence_pool = [concept.evidence for concept in concepts]
        for index, concept in enumerate(concepts):
            exists = await session.scalar(select(DiagnosticQuestion.question_id).where(DiagnosticQuestion.concept_id == concept.concept_id))
            if exists:
                continue
            distractors = [evidence_pool[(index + 1) % len(evidence_pool)], evidence_pool[(index + 2) % len(evidence_pool)]]
            session.add(DiagnosticQuestion(concept_id=concept.concept_id, prompt=f"Which source heading identifies the concept ‘{concept.name}’?", options=[concept.evidence, *distractors], correct_index=0, difficulty=concept.difficulty, evidence=concept.evidence))
    await session.flush()
    return len(candidates)
