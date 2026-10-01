"""Authenticated document upload, retrieval, deletion, and job-status routes."""
from __future__ import annotations

import uuid
import zipfile
from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, Depends, File, Query, UploadFile, status
from PIL import Image
from pypdf import PdfReader
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.api.dependencies import get_current_student
from backend.app.core.config import get_settings
from backend.app.database import get_db_session
from backend.app.models.document import Document, DocumentStatus, JobStatus, Student
from backend.app.schemas.document import (
    DocumentDetailResponse,
    DocumentListResponse,
    DocumentResponse,
    JobResponse,
    TextListResponse,
    TextPageResponse,
    UploadBatchResponse,
    UploadedFileResponse,
)
from backend.app.services import document_service
from backend.app.services.api_errors import APIError

router = APIRouter(tags=["documents"])

SUPPORTED_EXTENSIONS = {
    ".pdf": "application/pdf",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
    ".tif": "image/tiff", ".tiff": "image/tiff", ".bmp": "image/bmp",
}
SUPPORTED_LABEL = "PDF, DOCX, PPTX, JPG, JPEG, PNG, TIFF, BMP"


def _safe_filename(filename: str | None) -> str:
    """Strip path components and control characters from an uploaded name."""
    clean = Path(filename or "").name.replace("\x00", "").strip()
    if not clean or clean in {".", ".."}:
        raise APIError(400, "invalid_filename", "File name is invalid. / File ka naam durust nahi hai.")
    return clean[:255]


def _validate_file_container(path: Path, extension: str, original_name: str) -> None:
    """Reject empty, corrupt, mislabeled, or archive-bomb-like containers."""
    try:
        with path.open("rb") as source:
            header = source.read(8)
        if extension == ".pdf":
            if not header.startswith(b"%PDF-"):
                raise ValueError("PDF magic bytes are missing")
            reader = PdfReader(str(path), strict=False)
            if not reader.pages:
                raise ValueError("PDF has no pages")
        elif extension in {".docx", ".pptx"}:
            if not header.startswith(b"PK") or not zipfile.is_zipfile(path):
                raise ValueError("OpenXML package is not a valid ZIP container")
            required = "word/document.xml" if extension == ".docx" else "ppt/presentation.xml"
            with zipfile.ZipFile(path) as package:
                members = package.infolist()
                if len(members) > 10_000:
                    raise ValueError("OpenXML package has too many members")
                compressed = sum(max(member.compress_size, 1) for member in members)
                expanded = sum(member.file_size for member in members)
                if expanded > 500 * 1024 * 1024 or expanded / max(compressed, 1) > 100:
                    raise ValueError("OpenXML package expansion ratio is unsafe")
                if required not in package.namelist():
                    raise ValueError(f"missing {required}")
        else:
            with Image.open(path) as image:
                image.verify()
    except Exception as exc:
        raise APIError(
            400, "corrupt_file",
            f"File '{original_name}' is empty, corrupt, or does not match its extension. / File kharab hai ya format se match nahi karti.",
            file=original_name,
        ) from exc


async def _store_upload(upload: UploadFile, destination: Path, max_bytes: int, original_name: str) -> int:
    """Stream one upload to private storage while enforcing its configured byte limit."""
    size = 0
    created = False
    destination.parent.mkdir(parents=True, exist_ok=True)
    try:
        with destination.open("xb") as output:
            created = True
            while chunk := await upload.read(1024 * 1024):
                size += len(chunk)
                if size > max_bytes:
                    raise APIError(
                        413, "file_too_large",
                        f"File '{original_name}' exceeds the {max_bytes // (1024 * 1024)} MB limit. / File size limit se bari hai.",
                        file=original_name, details={"max_bytes": max_bytes},
                    )
                output.write(chunk)
    except Exception:
        if created:
            destination.unlink(missing_ok=True)
        raise
    finally:
        await upload.close()
    if size == 0:
        destination.unlink(missing_ok=True)
        raise APIError(400, "empty_file", f"File '{original_name}' is empty. / File khaali hai.", file=original_name)
    return size


@router.post("/documents/upload", response_model=UploadBatchResponse, status_code=status.HTTP_202_ACCEPTED)
async def upload_documents(
    files: Annotated[list[UploadFile], File(description="Up to the configured maximum supported study documents")],
    student: Annotated[Student, Depends(get_current_student)],
    session: Annotated[AsyncSession, Depends(get_db_session)],
) -> UploadBatchResponse:
    """Validate, durably store, enqueue, and return one multi-file processing job."""
    settings = get_settings()
    if not files:
        raise APIError(400, "no_files", "Select at least one file. / Kam az kam aik file select karein.")
    if len(files) > settings.max_files_per_upload:
        raise APIError(400, "too_many_files", f"Maximum {settings.max_files_per_upload} files are allowed per request. / Aik request mein zyada files hain.", details={"max_files": settings.max_files_per_upload})

    validated: list[tuple[UploadFile, str, str]] = []
    for upload in files:
        name = _safe_filename(upload.filename)
        extension = Path(name).suffix.lower()
        if extension not in SUPPORTED_EXTENSIONS:
            raise APIError(400, "unsupported_format", f"File '{name}' has unsupported format. Supported: {SUPPORTED_LABEL}. / Yeh file format supported nahi hai.", file=name)
        validated.append((upload, name, SUPPORTED_EXTENSIONS[extension]))

    student_dir = settings.upload_dir / str(student.student_id)
    stored: list[tuple[Path, str, str, int]] = []
    try:
        for upload, name, mime_type in validated:
            destination = student_dir / f"{uuid.uuid4()}{Path(name).suffix.lower()}"
            size = await _store_upload(upload, destination, settings.max_upload_mb * 1024 * 1024, name)
            stored.append((destination, name, mime_type, size))
            _validate_file_container(destination, Path(name).suffix.lower(), name)
    except Exception:
        for path, *_ in stored:
            path.unlink(missing_ok=True)
        raise

    job = await document_service.create_job(session, student.student_id, len(stored))
    records = []
    for path, name, mime_type, size in stored:
        records.append(await document_service.upload_document(
            session, student_id=student.student_id, job_id=job.job_id, original_name=name,
            stored_path=path, mime_type=mime_type, size_bytes=size,
        ))
    await session.commit()  # Worker must never race uncommitted document rows.
    try:
        from backend.app.tasks import process_batch
        process_batch.delay(str(job.job_id), [str(record.document_id) for record in records])
    except Exception as exc:
        # Files remain queued and can be retried; no success state is fabricated.
        raise APIError(503, "processing_queue_unavailable", "Files were saved, but the processing queue is unavailable. Please retry shortly. / Files save ho gayi hain lekin processing service available nahi.") from exc
    return UploadBatchResponse(
        job_id=job.job_id,
        files=[UploadedFileResponse(file_id=record.document_id, original_name=record.original_name, size_bytes=record.size_bytes, mime_type=record.mime_type, status=record.status.value) for record in records],
    )


