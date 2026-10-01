"""Security regression tests for deployment config, HTTP and file boundaries."""
from __future__ import annotations

import io
import zipfile
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from PIL import Image
from starlette.datastructures import Headers, UploadFile

from backend.app.api.v1.documents import (
    _safe_filename,
    _store_upload,
    _validate_file_container,
)
from backend.app.core.config import Settings
from backend.app.main import app
from backend.app.services.api_errors import APIError


@pytest.mark.parametrize("name", [None, "", " ", ".", "..", "\x00"])
def test_invalid_filenames_are_rejected(name: str | None) -> None:
    with pytest.raises(APIError) as caught:
        _safe_filename(name)
    assert caught.value.code == "invalid_filename"


@pytest.mark.parametrize(
    ("name", "expected"),
    [("../../secret.pdf", "secret.pdf"), ("C:\\fakepath\\notes.pdf", "C:\\fakepath\\notes.pdf"), (" normal.pdf ", "normal.pdf"), ("a" * 300 + ".pdf", "a" * 255)],
)
def test_filename_sanitization(name: str, expected: str) -> None:
    assert _safe_filename(name) == expected


def test_security_headers_and_request_correlation() -> None:
    response = TestClient(app).get("/api/health", headers={"X-Request-ID": "trace-123"})
    assert response.status_code == 200
    assert response.headers["x-request-id"] == "trace-123"
    assert response.headers["x-content-type-options"] == "nosniff"
    assert response.headers["x-frame-options"] == "DENY"
    assert response.headers["content-security-policy"].startswith("default-src 'none'")
    assert response.headers["cache-control"] == "no-store"


def test_invalid_request_id_is_not_reflected() -> None:
    malicious = "bad\nheader"
    response = TestClient(app).get("/api/health", headers={"X-Request-ID": malicious})
    assert response.headers["x-request-id"] != malicious
    assert len(response.headers["x-request-id"]) == 36


def test_hsts_only_when_request_is_https() -> None:
    client = TestClient(app, base_url="https://testserver")
    assert "strict-transport-security" in client.get("/api/health").headers


@pytest.mark.parametrize(
    "kwargs",
    [
        {"app_env": "production"},
        {"app_env": "staging", "secret_key": "short", "force_https": True, "cors_origins": "https://example.com"},
        {"app_env": "production", "secret_key": "x" * 40, "force_https": False, "cors_origins": "https://example.com"},
        {"app_env": "production", "secret_key": "x" * 40, "force_https": True, "cors_origins": "http://localhost:3000"},
    ],
)
def test_unsafe_nondevelopment_configuration_fails_closed(kwargs: dict) -> None:
    with pytest.raises(ValueError):
        Settings(_env_file=None, **kwargs)


def test_secure_production_configuration_is_accepted() -> None:
    settings = Settings(_env_file=None, app_env="production", secret_key="x" * 40, force_https=True, cors_origins="https://edu.example")
    assert settings.force_https and settings.cors_origin_list == ["https://edu.example"]


def test_disguised_executable_pdf_is_rejected(tmp_path: Path) -> None:
    path = tmp_path / "malware.pdf"; path.write_bytes(b"MZ\x90\x00executable")
    with pytest.raises(APIError) as caught:
        _validate_file_container(path, ".pdf", path.name)
    assert caught.value.code == "corrupt_file"


def test_disguised_zip_openxml_is_rejected(tmp_path: Path) -> None:
    path = tmp_path / "bad.docx"; path.write_bytes(b"MZ executable")
    with pytest.raises(APIError, match="format"):
        _validate_file_container(path, ".docx", path.name)


def test_openxml_zip_bomb_ratio_is_rejected(tmp_path: Path) -> None:
    path = tmp_path / "bomb.docx"
    with zipfile.ZipFile(path, "w", compression=zipfile.ZIP_DEFLATED) as package:
        package.writestr("word/document.xml", b"A" * 2_000_000)
    with pytest.raises(APIError) as caught:
        _validate_file_container(path, ".docx", path.name)
    assert caught.value.code == "corrupt_file"


def test_valid_image_magic_and_decoder_are_accepted(tmp_path: Path) -> None:
    path = tmp_path / "safe.png"; Image.new("RGB", (8, 8), "white").save(path)
    _validate_file_container(path, ".png", path.name)


@pytest.mark.asyncio
async def test_streamed_upload_enforces_size_and_cleans_partial_file(tmp_path: Path) -> None:
    upload = UploadFile(io.BytesIO(b"123456"), filename="large.pdf", headers=Headers({"content-type": "application/pdf"}))
    destination = tmp_path / "stored.pdf"
    with pytest.raises(APIError) as caught:
        await _store_upload(upload, destination, 5, "large.pdf")
    assert caught.value.status_code == 413 and not destination.exists()


@pytest.mark.asyncio
async def test_streamed_upload_rejects_empty_file(tmp_path: Path) -> None:
    upload = UploadFile(io.BytesIO(b""), filename="empty.pdf")
    destination = tmp_path / "stored.pdf"
    with pytest.raises(APIError) as caught:
        await _store_upload(upload, destination, 10, "empty.pdf")
    assert caught.value.code == "empty_file" and not destination.exists()


@pytest.mark.asyncio
async def test_streamed_upload_uses_exclusive_destination(tmp_path: Path) -> None:
    destination = tmp_path / "existing.pdf"; destination.write_bytes(b"old")
    upload = UploadFile(io.BytesIO(b"new"), filename="new.pdf")
    with pytest.raises(FileExistsError):
        await _store_upload(upload, destination, 10, "new.pdf")
    assert destination.read_bytes() == b"old"


def test_liveness_and_prometheus_metrics_use_route_templates() -> None:
    client = TestClient(app)
    assert client.get("/api/health/live").json() == {"status": "alive"}
    metrics = client.get("/metrics")
    assert metrics.status_code == 200
    assert "haafiz_http_requests_total" in metrics.text
    assert 'path="/api/health/live"' in metrics.text
    assert "request_duration_seconds" in metrics.text
