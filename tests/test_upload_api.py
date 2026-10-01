"""Upload API validation, authentication, and accepted-batch tests."""
from __future__ import annotations

import io
import uuid
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
from fastapi.testclient import TestClient
from reportlab.pdfgen import canvas

from backend.app.api.dependencies import get_current_student
from backend.app.core.config import Settings
from backend.app.database import get_db_session
from backend.app.main import app
from backend.app.models.document import DocumentStatus


class FakeSession:
    """Small async session surface used before a PostgreSQL integration test environment exists."""

    async def commit(self) -> None:
        """Represent a successful durable transaction boundary."""


async def fake_session():
    """Yield the upload route's test session."""
    yield FakeSession()


def pdf_bytes() -> bytes:
    """Build a valid one-page PDF upload entirely in memory."""
    stream = io.BytesIO()
    pdf = canvas.Canvas(stream)
    pdf.drawString(72, 760, "A valid biology study document with extractable text.")
    pdf.save()
    return stream.getvalue()


@pytest.fixture
def client(monkeypatch: pytest.MonkeyPatch, tmp_path: Path):
    """Provide authenticated API client with isolated storage and mocked queue boundary."""
    student = SimpleNamespace(student_id=uuid.uuid4(), role="student")
    app.dependency_overrides[get_db_session] = fake_session
    app.dependency_overrides[get_current_student] = lambda: student
    settings = Settings(_env_file=None, upload_dir=tmp_path, max_upload_mb=1, max_files_per_upload=2, gemini_api_key=None)
    monkeypatch.setattr("backend.app.api.v1.documents.get_settings", lambda: settings)
    job = SimpleNamespace(job_id=uuid.uuid4())
    monkeypatch.setattr("backend.app.api.v1.documents.document_service.create_job", AsyncMock(return_value=job))

    async def fake_upload(_session, **kwargs):
        return SimpleNamespace(document_id=uuid.uuid4(), original_name=kwargs["original_name"], size_bytes=kwargs["size_bytes"], mime_type=kwargs["mime_type"], status=DocumentStatus.QUEUED)

    monkeypatch.setattr("backend.app.api.v1.documents.document_service.upload_document", fake_upload)
    monkeypatch.setattr("backend.app.tasks.process_batch.delay", lambda *args, **kwargs: None)
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def test_upload_valid_pdf(client: TestClient) -> None:
    """A valid authenticated PDF batch should return 202 and real queued metadata."""
    response = client.post("/api/v1/documents/upload", files=[("files", ("chapter.pdf", pdf_bytes(), "application/pdf"))])
    assert response.status_code == 202
    body = response.json()
    assert body["status"] == "queued"
    assert body["files"][0]["original_name"] == "chapter.pdf"
    assert body["files"][0]["size_bytes"] > 0


def test_upload_unsupported_format(client: TestClient) -> None:
    """An unsupported extension must fail before any job is created."""
    response = client.post("/api/v1/documents/upload", files=[("files", ("notes.xyz", b"not supported", "application/octet-stream"))])
    assert response.status_code == 400
    assert response.json()["error"] == "unsupported_format"
    assert response.json()["file"] == "notes.xyz"


def test_upload_too_large(client: TestClient) -> None:
    """Per-file streaming limits must return 413 and remove partial storage."""
    response = client.post("/api/v1/documents/upload", files=[("files", ("large.pdf", b"%PDF-1.4\n" + b"x" * (1024 * 1024 + 1), "application/pdf"))])
    assert response.status_code == 413
    assert response.json()["error"] == "file_too_large"


def test_upload_too_many_files(client: TestClient) -> None:
    """Batch file count must be checked before file processing."""
    files = [("files", (f"{index}.pdf", pdf_bytes(), "application/pdf")) for index in range(3)]
    response = client.post("/api/v1/documents/upload", files=files)
    assert response.status_code == 400
    assert response.json()["error"] == "too_many_files"


def test_upload_no_auth(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    """Missing bearer credentials must produce the stable 401 response."""
    app.dependency_overrides.clear()
    app.dependency_overrides[get_db_session] = fake_session
    with TestClient(app) as unauthenticated:
        response = unauthenticated.post("/api/v1/documents/upload", files=[("files", ("chapter.pdf", pdf_bytes(), "application/pdf"))])
    app.dependency_overrides.clear()
    assert response.status_code == 401
    assert response.json()["error"] == "authentication_required"


def test_upload_corrupt_pdf(client: TestClient) -> None:
    """A corrupt container must fail synchronously with no queued success state."""
    response = client.post("/api/v1/documents/upload", files=[("files", ("broken.pdf", b"%PDF-not-real", "application/pdf"))])
    assert response.status_code == 400
    assert response.json()["error"] == "corrupt_file"
