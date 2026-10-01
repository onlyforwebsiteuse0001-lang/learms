"""Direct async contract tests for learning API ownership and unavailable branches."""
from __future__ import annotations

import uuid
from types import SimpleNamespace

import pytest

from backend.app.api.v1.learning import (
    DiagnosticStart,
    PathRequest,
    concept_mastery,
    concepts,
    current_path,
    diagnostic_result,
    generate_path,
    mastery,
    prerequisites,
    start_diagnostic,
    why_concept,
)
from backend.app.models.document import Student
from backend.app.models.learning import (
    BKTParameter,
    Concept,
    DiagnosticQuestion,
    DiagnosticSession,
    MasteryState,
)
from backend.app.services.api_errors import APIError


class ScalarRows:
    """Small SQLAlchemy ScalarResult test double."""

    def __init__(self, values: list): self.values = values
    def __iter__(self): return iter(self.values)
    def first(self): return self.values[0] if self.values else None


class Result:
    """Small result test double supporting route-used projections."""

    def __init__(self, values: list): self.values = values
    def scalars(self): return ScalarRows(self.values)
    def all(self): return self.values
    def first(self): return self.values[0] if self.values else None


class FakeSession:
    """Queue-based async session double."""

    def __init__(self, *, executes: list[list] | None = None, scalars: list | None = None, gets: dict | None = None):
        self.executes = list(executes or []); self.scalar_values = list(scalars or []); self.gets = gets or {}; self.added = []
    async def execute(self, _statement): return Result(self.executes.pop(0))
    async def scalar(self, _statement): return self.scalar_values.pop(0)
    async def get(self, model, key): return self.gets.get((model, key))
    def add(self, value): self.added.append(value)
    async def flush(self):
        for value in self.added:
            if hasattr(value, "session_id") and value.session_id is None: value.session_id = uuid.uuid4()
            if hasattr(value, "path_id") and value.path_id is None: value.path_id = uuid.uuid4()


def student() -> Student:
    """Build a persisted-looking student."""
    return Student(student_id=uuid.uuid4(), name="Test", email=f"{uuid.uuid4()}@example.com", password_hash="hash", role="student")


def concept(owner: uuid.UUID, name: str = "Biology") -> Concept:
    """Build a source-grounded concept."""
    return Concept(concept_id=uuid.uuid4(), student_id=owner, course_key="course", name=name, normalized_name=name.lower(), description="Source description", extraction_method="deterministic_source_only", confidence=.8, evidence=name)


@pytest.mark.asyncio
async def test_concept_list_serializes_provenance() -> None:
    owner = student(); item = concept(owner.student_id)
    response = await concepts("course", owner, FakeSession(executes=[[item]]))
    assert response[0]["concept_id"] == str(item.concept_id)
    assert response[0]["evidence"] == "Biology"


@pytest.mark.asyncio
async def test_prerequisites_unknown_or_cross_tenant_is_404() -> None:
    with pytest.raises(APIError) as caught:
        await prerequisites(uuid.uuid4(), student(), FakeSession(scalars=[None]))
    assert caught.value.status_code == 404


@pytest.mark.asyncio
async def test_prerequisites_serialize_edge_evidence() -> None:
    owner = student(); item = concept(owner.student_id)
    edge = SimpleNamespace(confidence=.9, evidence="A requires B", approved=False)
    response = await prerequisites(item.concept_id, owner, FakeSession(scalars=[item.concept_id], executes=[[(edge, item)]]))
    assert response == [{"concept_id": str(item.concept_id), "name": item.name, "confidence": .9, "evidence": "A requires B", "approved": False}]


@pytest.mark.asyncio
async def test_diagnostic_start_unavailable_has_bilingual_error() -> None:
    with pytest.raises(APIError) as caught:
        await start_diagnostic(DiagnosticStart(course_key="course"), student(), FakeSession(executes=[[]]))
    assert caught.value.code == "diagnostic_unavailable" and "/" in caught.value.message


@pytest.mark.asyncio
async def test_diagnostic_start_returns_first_question_without_answer() -> None:
    owner = student(); item = concept(owner.student_id)
    questions = [DiagnosticQuestion(question_id=uuid.uuid4(), concept_id=item.concept_id, prompt=f"Question {index}", options=["A", "B", "C"], correct_index=0, difficulty=1, evidence="A") for index in range(3)]
    response = await start_diagnostic(DiagnosticStart(course_key="course"), owner, FakeSession(executes=[questions]))
    assert response["total_questions"] == 3
    assert "correct_index" not in response["question"] and "evidence" not in response["question"]


