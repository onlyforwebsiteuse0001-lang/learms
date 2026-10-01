"""Deterministic cleaning and language detection for extracted study text."""
from __future__ import annotations

import re
from collections import Counter

URDU_RANGE = re.compile(r"[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]")
LATIN_LETTER = re.compile(r"[A-Za-z]")
PAGE_NUMBER = re.compile(r"^\s*(?:page\s*)?\d+(?:\s*(?:of|/)\s*\d+)?\s*$", re.IGNORECASE)


def normalize_whitespace(text: str) -> str:
    """Normalize line endings, spaces, and excessive blank lines without joining Urdu words."""
    text = text.replace("\r\n", "\n").replace("\r", "\n").replace("\x00", "")
    lines = [re.sub(r"[\t \u00a0]+", " ", line).strip() for line in text.split("\n")]
    return re.sub(r"\n{3,}", "\n\n", "\n".join(lines)).strip()


def clean_pages(raw_pages: list[str]) -> list[str]:
    """Remove repeated short headers/footers and standalone page numbers across pages."""
    normalized = [normalize_whitespace(page) for page in raw_pages]
    boundary_counts: Counter[str] = Counter()
    boundaries: list[tuple[str | None, str | None]] = []
    for page in normalized:
        lines = [line for line in page.splitlines() if line.strip()]
        first = lines[0] if lines else None
        last = lines[-1] if lines else None
        boundaries.append((first, last))
        for line in {first, last} - {None}:
            if len(line) <= 120 and not PAGE_NUMBER.match(line):
                boundary_counts[line.casefold()] += 1
    repeated = {line for line, count in boundary_counts.items() if count >= 2 and count >= len(normalized) * 0.5}
    cleaned: list[str] = []
    for page in normalized:
        lines = []
        for line in page.splitlines():
            if PAGE_NUMBER.match(line) or line.casefold() in repeated:
                continue
            lines.append(line)
        cleaned.append(normalize_whitespace("\n".join(lines)))
    return cleaned


def clean_text(raw_text: str) -> str:
    """Clean a single extracted text block without inventing or rewriting content."""
    return clean_pages([raw_text])[0]


def detect_language(text: str) -> str:
    """Classify meaningful script as English, Urdu, mixed, or unknown."""
    urdu = len(URDU_RANGE.findall(text))
    latin = len(LATIN_LETTER.findall(text))
    total = urdu + latin
    if total < 3:
        return "unknown"
    if urdu >= 3 and latin >= 3:
        return "mixed"
    urdu_ratio = urdu / total
    if urdu_ratio >= 0.75:
        return "ur"
    if urdu_ratio <= 0.10:
        return "en"
    return "mixed"
