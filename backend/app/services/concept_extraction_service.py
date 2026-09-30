"""Source-grounded deterministic concept extraction and prerequisite evidence."""
from __future__ import annotations

import re
from dataclasses import dataclass

HEADING = re.compile(r"^(?:\d+(?:\.\d+)*[.)]?\s+)?([A-Z\u0600-\u06FF][^.!?]{2,80})$")
EXPLICIT_PREREQ = re.compile(r"(?P<target>[A-Za-z][A-Za-z0-9 +\-]{2,50})\s+(?:requires|depends on|builds on)\s+(?P<source>[A-Za-z][A-Za-z0-9 +\-]{2,50})", re.IGNORECASE)


@dataclass(frozen=True)
class ExtractedConcept:
    """Concept candidate whose evidence is an exact source substring."""
    name: str
    description: str
    evidence: str
    confidence: float
    method: str = "deterministic_heading"


@dataclass(frozen=True)
class ExtractedPrerequisite:
    """Explicit prerequisite candidate grounded in one source sentence."""
    source_name: str
    target_name: str
    evidence: str
    confidence: float = 0.90
    method: str = "deterministic_explicit_relation"


def normalize_name(name: str) -> str:
    """Normalize a concept for conservative exact deduplication."""
    return re.sub(r"\s+", " ", re.sub(r"[^\w\u0600-\u06FF+\- ]", "", name)).strip().casefold()


def extract_deterministic(text: str, max_concepts: int = 80) -> tuple[list[ExtractedConcept], list[ExtractedPrerequisite]]:
    """Extract headings and only explicit prerequisite phrases; never infer absent facts."""
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    seen: set[str] = set()
    concepts: list[ExtractedConcept] = []
    for index, line in enumerate(lines):
        match = HEADING.match(line)
        if not match or len(line.split()) > 10:
            continue
        name = match.group(1).strip(" :-")
        normalized = normalize_name(name)
        if len(normalized) < 3 or normalized in seen:
            continue
        following = next((candidate for candidate in lines[index + 1:index + 4] if len(candidate) > len(name) + 10), line)
        concepts.append(ExtractedConcept(name, following[:500], line, 0.72))
        seen.add(normalized)
        if len(concepts) >= max_concepts:
            break
    prerequisites: list[ExtractedPrerequisite] = []
    for sentence in re.split(r"(?<=[.!?])\s+|\n", text):
        for match in EXPLICIT_PREREQ.finditer(sentence):
            prerequisites.append(ExtractedPrerequisite(match.group("source").strip(), match.group("target").strip(), sentence.strip()[:500]))
    return concepts, prerequisites