@pytest.mark.asyncio
async def test_diagnostic_result_enforces_ownership() -> None:
    owner = student(); other = student(); session_id = uuid.uuid4()
    diagnostic = DiagnosticSession(session_id=session_id, student_id=other.student_id, course_key="course", status="active", current_index=0, question_ids=[], answers=[])
    with pytest.raises(APIError) as caught:
        await diagnostic_result(session_id, owner, FakeSession(gets={(DiagnosticSession, session_id): diagnostic}))
    assert caught.value.status_code == 404


@pytest.mark.asyncio
async def test_diagnostic_result_reports_only_observed_answers() -> None:
    owner = student(); session_id = uuid.uuid4(); answers = [{"correct": True}]
    diagnostic = DiagnosticSession(session_id=session_id, student_id=owner.student_id, course_key="course", status="active", current_index=1, question_ids=["a", "b"], answers=answers)
    response = await diagnostic_result(session_id, owner, FakeSession(gets={(DiagnosticSession, session_id): diagnostic}))
    assert response["answered"] == 1 and response["total"] == 2 and response["answers"] == answers


@pytest.mark.asyncio
async def test_mastery_cross_tenant_access_is_forbidden() -> None:
    owner = student()
    with pytest.raises(APIError) as caught:
        await mastery(uuid.uuid4(), owner, FakeSession())
    assert caught.value.status_code == 403


@pytest.mark.asyncio
async def test_mastery_empty_state_is_honestly_empty() -> None:
    owner = student()
    assert await mastery(owner.student_id, owner, FakeSession(executes=[[]])) == []


@pytest.mark.asyncio
async def test_mastery_serializes_exact_percentage() -> None:
    owner = student(); item = concept(owner.student_id); state = MasteryState(student_id=owner.student_id, concept_id=item.concept_id, p_know=.734, attempts=4, correct_attempts=3)
    response = await mastery(owner.student_id, owner, FakeSession(executes=[[(state, item)]]))
    assert response[0]["mastery_percent"] == 73.4 and response[0]["attempts"] == 4


@pytest.mark.asyncio
async def test_concept_mastery_missing_evidence_is_404() -> None:
    owner = student(); concept_id = uuid.uuid4()
    with pytest.raises(APIError) as caught:
        await concept_mastery(owner.student_id, concept_id, owner, FakeSession())
    assert caught.value.code == "mastery_unavailable"


@pytest.mark.asyncio
async def test_concept_mastery_shows_default_parameter_source() -> None:
    owner = student(); concept_id = uuid.uuid4()
    state = MasteryState(student_id=owner.student_id, concept_id=concept_id, p_know=.5, attempts=2, correct_attempts=1)
    params = BKTParameter(concept_id=concept_id, p_learn=.15, p_slip=.1, p_guess=.2, source="documented_default", sample_size=0)
    fake = FakeSession(gets={(MasteryState, (owner.student_id, concept_id)): state, (BKTParameter, concept_id): params})
    response = await concept_mastery(owner.student_id, concept_id, owner, fake)
    assert response["mastery_percent"] == 50 and response["parameters"]["source"] == "documented_default"


@pytest.mark.asyncio
async def test_path_generation_without_concepts_is_explicitly_unavailable() -> None:
    with pytest.raises(APIError) as caught:
        await generate_path(PathRequest(course_key="course"), student(), FakeSession(executes=[[]]))
    assert caught.value.code == "path_unavailable"


@pytest.mark.asyncio
async def test_current_path_missing_is_404() -> None:
    with pytest.raises(APIError) as caught:
        await current_path(student(), FakeSession(executes=[[]]))
    assert caught.value.code == "path_not_found"


@pytest.mark.asyncio
async def test_why_missing_recommendation_is_404() -> None:
    with pytest.raises(APIError) as caught:
        await why_concept(uuid.uuid4(), student(), FakeSession(executes=[[]]))
    assert caught.value.code == "recommendation_not_found"

from backend.app.api.v1.learning import DiagnosticAnswer, answer_diagnostic
from backend.app.models.learning import BanditState


