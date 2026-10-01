"""Core authentication, OCR, AI and document persistence unit tests."""
from __future__ import annotations

import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path
from types import SimpleNamespace

import jwt
import pytest
from PIL import Image

from ai_services.gemini_vision import VisionUnavailableError, extract_document_text
from backend.app.core.config import Settings
from backend.app.core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)
from backend.app.models.document import DocumentStatus
from backend.app.services import document_service
from backend.app.services.ocr_service import preprocess_image, run_tesseract


@pytest.mark.parametrize("password", ["correct horse battery staple", "اردو پاس ورڈ", "🔐-unicode", "a" * 1_000])
def test_password_hash_roundtrip_and_unique_salt(password: str) -> None:
    first, second = hash_password(password), hash_password(password)
    assert first != second
    assert verify_password(password, first)
    assert not verify_password(password + "wrong", first)


@pytest.mark.parametrize("stored", ["", "missing-colon", "zz:nothex", None, "00:bad"])
def test_password_verification_rejects_malformed_storage(stored) -> None:
    assert verify_password("password", stored) is False


def test_access_token_roundtrip() -> None:
    settings = Settings(_env_file=None, secret_key="test-secret-which-is-longer-than-32-bytes")
    student_id = uuid.uuid4()
    token = create_access_token(student_id, "student", settings)
    assert decode_access_token(token, settings) == (student_id, "student")


def test_access_token_rejects_wrong_secret_expiry_algorithm_and_subject() -> None:
    student_id = uuid.uuid4(); settings = Settings(_env_file=None, secret_key="right-secret-which-is-longer-than-32-bytes")
    with pytest.raises(jwt.InvalidSignatureError):
        decode_access_token(create_access_token(student_id, "student", settings), Settings(_env_file=None, secret_key="wrong-secret-which-is-longer-than-32-bytes"))
    expired = jwt.encode({"sub": str(student_id), "exp": datetime.now(timezone.utc) - timedelta(seconds=1)}, "right-secret-which-is-longer-than-32-bytes", algorithm="HS256")
    with pytest.raises(jwt.ExpiredSignatureError): decode_access_token(expired, settings)
    wrong_algorithm = jwt.encode({"sub": str(student_id)}, "right-secret-which-is-longer-than-32-bytes", algorithm="HS384")
    with pytest.raises(jwt.InvalidAlgorithmError): decode_access_token(wrong_algorithm, settings)
    malformed = jwt.encode({"sub": "not-a-uuid"}, "right-secret-which-is-longer-than-32-bytes", algorithm="HS256")
    with pytest.raises(ValueError): decode_access_token(malformed, settings)


def test_missing_role_defaults_to_student() -> None:
    settings = Settings(_env_file=None, secret_key="right-secret-which-is-longer-than-32-bytes")
    token = jwt.encode({"sub": str(uuid.uuid4())}, "right-secret-which-is-longer-than-32-bytes", algorithm="HS256")
    assert decode_access_token(token, settings)[1] == "student"


def test_image_preprocessing_returns_grayscale_same_size() -> None:
    image = Image.new("RGB", (20, 10), "red")
    result = preprocess_image(image)
    assert result.mode == "L" and result.size == image.size


