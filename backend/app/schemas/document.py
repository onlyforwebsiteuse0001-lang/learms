"""Validated document API response contracts."""
from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class UploadedFileResponse(BaseModel):
    """Queued file metadata returned after durable upload."""

    file_id: uuid.UUID
    original_name: str
    size_bytes: int
    mime_type: str
    status: str


class UploadBatchResponse(BaseModel):
    """Response for an accepted asynchronous upload batch."""

    job_id: uuid.UUID
    status: str = "queued"
    files: list[UploadedFileResponse]
    message: str = "Files uploaded successfully. Processing started. / Files upload ho gayi hain; processing shuru hai."


class TextPageResponse(BaseModel):
    """One extracted page or logical document section."""

    model_config = ConfigDict(from_attributes=True)
    text_id: uuid.UUID
    page_number: int | None
    content: str
    char_count: int
    extraction_method: str
    confidence: float | None


class DocumentResponse(BaseModel):
    """Student-owned document metadata."""

    model_config = ConfigDict(from_attributes=True)
    document_id: uuid.UUID
    original_name: str
    mime_type: str
    size_bytes: int
    page_count: int | None
    language_detected: str
    status: str
    error_message: str | None
    created_at: datetime
    processed_at: datetime | None


class DocumentDetailResponse(DocumentResponse):
    """Document metadata with extracted page records."""

    text_pages: list[TextPageResponse]


class DocumentListResponse(BaseModel):
    """Paginated document listing."""

    items: list[DocumentResponse]
    page: int
    page_size: int
    total: int


class TextListResponse(BaseModel):
    """Paginated extracted text listing."""

    items: list[TextPageResponse]
    page: int
    page_size: int
    total: int


class JobResponse(BaseModel):
    """Current batch processing status and counters."""

    model_config = ConfigDict(from_attributes=True)
    job_id: uuid.UUID
    total_files: int
    completed_files: int
    failed_files: int
    status: str
    created_at: datetime
    updated_at: datetime


class ErrorResponse(BaseModel):
    """Stable user-facing error payload."""

    error: str
    message: str
    file: str | None = None
    details: dict[str, str | int] = Field(default_factory=dict)
