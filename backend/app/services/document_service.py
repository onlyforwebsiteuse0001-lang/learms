"""Database operations for student-owned documents and processing jobs."""
from __future__ import annotations

import uuid
from pathlib import Path

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.app.models.document import (
    Document,
    DocumentStatus,
    DocumentText,
    ProcessingJob,
)


async def create_job(session: AsyncSession, student_id: uuid.UUID, total_files: int) -> ProcessingJob:
    """Create and flush a queued batch job."""
    job = ProcessingJob(student_id=student_id, total_files=total_files)
    session.add(job)
    await session.flush()
    return job


async def upload_document(
    session: AsyncSession,
    *,
    student_id: uuid.UUID,
    job_id: uuid.UUID,
    original_name: str,
    stored_path: Path,
    mime_type: str,
    size_bytes: int,
) -> Document:
    """Persist metadata for a file that has already been durably stored."""
    document = Document(
        student_id=student_id,
        job_id=job_id,
        original_name=original_name,
        stored_path=str(stored_path),
        mime_type=mime_type,
        size_bytes=size_bytes,
        status=DocumentStatus.QUEUED,
    )
    session.add(document)
    await session.flush()
    return document


async def get_document(session: AsyncSession, student_id: uuid.UUID, document_id: uuid.UUID, with_text: bool = False) -> Document | None:
    """Return one document only when owned by the authenticated student."""
    statement = select(Document).where(Document.document_id == document_id, Document.student_id == student_id)
    if with_text:
        statement = statement.options(selectinload(Document.text_pages))
    return (await session.execute(statement)).scalar_one_or_none()


async def list_documents(session: AsyncSession, student_id: uuid.UUID, page: int, page_size: int) -> tuple[list[Document], int]:
    """Return newest-first documents and an ownership-scoped total."""
    total = await session.scalar(select(func.count()).select_from(Document).where(Document.student_id == student_id))
    statement = (
        select(Document)
        .where(Document.student_id == student_id)
        .order_by(Document.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    return list((await session.execute(statement)).scalars()), int(total or 0)


async def list_document_text(session: AsyncSession, document_id: uuid.UUID, page: int, page_size: int) -> tuple[list[DocumentText], int]:
    """Return ordered text records for an already ownership-checked document."""
    condition = DocumentText.document_id == document_id
    total = await session.scalar(select(func.count()).select_from(DocumentText).where(condition))
    statement = select(DocumentText).where(condition).order_by(DocumentText.page_number.asc().nulls_last()).offset((page - 1) * page_size).limit(page_size)
    return list((await session.execute(statement)).scalars()), int(total or 0)


async def delete_document(session: AsyncSession, document: Document) -> None:
    """Delete database state and best-effort remove the private stored file."""
    stored_path = Path(document.stored_path)
    await session.delete(document)
    await session.flush()
    try:
        stored_path.unlink(missing_ok=True)
    except OSError:
        # DB ownership deletion must not leak or fail because a volume is temporarily read-only.
        pass


async def get_job(session: AsyncSession, student_id: uuid.UUID, job_id: uuid.UUID) -> ProcessingJob | None:
    """Return a processing job only when it belongs to the current student."""
    return (await session.execute(select(ProcessingJob).where(ProcessingJob.job_id == job_id, ProcessingJob.student_id == student_id))).scalar_one_or_none()


async def update_status(session: AsyncSession, document: Document, status: DocumentStatus, error_message: str | None = None) -> None:
    """Update document lifecycle status and a sanitized extraction error."""
    document.status = status
    document.error_message = error_message[:4000] if error_message else None
    await session.flush()
