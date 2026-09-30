"""Durable worker state and Celery boundary tests without live infrastructure."""
from __future__ import annotations

import uuid
from types import SimpleNamespace

import pytest

from backend.app.models.document import DocumentStatus, JobStatus
from backend.app.tasks import (
    _process_document,
    _update_job,
    process_batch,
    process_document,
)


class Scalars:
    def __init__(self, values): self.values=values
    def __iter__(self): return iter(self.values)


class Result:
    def __init__(self, values): self.values=values
    def scalar_one_or_none(self): return self.values[0] if self.values else None
    def scalars(self): return Scalars(self.values)


class FakeSession:
    def __init__(self, executes): self.executes=list(executes); self.commits=0
    async def execute(self, _statement): return Result(self.executes.pop(0))
    async def commit(self): self.commits += 1


@pytest.mark.asyncio
async def test_update_missing_job_is_noop() -> None:
    await _update_job(FakeSession([[]]),uuid.uuid4())


@pytest.mark.asyncio
@pytest.mark.parametrize(
    ("statuses","total","expected"),
    [
        ([DocumentStatus.SUCCESS],2,JobStatus.PROCESSING),
        ([DocumentStatus.SUCCESS,DocumentStatus.SUCCESS],2,JobStatus.SUCCESS),
        ([DocumentStatus.FAILED,DocumentStatus.FAILED],2,JobStatus.FAILED),
        ([DocumentStatus.SUCCESS,DocumentStatus.FAILED],2,JobStatus.PARTIAL),
    ],
)
async def test_update_job_derives_truth_from_document_states(statuses,total,expected) -> None:
    job=SimpleNamespace(total_files=total,completed_files=0,failed_files=0,status=JobStatus.QUEUED)
    await _update_job(FakeSession([[job],statuses]),uuid.uuid4())
    assert job.status==expected
    assert job.completed_files==statuses.count(DocumentStatus.SUCCESS)
    assert job.failed_files==statuses.count(DocumentStatus.FAILED)


class SessionContext:
    def __init__(self,session): self.session=session
    async def __aenter__(self): return self.session
    async def __aexit__(self,*_args): return None


@pytest.mark.asyncio
async def test_process_missing_document_returns_durable_failure(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("backend.app.tasks.SessionFactory",lambda:SessionContext(FakeSession([[]])))
    document_id=uuid.uuid4(); result=await _process_document(document_id)
    assert result=={"document_id":str(document_id),"status":"failed","error":"Document record not found"}


@pytest.mark.asyncio
async def test_process_already_successful_is_idempotent(monkeypatch: pytest.MonkeyPatch) -> None:
    document=SimpleNamespace(status=DocumentStatus.SUCCESS)
    monkeypatch.setattr("backend.app.tasks.SessionFactory",lambda:SessionContext(FakeSession([[document]])))
    result=await _process_document(uuid.uuid4())
    assert result["status"]=="success"


def test_celery_document_entry_converts_invalid_id_to_failure() -> None:
    result=process_document.run("not-a-uuid")
    assert result["status"]=="failed" and result["document_id"]=="not-a-uuid"


def test_batch_dispatches_each_document_once(monkeypatch: pytest.MonkeyPatch) -> None:
    captured=[]
    class FakeGroup:
        def apply_async(self): captured.append("sent")
    monkeypatch.setattr("backend.app.tasks.group",lambda signatures: (list(signatures),FakeGroup())[1])
    ids=[str(uuid.uuid4()),str(uuid.uuid4())]
    response=process_batch.run("job",ids)
    assert response=={"job_id":"job","status":"processing","total_files":2}
    assert captured==["sent"]
