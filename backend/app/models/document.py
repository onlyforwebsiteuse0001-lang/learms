"""Persistence models for authenticated students and document processing."""
from __future__ import annotations

import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    BigInteger,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    """Declarative base shared by Phase 1 models."""


class DocumentStatus(str, enum.Enum):
    """Allowed lifecycle states for an uploaded document."""

    QUEUED = "queued"
    PROCESSING = "processing"
    SUCCESS = "success"
    FAILED = "failed"


class JobStatus(str, enum.Enum):
    """Allowed lifecycle states for a multi-document processing job."""

    QUEUED = "queued"
    PROCESSING = "processing"
    PARTIAL = "partial"
    SUCCESS = "success"
    FAILED = "failed"


class Student(Base):
    """Minimal authenticated student identity required by the upload API."""

    __tablename__ = "students"

    student_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(30), default="student", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    documents: Mapped[list[Document]] = relationship(back_populates="student", cascade="all, delete-orphan")
    jobs: Mapped[list[ProcessingJob]] = relationship(back_populates="student", cascade="all, delete-orphan")


class ProcessingJob(Base):
    """Batch-level status and counters for one upload request."""

    __tablename__ = "processing_jobs"
    __table_args__ = (Index("ix_processing_jobs_student_status", "student_id", "status"),)

    job_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False)
    total_files: Mapped[int] = mapped_column(Integer, nullable=False)
    completed_files: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    failed_files: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    status: Mapped[JobStatus] = mapped_column(Enum(JobStatus, name="job_status", values_callable=lambda x: [e.value for e in x]), default=JobStatus.QUEUED, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    student: Mapped[Student] = relationship(back_populates="jobs")
    documents: Mapped[list[Document]] = relationship(back_populates="job")


class Document(Base):
    """Uploaded source file and its durable processing state."""

    __tablename__ = "documents"
    __table_args__ = (
        Index("ix_documents_student_created", "student_id", "created_at"),
        Index("ix_documents_status", "status"),
    )

    document_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False)
    job_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("processing_jobs.job_id", ondelete="SET NULL"))
    original_name: Mapped[str] = mapped_column(String(255), nullable=False)
    stored_path: Mapped[str] = mapped_column(String(1024), nullable=False)
    mime_type: Mapped[str] = mapped_column(String(120), nullable=False)
    size_bytes: Mapped[int] = mapped_column(BigInteger, nullable=False)
    page_count: Mapped[int | None] = mapped_column(Integer)
    language_detected: Mapped[str] = mapped_column(String(20), default="unknown", nullable=False)
    status: Mapped[DocumentStatus] = mapped_column(Enum(DocumentStatus, name="document_status", values_callable=lambda x: [e.value for e in x]), default=DocumentStatus.QUEUED, nullable=False)
    error_message: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    processed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    student: Mapped[Student] = relationship(back_populates="documents")
    job: Mapped[ProcessingJob | None] = relationship(back_populates="documents")
    text_pages: Mapped[list[DocumentText]] = relationship(back_populates="document", cascade="all, delete-orphan", order_by="DocumentText.page_number")


class DocumentText(Base):
    """Extracted text with per-page provenance and optional OCR confidence."""

    __tablename__ = "document_text"
    __table_args__ = (Index("ix_document_text_document", "document_id"),)

    text_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("documents.document_id", ondelete="CASCADE"), nullable=False)
    page_number: Mapped[int | None] = mapped_column(Integer)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    char_count: Mapped[int] = mapped_column(Integer, nullable=False)
    extraction_method: Mapped[str] = mapped_column(String(40), nullable=False)
    confidence: Mapped[float | None] = mapped_column(Float)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    document: Mapped[Document] = relationship(back_populates="text_pages")