def diagnostic_fixture(owner: Student, *, status: str = "active", question_count: int = 1):
    concept_id = uuid.uuid4()
    questions = [DiagnosticQuestion(question_id=uuid.uuid4(), concept_id=concept_id, prompt=f"Question {index}", options=["A", "B"], correct_index=0, difficulty=1, evidence="Source") for index in range(question_count)]
    session_id = uuid.uuid4()
    diagnostic = DiagnosticSession(session_id=session_id, student_id=owner.student_id, course_key="course", status=status, current_index=0, question_ids=[str(question.question_id) for question in questions], answers=[])
    return diagnostic, questions


@pytest.mark.asyncio
async def test_answer_unknown_diagnostic_is_404() -> None:
    owner = student(); session_id = uuid.uuid4()
    with pytest.raises(APIError) as caught:
        await answer_diagnostic(session_id, DiagnosticAnswer(question_id=uuid.uuid4(), selected_index=0), owner, FakeSession())
    assert caught.value.code == "diagnostic_not_found"


@pytest.mark.asyncio
async def test_answer_completed_diagnostic_is_conflict() -> None:
    owner = student(); diagnostic, questions = diagnostic_fixture(owner, status="complete")
    fake = FakeSession(gets={(DiagnosticSession, diagnostic.session_id): diagnostic})
    with pytest.raises(APIError) as caught:
        await answer_diagnostic(diagnostic.session_id, DiagnosticAnswer(question_id=questions[0].question_id, selected_index=0), owner, fake)
    assert caught.value.code == "diagnostic_complete"


@pytest.mark.asyncio
async def test_answer_must_match_current_question() -> None:
    owner = student(); diagnostic, _ = diagnostic_fixture(owner)
    fake = FakeSession(gets={(DiagnosticSession, diagnostic.session_id): diagnostic})
    with pytest.raises(APIError) as caught:
        await answer_diagnostic(diagnostic.session_id, DiagnosticAnswer(question_id=uuid.uuid4(), selected_index=0), owner, fake)
    assert caught.value.code == "wrong_question"


@pytest.mark.asyncio
async def test_answer_rejects_option_outside_actual_option_list() -> None:
    owner = student(); diagnostic, questions = diagnostic_fixture(owner)
    fake = FakeSession(gets={(DiagnosticSession, diagnostic.session_id): diagnostic, (DiagnosticQuestion, questions[0].question_id): questions[0]})
    with pytest.raises(APIError) as caught:
        await answer_diagnostic(diagnostic.session_id, DiagnosticAnswer(question_id=questions[0].question_id, selected_index=2), owner, fake)
    assert caught.value.code == "invalid_option"


@pytest.mark.asyncio
@pytest.mark.parametrize(("selected", "correct"), [(0, True), (1, False)])
async def test_answer_updates_bkt_bandit_and_completes(selected: int, correct: bool) -> None:
    owner = student(); diagnostic, questions = diagnostic_fixture(owner); question = questions[0]
    params = BKTParameter(concept_id=question.concept_id, p_learn=.15, p_slip=.1, p_guess=.2, source="documented_default", sample_size=0)
    fake = FakeSession(gets={(DiagnosticSession, diagnostic.session_id): diagnostic, (DiagnosticQuestion, question.question_id): question, (BKTParameter, question.concept_id): params})
    response = await answer_diagnostic(diagnostic.session_id, DiagnosticAnswer(question_id=question.question_id, selected_index=selected), owner, fake)
    assert response["correct"] is correct and response["status"] == "complete"
    state = next(value for value in fake.added if isinstance(value, MasteryState))
    bandit = next(value for value in fake.added if isinstance(value, BanditState))
    assert state.attempts == 1 and state.correct_attempts == int(correct)
    assert bandit.observations == 1 and 0 <= bandit.last_reward <= 1


@pytest.mark.asyncio
async def test_answer_returns_next_question_without_answer_leak() -> None:
    owner = student(); diagnostic, questions = diagnostic_fixture(owner, question_count=2); first, second = questions
    fake = FakeSession(gets={(DiagnosticSession, diagnostic.session_id): diagnostic, (DiagnosticQuestion, first.question_id): first, (DiagnosticQuestion, second.question_id): second})
    response = await answer_diagnostic(diagnostic.session_id, DiagnosticAnswer(question_id=first.question_id, selected_index=0), owner, fake)
    assert response["status"] == "active" and response["question"]["question_id"] == str(second.question_id)
    assert "correct_index" not in response["question"]