def test_tesseract_collects_words_and_valid_confidence(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("backend.app.services.ocr_service.pytesseract.image_to_data", lambda *args, **kwargs: {"text": [" Cell ", "", "Biology", "bad"], "conf": ["90", "70", "80", "not-number"]})
    result = run_tesseract(Image.new("RGB", (20, 20)), lang="eng", dpi=200)
    assert result.text == "Cell Biology bad" and result.confidence == 85


def test_tesseract_no_valid_confidence_returns_none(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    path = tmp_path / "image.png"; Image.new("RGB", (20, 20)).save(path)
    monkeypatch.setattr("backend.app.services.ocr_service.pytesseract.image_to_data", lambda *args, **kwargs: {"text": ["Word"], "conf": ["-1"]})
    result = run_tesseract(path)
    assert result.text == "Word" and result.confidence is None


def test_vision_requires_key(tmp_path: Path) -> None:
    with pytest.raises(VisionUnavailableError, match="no Gemini"):
        extract_document_text(tmp_path / "missing.pdf", "application/pdf", Settings(_env_file=None, gemini_api_key=None))


def test_vision_success_empty_and_provider_failure(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    path = tmp_path / "image.png"; path.write_bytes(b"source bytes")
    models = SimpleNamespace(generate_content=lambda **kwargs: SimpleNamespace(text="  exact source text  "))
    monkeypatch.setattr("google.genai.Client", lambda api_key: SimpleNamespace(models=models))
    settings = Settings(_env_file=None, gemini_api_key="key")
    assert extract_document_text(path, "image/png", settings) == "exact source text"
    models.generate_content = lambda **kwargs: SimpleNamespace(text="")
    with pytest.raises(VisionUnavailableError, match="no extracted text"): extract_document_text(path, "image/png", settings)
    models.generate_content = lambda **kwargs: (_ for _ in ()).throw(TimeoutError("timeout"))
    with pytest.raises(VisionUnavailableError, match="timeout"): extract_document_text(path, "image/png", settings)


class ScalarRows:
    def __init__(self, values): self.values = values
    def __iter__(self): return iter(self.values)


class Result:
    def __init__(self, values): self.values = values
    def scalars(self): return ScalarRows(self.values)
    def scalar_one_or_none(self): return self.values[0] if self.values else None


class FakeDB:
    def __init__(self, *, executes=None, scalar_values=None): self.executes=list(executes or []); self.scalar_values=list(scalar_values or []); self.added=[]; self.deleted=[]; self.flushes=0
    def add(self, value): self.added.append(value)
    async def flush(self): self.flushes += 1
    async def execute(self, _statement): return Result(self.executes.pop(0))
    async def scalar(self, _statement): return self.scalar_values.pop(0)
    async def delete(self, value): self.deleted.append(value)


@pytest.mark.asyncio
async def test_document_service_create_job_and_upload() -> None:
    db=FakeDB(); student_id=uuid.uuid4(); job=await document_service.create_job(db,student_id,2)
    document=await document_service.upload_document(db,student_id=student_id,job_id=uuid.uuid4(),original_name="notes.pdf",stored_path=Path("safe.pdf"),mime_type="application/pdf",size_bytes=10)
    assert job.total_files==2 and document.status==DocumentStatus.QUEUED and db.flushes==2


@pytest.mark.asyncio
@pytest.mark.parametrize("with_text", [False, True])
async def test_document_service_get_document(with_text: bool) -> None:
    owner=uuid.uuid4(); item=SimpleNamespace(document_id=uuid.uuid4())
    assert await document_service.get_document(FakeDB(executes=[[item]]),owner,item.document_id,with_text) is item
    assert await document_service.get_document(FakeDB(executes=[[]]),owner,uuid.uuid4(),with_text) is None


@pytest.mark.asyncio
async def test_document_service_lists_with_totals() -> None:
    items=[SimpleNamespace(),SimpleNamespace()]
    documents,total=await document_service.list_documents(FakeDB(executes=[items],scalar_values=[2]),uuid.uuid4(),2,20)
    assert documents==items and total==2
    pages,total=await document_service.list_document_text(FakeDB(executes=[items],scalar_values=[None]),uuid.uuid4(),1,10)
    assert pages==items and total==0


@pytest.mark.asyncio
async def test_document_delete_removes_db_and_file(tmp_path: Path) -> None:
    path=tmp_path/"private.pdf"; path.write_bytes(b"source")
    item=SimpleNamespace(stored_path=str(path)); db=FakeDB()
    await document_service.delete_document(db,item)
    assert db.deleted==[item] and not path.exists() and db.flushes==1


@pytest.mark.asyncio
async def test_document_delete_tolerates_storage_error(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(Path,"unlink",lambda *args,**kwargs: (_ for _ in ()).throw(OSError("readonly")))
    db=FakeDB(); item=SimpleNamespace(stored_path="private.pdf")
    await document_service.delete_document(db,item)
    assert db.deleted==[item]


@pytest.mark.asyncio
async def test_get_job_and_status_error_truncation() -> None:
    job=SimpleNamespace(); assert await document_service.get_job(FakeDB(executes=[[job]]),uuid.uuid4(),uuid.uuid4()) is job
    item=SimpleNamespace(status=None,error_message=None); db=FakeDB()
    await document_service.update_status(db,item,DocumentStatus.FAILED,"x"*5000)
    assert item.status==DocumentStatus.FAILED and len(item.error_message)==4000
    await document_service.update_status(db,item,DocumentStatus.SUCCESS)
    assert item.error_message is None
