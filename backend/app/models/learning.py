"""Concept graph, diagnostic, mastery, and adaptive-path persistence models."""
from __future__ import annotations

import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.models.document import Base


class DiagnosticStatus(str, enum.Enum):
    """Diagnostic session lifecycle."""
    ACTIVE = "active"
    COMPLETE = "complete"


class PathStatus(str, enum.Enum):
    """Learning path lifecycle."""
    ACTIVE = "active"
    SUPERSEDED = "superseded"
    COMPLETE = "complete"


class Concept(Base):
    """Canonical student-owned concept grounded in uploaded source text."""
    __tablename__ = "concepts"
    __table_args__ = (UniqueConstraint("student_id", "course_key", "normalized_name", name="uq_concept_student_course_name"),)

    concept_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False, index=True)
    course_key: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    normalized_name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    difficulty: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    phase: Mapped[str] = mapped_column(String(30), default="foundation", nullable=False)
    extraction_method: Mapped[str] = mapped_column(String(40), nullable=False)
    confidence: Mapped[float] = mapped_column(Float, nullable=False)
    evidence: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class ConceptDocument(Base):
    """Provenance link between a concept and source document."""
    __tablename__ = "concept_documents"
    concept_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("concepts.concept_id", ondelete="CASCADE"), primary_key=True)
    document_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("documents.document_id", ondelete="CASCADE"), primary_key=True)
    evidence: Mapped[str] = mapped_column(Text, nullable=False)


class Prerequisite(Base):
    """Directed, evidence-backed prerequisite edge."""
    __tablename__ = "prerequisites"
    prerequisite_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False, index=True)
    prerequisite_concept_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("concepts.concept_id", ondelete="CASCADE"), nullable=False)
    concept_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("concepts.concept_id", ondelete="CASCADE"), nullable=False)
    confidence: Mapped[float] = mapped_column(Float, nullable=False)
    evidence: Mapped[str] = mapped_column(Text, nullable=False)
    extraction_method: Mapped[str] = mapped_column(String(40), nullable=False)
    approved: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)


class DiagnosticSession(Base):
    """Adaptive baseline session over source-grounded concept questions."""
    __tablename__ = "diagnostic_sessions"
    session_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False, index=True)
    course_key: Mapped[str] = mapped_column(String(120), nullable=False)
    status: Mapped[DiagnosticStatus] = mapped_column(String(20), default=DiagnosticStatus.ACTIVE.value, nullable=False)
    current_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    question_ids: Mapped[list[str]] = mapped_column(JSON, nullable=False)
    answers: Mapped[list[dict]] = mapped_column(JSON, default=list, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class DiagnosticQuestion(Base):
    """Deterministic source-grounded diagnostic item."""
    __tablename__ = "diagnostic_questions"
    question_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    concept_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("concepts.concept_id", ondelete="CASCADE"), nullable=False, index=True)
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    options: Mapped[list[str]] = mapped_column(JSON, nullable=False)
    correct_index: Mapped[int] = mapped_column(Integer, nullable=False)
    difficulty: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    evidence: Mapped[str] = mapped_column(Text, nullable=False)


class BKTParameter(Base):
    """Versioned per-concept BKT parameters, default or fitted."""
    __tablename__ = "bkt_parameters"
    concept_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("concepts.concept_id", ondelete="CASCADE"), primary_key=True)
    p_learn: Mapped[float] = mapped_column(Float, default=0.15, nullable=False)
    p_slip: Mapped[float] = mapped_column(Float, default=0.10, nullable=False)
    p_guess: Mapped[float] = mapped_column(Float, default=0.20, nullable=False)
    source: Mapped[str] = mapped_column(String(30), default="documented_default", nullable=False)
    sample_size: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class MasteryState(Base):
    """Current interpretable mastery probability for one student/concept."""
    __tablename__ = "mastery_state"
    student_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.student_id", ondelete="CASCADE"), primary_key=True)
    concept_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("concepts.concept_id", ondelete="CASCADE"), primary_key=True)
    p_know: Mapped[float] = mapped_column(Float, default=0.20, nullable=False)
    attempts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    correct_attempts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_updated: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class LearningPath(Base):
    """Explainable active path generated from graph and mastery state."""
    __tablename__ = "learning_paths"
    path_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False, index=True)
    course_key: Mapped[str] = mapped_column(String(120), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default=PathStatus.ACTIVE.value, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class PathStep(Base):
    """Ordered recommendation and human-readable rationale."""
    __tablename__ = "path_steps"
    step_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    path_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("learning_paths.path_id", ondelete="CASCADE"), nullable=False, index=True)
    concept_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("concepts.concept_id", ondelete="CASCADE"), nullable=False)
    position: Mapped[int] = mapped_column(Integer, nullable=False)
    phase: Mapped[str] = mapped_column(String(30), nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)


class BanditState(Base):
    """Beta posterior for prerequisite-safe Thompson Sampling."""
    __tablename__ = "bandit_state"
    student_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.student_id", ondelete="CASCADE"), primary_key=True)
    concept_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("concepts.concept_id", ondelete="CASCADE"), primary_key=True)
    alpha: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)
    beta: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)
    observations: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_reward: Mapped[float | None] = mapped_column(Float)
