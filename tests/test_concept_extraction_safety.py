"""Additional extraction safeguards against invented graph data."""
from backend.app.services.concept_extraction_service import extract_deterministic


def test_plain_paragraph_does_not_invent_concepts_or_edges() -> None:
    text = "This is a continuous paragraph with no headings and no explicit prerequisite relation."
    concepts, edges = extract_deterministic(text)
    assert concepts == []
    assert edges == []


def test_implicit_sequence_does_not_become_prerequisite() -> None:
    text = "Algebra\nAlgebra appears in this chapter. Calculus appears later in the chapter."
    _, edges = extract_deterministic(text)
    assert edges == []
