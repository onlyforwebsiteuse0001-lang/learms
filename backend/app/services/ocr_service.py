"""Local Tesseract OCR with conservative image preprocessing."""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import pytesseract
from PIL import Image, ImageEnhance, ImageFilter, ImageOps
from pytesseract import Output

from backend.app.core.config import get_settings


@dataclass(frozen=True)
class OCRResult:
    """Text and mean confidence returned by a real OCR invocation."""

    text: str
    confidence: float | None


def preprocess_image(image: Image.Image) -> Image.Image:
    """Convert to grayscale, autocontrast, lightly denoise, and sharpen for OCR."""
    image = ImageOps.exif_transpose(image)
    gray = ImageOps.grayscale(image)
    gray = ImageOps.autocontrast(gray, cutoff=1)
    gray = gray.filter(ImageFilter.MedianFilter(size=3))
    return ImageEnhance.Sharpness(gray).enhance(1.4)


def run_tesseract(image: Image.Image | Path, lang: str | None = None, dpi: int | None = None) -> OCRResult:
    """Run installed Tesseract and return actual text; raise on missing engine/language data."""
    settings = get_settings()
    pytesseract.pytesseract.tesseract_cmd = str(settings.tesseract_cmd)
    opened = Image.open(image) if isinstance(image, Path) else image
    processed = preprocess_image(opened)
    data = pytesseract.image_to_data(
        processed,
        lang=lang or settings.tesseract_languages,
        config=f"--dpi {dpi or settings.ocr_dpi} --psm 6",
        output_type=Output.DICT,
    )
    words: list[str] = []
    confidences: list[float] = []
    for word, raw_confidence in zip(data["text"], data["conf"], strict=False):
        word = word.strip()
        if not word:
            continue
        words.append(word)
        try:
            confidence = float(raw_confidence)
            if confidence >= 0:
                confidences.append(confidence)
        except (TypeError, ValueError):
            continue
    mean = sum(confidences) / len(confidences) if confidences else None
    return OCRResult(text=" ".join(words), confidence=mean)
