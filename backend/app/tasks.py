"""Resilient Celery tasks for asynchronous source-document extraction."""
from __future__ import annotations

import asyncio
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path

import structlog
from celery import group
from sqlalchemy import delete, select

from backend.app.database import SessionFactory
from backend.app.models.document import (
    Document,
    DocumentStatus,
    DocumentText,
    JobStatus,
    ProcessingJob,
)
from backend.app.services.extraction_service import ExtractionError, extract_text
from backend.app.services.text_cleaner import detect_language
from backend.app.worker import celery

logger = structlog.get_logger(__name__)


async def _update_job(session, job_id: uuid.UUID) -> None:
    """Lock and recalculate batch counters from durable document state."""
    job = (await session.execute(select(ProcessingJob).where(ProcessingJob.job_id == job_id).with_for_update())).scalar_one_or_none()
    if not job:
        return
    statuses = list((await session.execute(select(Document.status).where(Document.job_id == job_id))).scalars())
    job.completed_files = sum(status == DocumentStatus.SUCCESS for status in statuses)
    job.failed_files = sum(status == DocumentStatus.FAILED for status in statuses)
    terminal = job.completed_files + job.failed_files
    if terminal < job.total_files:
        job.status = JobStatus.PROCESSING
    elif job.completed_files == job.total_files:
        job.status = JobStatus.SUCCESS
    elif job.failed_files == job.total_files:
        job.status = JobStatus.FAILED
    else:
        job.status = JobStatus.PARTIAL


async def _process_document(document_id: uuid.UUID) -> dict[str, str]:
    """Extract and persist one document while converting all failures into state."""
    started = time.monotonic()
    async with SessionFactory() as session:
        document = (await session.execute(select(Document).where(Document.document_id == document_id).with_for_update())).scalar_one_or_none()
        if not document:
            logger.error("document_missing", document_id=str(document_id))
            return {"document_id": str(document_id), "status": "failed", "error": "Document record not found"}
        if document.status == DocumentStatus.SUCCESS:
            return {"document_id": str(document_id), "status": "success"}
        document.status = DocumentStatus.PROCESSING
        document.error_message = None
        job_id = document.job_id
        path, mime_type = Path(document.stored_path), document.mime_type
        await session.commit()

    logger.info("extraction_started", document_id=str(document_id), mime_type=mime_type)
    try:
        result = await asyncio.to_thread(extract_text, path, mime_type)
        if not result.pages or not any(page.content.strip() for page in result.pages):
            raise ExtractionError("Extraction produced no meaningful source text.")
        combined = "\n".join(page.content for page in result.pages)
        async with SessionFactory() as session:
            document = (await session.execute(select(Document).where(Document.document_id == document_id).with_for_update())).scalar_one()
            await session.execute(delete(DocumentText).where(DocumentText.document_id == document_id))
            session.add_all([
                DocumentText(
                    document_id=document_id, page_number=page.page_number, content=page.content,
                    char_count=len(page.content), extraction_method=page.method, confidence=page.confidence,
                ) for page in result.pages
            ])
            document.page_count = result.page_count
            document.language_detected = detect_language(combined)
            document.status = DocumentStatus.SUCCESS
            document.error_message = None
            document.processed_at = datetime.now(timezone.utc)
            await session.flush()
            from backend.app.services.concept_service import extract_and_store_concepts
            await extract_and_store_concepts(session, document_id)
            if job_id:
                await _update_job(session, job_id)
            await session.commit()
        methods = sorted({page.method for page in result.pages})
        logger.info("extraction_completed", document_id=str(document_id), methods=methods, duration_ms=round((time.monotonic() - started) * 1000), chars=len(combined))
        return {"document_id": str(document_id), "status": "success"}
    except Exception as exc:
        user_error = str(exc) if isinstance(exc, ExtractionError) else f"Text extraction failed: {exc}"
        async with SessionFactory() as session:
            document = (await session.execute(select(Document).where(Document.document_id == document_id).with_for_update())).scalar_one_or_none()
            if document:
                document.status = DocumentStatus.FAILED
                document.error_message = user_error[:4000]
                document.processed_at = datetime.now(timezone.utc)
                if document.job_id:
                    await _update_job(session, document.job_id)
                await session.commit()
        logger.exception("extraction_failed", document_id=str(document_id), duration_ms=round((time.monotonic() - started) * 1000))
        return {"document_id": str(document_id), "status": "failed", "error": user_error}


@celery.task(name="haafiz.process_document", bind=True, max_retries=0)
def process_document(self, document_id: str) -> dict[str, str]:
    """Celery entry point that always returns a durable success/failure result."""
    try:
        return asyncio.run(_process_document(uuid.UUID(document_id)))
    except Exception as exc:
        logger.exception("worker_task_failed", document_id=document_id)
        return {"document_id": document_id, "status": "failed", "error": str(exc)}


@celery.task(name="haafiz.process_batch")
def process_batch(job_id: str, document_ids: list[str]) -> dict[str, object]:
    """Fan a validated batch out into independent document extraction tasks."""
    group(process_document.s(document_id) for document_id in document_ids).apply_async()
    logger.info("batch_dispatched", job_id=job_id, total_files=len(document_ids))
    return {"job_id": job_id, "status": "processing", "total_files": len(document_ids)}
