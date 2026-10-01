"""Persistence orchestration tests for evidence-grounded concepts."""
from __future__ import annotations

import uuid

import pytest

from ai_services.concept_router import RoutedExtraction
from backend.app.models.document import Document, DocumentText
from backend.app.models.learning import (
    Concept,
    ConceptDocument,
    DiagnosticQuestion,
    Prerequisite,
)
from backend.app.services.concept_extraction_service import (
    ExtractedConcept,
    ExtractedPrerequisite,
)
from backend.app.services.concept_service import extract_and_store_concepts


class Scalars:
    def __init__(self, values): self.values=values
    def __iter__(self): return iter(self.values)


class Result:
    def __init__(self, values): self.values=values
    def scalars(self): return Scalars(self.values)


class FakeSession:
    def __init__(self, document, executes, *, existing_links=None, scalar_values=None):
        self.document=document; self.executes=list(executes); self.links=existing_links or {}; self.scalar_values=list(scalar_values or []); self.added=[]; self.flushes=0
    async def get(self, model, key):
        if model is Document: return self.document
        if model is ConceptDocument: return self.links.get(key)
        return None
    async def execute(self, _statement): return Result(self.executes.pop(0))
    async def scalar(self, _statement): return self.scalar_values.pop(0) if self.scalar_values else None
    def add(self, value): self.added.append(value)
    async def flush(self):
        self.flushes += 1
        for value in self.added:
            if isinstance(value, Concept) and value.concept_id is None: value.concept_id=uuid.uuid4()


def source_document() -> tuple[Document, list[DocumentText]]:
    owner=uuid.uuid4(); document_id=uuid.uuid4()
    document=Document(document_id=document_id,student_id=owner,original_name="Biology Notes.pdf",stored_path="safe.pdf",mime_type="application/pdf",size_bytes=100,status="success")
    pages=[DocumentText(text_id=uuid.uuid4(),document_id=document_id,page_number=1,content="Cell Biology\nCells are fundamental living units.",char_count=50,extraction_method="pdfplumber")]
    return document,pages


@pytest.mark.asyncio
async def test_missing_document_is_explicit_error() -> None:
    with pytest.raises(ValueError,match="Document not found"):
        await extract_and_store_concepts(FakeSession(None,[]),uuid.uuid4())


@pytest.mark.asyncio
async def test_no_candidates_is_successful_noop(monkeypatch: pytest.MonkeyPatch) -> None:
    document,pages=source_document(); fake=FakeSession(document,[pages])
    monkeypatch.setattr("backend.app.services.concept_service.extract_concepts",lambda *_:RoutedExtraction([],[],"deterministic_source_only"))
    assert await extract_and_store_concepts(fake,document.document_id)==0
    assert fake.added==[]


@pytest.mark.asyncio
async def test_new_concepts_get_provenance_parameters_and_questions(monkeypatch: pytest.MonkeyPatch) -> None:
    document,pages=source_document()
    candidates=[ExtractedConcept(name,f"Description {name}",name,.8) for name in ["Cell Biology","Genetics","Evolution"]]
    routed=RoutedExtraction(candidates,[],"mock")
    monkeypatch.setattr("backend.app.services.concept_service.extract_concepts",lambda *_:routed)
    fake=FakeSession(document,[pages,[],[]],scalar_values=[None,None,None])
    count=await extract_and_store_concepts(fake,document.document_id)
    assert count==3
    assert len([item for item in fake.added if isinstance(item,Concept)])==3
    assert len([item for item in fake.added if isinstance(item,ConceptDocument)])==3
    questions=[item for item in fake.added if isinstance(item,DiagnosticQuestion)]
    assert len(questions)==3 and all(question.evidence in ["Cell Biology","Genetics","Evolution"] for question in questions)


@pytest.mark.asyncio
async def test_existing_concept_is_deduplicated_and_existing_link_preserved(monkeypatch: pytest.MonkeyPatch) -> None:
    document,pages=source_document()
    existing=Concept(concept_id=uuid.uuid4(),student_id=document.student_id,course_key="biology notes",name="Cell Biology",normalized_name="cell biology",description="Existing",extraction_method="provider",confidence=.9,evidence="Cell Biology")
    link=ConceptDocument(concept_id=existing.concept_id,document_id=document.document_id,evidence="old")
    monkeypatch.setattr("backend.app.services.concept_service.extract_concepts",lambda *_:RoutedExtraction([ExtractedConcept("Cell Biology","New","Cell Biology",.8)],[],"mock"))
    fake=FakeSession(document,[pages,[existing],[]],existing_links={(existing.concept_id,document.document_id):link})
    assert await extract_and_store_concepts(fake,document.document_id)==1
    assert not any(isinstance(item,Concept) for item in fake.added)
    assert not any(isinstance(item,ConceptDocument) for item in fake.added)


@pytest.mark.asyncio
async def test_valid_explicit_edge_is_persisted_but_cycle_is_skipped(monkeypatch: pytest.MonkeyPatch) -> None:
    document,pages=source_document()
    candidates=[ExtractedConcept(name,"Description",name,.8) for name in ["Foundation","Advanced"]]
    forward=ExtractedPrerequisite("Foundation","Advanced","Advanced requires Foundation.",.9)
    backward=ExtractedPrerequisite("Advanced","Foundation","Foundation requires Advanced.",.9)
    monkeypatch.setattr("backend.app.services.concept_service.extract_concepts",lambda *_:RoutedExtraction(candidates,[forward,backward],"mock"))
    fake=FakeSession(document,[pages,[],[]])
    await extract_and_store_concepts(fake,document.document_id)
    edges=[item for item in fake.added if isinstance(item,Prerequisite)]
    assert len(edges)==1 and edges[0].approved is False


@pytest.mark.asyncio
async def test_relation_with_unknown_concept_is_not_invented(monkeypatch: pytest.MonkeyPatch) -> None:
    document,pages=source_document(); candidate=ExtractedConcept("Known","Description","Known",.8)
    edge=ExtractedPrerequisite("Missing","Known","Known requires Missing.",.9)
    monkeypatch.setattr("backend.app.services.concept_service.extract_concepts",lambda *_:RoutedExtraction([candidate],[edge],"mock"))
    fake=FakeSession(document,[pages,[],[]])
    await extract_and_store_concepts(fake,document.document_id)
    assert not any(isinstance(item,Prerequisite) for item in fake.added)
