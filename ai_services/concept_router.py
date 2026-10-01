"""Schema-validated concept extraction router with deterministic final fallback."""
from __future__ import annotations

import json
import re
from dataclasses import dataclass

import httpx
from pydantic import BaseModel, Field, ValidationError

from backend.app.core.config import Settings
from backend.app.services.concept_extraction_service import (
    ExtractedConcept,
    ExtractedPrerequisite,
    extract_deterministic,
    normalize_name,
)


class ConceptItem(BaseModel):
    """Strict provider concept item."""
    name: str = Field(min_length=2, max_length=200)
    description: str = Field(min_length=2, max_length=500)
    evidence: str = Field(min_length=2, max_length=500)
    confidence: float = Field(ge=0, le=1)


class PrerequisiteItem(BaseModel):
    """Strict provider prerequisite relation."""
    prerequisite: str
    concept: str
    evidence: str = Field(min_length=2, max_length=500)
    confidence: float = Field(ge=0, le=1)


class ExtractionPayload(BaseModel):
    """Provider JSON response contract."""
    concepts: list[ConceptItem] = Field(max_length=100)
    prerequisites: list[PrerequisiteItem] = Field(default_factory=list, max_length=200)


@dataclass(frozen=True)
class RoutedExtraction:
    """Validated extraction and actual method used."""
    concepts: list[ExtractedConcept]
    prerequisites: list[ExtractedPrerequisite]
    method: str
    provider_errors: tuple[str, ...] = ()


PROMPT = """Extract educational concepts and explicit prerequisite relations from SOURCE only.
Return JSON exactly: {"concepts":[{"name":"","description":"","evidence":"exact source quote","confidence":0.0}],"prerequisites":[{"prerequisite":"concept name","concept":"dependent concept name","evidence":"exact source quote","confidence":0.0}]}.
Rules: evidence must be an exact substring; do not use outside knowledge; uncertain relation means omit it; prerequisite and concept must occur in concepts. No markdown.
SOURCE:\n"""


def _json_object(raw: str) -> dict:
    """Parse a provider response containing one JSON object and no trusted prose."""
    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if not match:
        raise ValueError("provider returned no JSON object")
    return json.loads(match.group(0))


def _validate(raw: str, text: str, method: str) -> RoutedExtraction:
    """Reject concepts, evidence, and edges that cannot be verified against source."""
    payload = ExtractionPayload.model_validate(_json_object(raw))
    concepts=[]; names=set()
    for item in payload.concepts:
        if item.evidence not in text:
            continue
        normalized=normalize_name(item.name)
        if not normalized or normalized in names:
            continue
        names.add(normalized); concepts.append(ExtractedConcept(item.name,item.description,item.evidence,item.confidence,method))
    prerequisites=[]
    for item in payload.prerequisites:
        if item.evidence in text and normalize_name(item.prerequisite) in names and normalize_name(item.concept) in names:
            prerequisites.append(ExtractedPrerequisite(item.prerequisite,item.concept,item.evidence,item.confidence,method))
    if not concepts:
        raise ValueError("provider output contained no source-verifiable concepts")
    return RoutedExtraction(concepts,prerequisites,method)


def _gemini(text: str, settings: Settings) -> str:
    from google import genai
    client=genai.Client(api_key=settings.gemini_api_key.get_secret_value())
    response=client.models.generate_content(model=settings.gemini_model,contents=PROMPT+text[:50000])
    return response.text or ""


def _groq(text: str, settings: Settings) -> str:
    from groq import Groq
    client=Groq(api_key=settings.groq_api_key.get_secret_value())
    response=client.chat.completions.create(model=settings.groq_model,messages=[{"role":"user","content":PROMPT+text[:50000]}],temperature=0,response_format={"type":"json_object"})
    return response.choices[0].message.content or ""


def _openrouter(text: str, settings: Settings) -> str:
    response=httpx.post("https://openrouter.ai/api/v1/chat/completions",headers={"Authorization":f"Bearer {settings.openrouter_api_key.get_secret_value()}"},json={"model":settings.openrouter_model,"messages":[{"role":"user","content":PROMPT+text[:50000]}],"temperature":0,"response_format":{"type":"json_object"}},timeout=settings.ai_request_timeout_seconds)
    response.raise_for_status(); return response.json()["choices"][0]["message"]["content"]


def extract_concepts(text: str, settings: Settings) -> RoutedExtraction:
    """Try configured providers in policy order, then label deterministic fallback honestly."""
    errors=[]
    providers=(("gemini",settings.gemini_api_key,_gemini),("groq",settings.groq_api_key,_groq),("openrouter",settings.openrouter_api_key,_openrouter))
    for name,key,call in providers:
        if not key or not key.get_secret_value().strip():
            continue
        try:
            return _validate(call(text,settings),text,f"{name}_structured")
        except (Exception, ValidationError) as exc:  # noqa: BLE001 -- provider fallback boundary.
            errors.append(f"{name}: {exc}")
    concepts,prerequisites=extract_deterministic(text)
    return RoutedExtraction(concepts,prerequisites,"deterministic_source_only",tuple(errors))
