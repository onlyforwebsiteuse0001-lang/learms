"""Provider routing and evidence validation tests."""
from ai_services.concept_router import extract_concepts
from backend.app.core.config import Settings


def test_no_keys_uses_labeled_deterministic_fallback() -> None:
    text="Cell Biology\nCell biology studies cells in living organisms."
    result=extract_concepts(text,Settings(_env_file=None,gemini_api_key=None,groq_api_key=None,openrouter_api_key=None))
    assert result.method=="deterministic_source_only"
    assert all(item.evidence in text for item in result.concepts)


def test_hallucinated_provider_evidence_is_rejected(monkeypatch) -> None:
    text="Cell Biology\nCell biology studies cells in living organisms."
    fake='{"concepts":[{"name":"Quantum Physics","description":"Invented","evidence":"not in source","confidence":0.99}],"prerequisites":[]}'
    monkeypatch.setattr("ai_services.concept_router._gemini",lambda text,settings:fake)
    result=extract_concepts(text,Settings(_env_file=None,gemini_api_key="configured",groq_api_key=None,openrouter_api_key=None))
    assert result.method=="deterministic_source_only"
    assert result.provider_errors
    assert all(item.name!="Quantum Physics" for item in result.concepts)
