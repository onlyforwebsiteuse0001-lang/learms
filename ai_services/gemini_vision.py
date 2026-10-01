"""Gemini Vision fallback used only after local extraction has failed."""
from __future__ import annotations

from pathlib import Path

from backend.app.core.config import Settings


class VisionUnavailableError(RuntimeError):
    """Raised when Gemini Vision cannot be used or returns no source text."""


def extract_document_text(path: Path, mime_type: str, settings: Settings) -> str:
    """Extract source text with Gemini Vision without adding explanations or summaries."""
    if not settings.gemini_api_key or not settings.gemini_api_key.get_secret_value().strip():
        raise VisionUnavailableError("AI vision fallback unavailable (no Gemini API key configured).")
    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=settings.gemini_api_key.get_secret_value())
        response = client.models.generate_content(
            model=settings.gemini_model,
            contents=[
                types.Part.from_bytes(data=path.read_bytes(), mime_type=mime_type),
                "Transcribe all visible source text exactly. Preserve Urdu and English. Do not summarize, explain, correct, or invent missing text.",
            ],
        )
        text = (response.text or "").strip()
        if not text:
            raise VisionUnavailableError("Gemini Vision returned no extracted text.")
        return text
    except VisionUnavailableError:
        raise
    except Exception as exc:
        raise VisionUnavailableError(f"Gemini Vision extraction failed: {exc}") from exc