@router.get("/documents", response_model=DocumentListResponse)
async def documents(
    student: Annotated[Student, Depends(get_current_student)],
    session: Annotated[AsyncSession, Depends(get_db_session)],
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
) -> DocumentListResponse:
    """List only documents owned by the authenticated student."""
    items, total = await document_service.list_documents(session, student.student_id, page, page_size)
    return DocumentListResponse(items=[DocumentResponse.model_validate(item) for item in items], page=page, page_size=page_size, total=total)


@router.get("/documents/{document_id}", response_model=DocumentDetailResponse)
async def document_detail(document_id: uuid.UUID, student: Annotated[Student, Depends(get_current_student)], session: Annotated[AsyncSession, Depends(get_db_session)]) -> DocumentDetailResponse:
    """Return metadata and extracted pages for one owned document."""
    document = await document_service.get_document(session, student.student_id, document_id, with_text=True)
    if not document:
        raise APIError(404, "document_not_found", "Document not found. / Document nahi mila.")
    return DocumentDetailResponse.model_validate(document)


@router.delete("/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(document_id: uuid.UUID, student: Annotated[Student, Depends(get_current_student)], session: Annotated[AsyncSession, Depends(get_db_session)]) -> None:
    """Delete an owned document, extracted text, and its stored source file."""
    document = await document_service.get_document(session, student.student_id, document_id)
    if not document:
        raise APIError(404, "document_not_found", "Document not found. / Document nahi mila.")
    await document_service.delete_document(session, document)


@router.get("/documents/{document_id}/text", response_model=TextListResponse)
async def document_text(document_id: uuid.UUID, student: Annotated[Student, Depends(get_current_student)], session: Annotated[AsyncSession, Depends(get_db_session)], page: Annotated[int, Query(ge=1)] = 1, page_size: Annotated[int, Query(ge=1, le=100)] = 20) -> TextListResponse:
    """Return paginated extracted text after enforcing document ownership."""
    document = await document_service.get_document(session, student.student_id, document_id)
    if not document:
        raise APIError(404, "document_not_found", "Document not found. / Document nahi mila.")
    items, total = await document_service.list_document_text(session, document_id, page, page_size)
    return TextListResponse(items=[TextPageResponse.model_validate(item) for item in items], page=page, page_size=page_size, total=total)


@router.get("/jobs/{job_id}", response_model=JobResponse)
async def job_status(job_id: uuid.UUID, student: Annotated[Student, Depends(get_current_student)], session: Annotated[AsyncSession, Depends(get_db_session)]) -> JobResponse:
    """Poll one student-owned asynchronous processing job."""
    job = await document_service.get_job(session, student.student_id, job_id)
    if not job:
        raise APIError(404, "job_not_found", "Processing job not found. / Processing job nahi mila.")
    return JobResponse.model_validate(job)

@router.post("/jobs/{job_id}/retry", response_model=JobResponse, status_code=status.HTTP_202_ACCEPTED)
async def retry_job(job_id: uuid.UUID, student: Annotated[Student, Depends(get_current_student)], session: Annotated[AsyncSession, Depends(get_db_session)]) -> JobResponse:
    """Requeue only failed student-owned documents without duplicating successful extraction."""
    job = await document_service.get_job(session, student.student_id, job_id)
    if not job:
        raise APIError(404, "job_not_found", "Processing job not found. / Processing job nahi mila.")
    failed = list((await session.execute(select(Document).where(Document.job_id == job_id, Document.student_id == student.student_id, Document.status == DocumentStatus.FAILED))).scalars())
    if not failed:
        raise APIError(409, "nothing_to_retry", "This job has no failed documents to retry. / Retry ke liye failed document nahi hai.")
    for document in failed:
        document.status = DocumentStatus.QUEUED
        document.error_message = None
        document.processed_at = None
    job.status = JobStatus.QUEUED
    job.failed_files = 0
    await session.commit()
    try:
        from backend.app.tasks import process_batch
        process_batch.delay(str(job_id), [str(document.document_id) for document in failed])
    except Exception as exc:
        raise APIError(503, "processing_queue_unavailable", "Documents are queued but the processing service is unavailable. / Processing service available nahi hai.") from exc
    return JobResponse.model_validate(job)
