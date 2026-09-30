"""Format-aware text extraction with local fallbacks and strict provenance."""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import pdfplumber
from docx import Document as DocxDocument
from pdf2image import convert_from_path
from PIL import Image
from pptx import Presentation
from pypdf import PdfReader

from ai_services.gemini_vision import VisionUnavailableError, extract_document_text
from backend.app.core.config import Settings, get_settings
from backend.app.services.ocr_service import run_tesseract
from backend.app.services.text_cleaner import clean_pages


class ExtractionError(RuntimeError):
    """Raised only when no extractor produced meaningful source text."""


@dataclass(frozen=True)
class ExtractedPage:
    """One real extracted text block with method and OCR confidence provenance."""

    page_number: int | None
    content: str
    method: str
    confidence: float | None = None


@dataclass(frozen=True)
class ExtractionResult:
    """Complete extraction output ready for persistence."""

    pages: list[ExtractedPage]
    page_count: int | None


def _meaningful(text: str) -> bool:
    """Return true when extraction contains more than formatting noise."""
    return len("".join(text.split())) >= 10


def extract_from_image(path: Path, settings: Settings | None = None) -> ExtractionResult:
    """Extract image text with Tesseract, then Gemini Vision only when configured."""
    settings = settings or get_settings()
    errors: list[str] = []
    try:
        result = run_tesseract(path)
        cleaned = clean_pages([result.text])[0]
        if _meaningful(cleaned):
            return ExtractionResult([ExtractedPage(1, cleaned, "tesseract", result.confidence)], 1)
        errors.append("Tesseract returned no meaningful text")
    except Exception as exc:  # noqa: BLE001 -- provider/engine failures must trigger the documented fallback.
        errors.append(f"Tesseract failed: {exc}")
    try:
        text = extract_document_text(path, Image.open(path).get_format_mimetype() or "image/png", settings)
        cleaned = clean_pages([text])[0]
        if _meaningful(cleaned):
            return ExtractionResult([ExtractedPage(1, cleaned, "gemini_vision")], 1)
        errors.append("Gemini Vision returned no meaningful text")
    except VisionUnavailableError as exc:
        errors.append(str(exc))
    raise ExtractionError("OCR failed. Document may be corrupted or unsupported. " + " | ".join(errors))


def extract_from_docx(path: Path) -> ExtractionResult:
    """Extract paragraphs and table cells from a valid DOCX package."""
    try:
        document = DocxDocument(path)
        parts = [paragraph.text for paragraph in document.paragraphs if paragraph.text.strip()]
        for table in document.tables:
            for row in table.rows:
                parts.append("\t".join(cell.text.strip() for cell in row.cells))
        text = clean_pages(["\n".join(parts)])[0]
    except Exception as exc:
        raise ExtractionError(f"DOCX extraction failed: {exc}") from exc
    if not _meaningful(text):
        raise ExtractionError("DOCX contains no extractable text.")
    return ExtractionResult([ExtractedPage(None, text, "docx")], None)


def extract_from_pptx(path: Path) -> ExtractionResult:
    """Extract slide text and tables from a valid PPTX package."""
    try:
        presentation = Presentation(path)
        raw_pages: list[str] = []
        for slide in presentation.slides:
            parts: list[str] = []
            for shape in slide.shapes:
                if hasattr(shape, "text") and shape.text.strip():
                    parts.append(shape.text)
                if getattr(shape, "has_table", False):
                    for row in shape.table.rows:
                        parts.append("\t".join(cell.text.strip() for cell in row.cells))
            raw_pages.append("\n".join(parts))
        cleaned = clean_pages(raw_pages)
    except Exception as exc:
        raise ExtractionError(f"PPTX extraction failed: {exc}") from exc
    pages = [ExtractedPage(index, text, "pptx") for index, text in enumerate(cleaned, 1) if _meaningful(text)]
    if not pages:
        raise ExtractionError("PPTX contains no extractable text.")
    return ExtractionResult(pages, len(presentation.slides))


def _pdfplumber_pages(path: Path) -> list[str]:
    """Read each PDF page with pdfplumber."""
    with pdfplumber.open(path) as pdf:
        return [(page.extract_text(x_tolerance=2, y_tolerance=3) or "") for page in pdf.pages]


def _pypdf_pages(path: Path) -> list[str]:
    """Read each PDF page with pypdf as a digital-text fallback."""
    reader = PdfReader(str(path), strict=False)
    return [(page.extract_text() or "") for page in reader.pages]


def extract_from_pdf(path: Path, settings: Settings | None = None) -> ExtractionResult:
    """Extract digital pages locally and OCR only pages without meaningful embedded text."""
    settings = settings or get_settings()
    errors: list[str] = []
    raw_pages: list[str] = []
    digital_method = "pdfplumber"
    try:
        raw_pages = _pdfplumber_pages(path)
    except Exception as exc:  # noqa: BLE001 -- malformed PDFs raise multiple third-party exception types.
        errors.append(f"pdfplumber failed: {exc}")
    if not raw_pages or not any(_meaningful(text) for text in raw_pages):
        try:
            raw_pages = _pypdf_pages(path)
            digital_method = "pypdf2"
        except Exception as exc:  # noqa: BLE001 -- malformed PDFs raise multiple third-party exception types.
            errors.append(f"pypdf2 failed: {exc}")
    page_count = len(raw_pages)
    output: list[ExtractedPage] = []
    images = None
    for index, raw in enumerate(raw_pages, 1):
        cleaned = clean_pages([raw])[0]
        if _meaningful(cleaned):
            output.append(ExtractedPage(index, cleaned, digital_method))
            continue
        try:
            if images is None:
                images = convert_from_path(str(path), dpi=settings.ocr_dpi, fmt="png")
                page_count = len(images)
            ocr = run_tesseract(images[index - 1])
            cleaned_ocr = clean_pages([ocr.text])[0]
            if _meaningful(cleaned_ocr):
                output.append(ExtractedPage(index, cleaned_ocr, "tesseract", ocr.confidence))
        except Exception as exc:  # noqa: BLE001 -- one bad OCR page must not crash the document.
            errors.append(f"page {index} OCR failed: {exc}")
    # A fully scanned PDF may have yielded zero digital pages in unusual parsers.
    if not output:
        try:
            images = images or convert_from_path(str(path), dpi=settings.ocr_dpi, fmt="png")
            page_count = len(images)
            for index, image in enumerate(images, 1):
                ocr = run_tesseract(image)
                cleaned = clean_pages([ocr.text])[0]
                if _meaningful(cleaned):
                    output.append(ExtractedPage(index, cleaned, "tesseract", ocr.confidence))
        except Exception as exc:  # noqa: BLE001 -- all OCR engine errors become a durable failed state.
            errors.append(f"scanned PDF OCR failed: {exc}")
    if output:
        cleaned_together = clean_pages([page.content for page in output])
        output = [ExtractedPage(page.page_number, text, page.method, page.confidence) for page, text in zip(output, cleaned_together, strict=True) if _meaningful(text)]
        return ExtractionResult(output, page_count or len(output))
    try:
        text = extract_document_text(path, "application/pdf", settings)
        cleaned = clean_pages([text])[0]
        if _meaningful(cleaned):
            return ExtractionResult([ExtractedPage(None, cleaned, "gemini_vision")], page_count or None)
    except VisionUnavailableError as exc:
        errors.append(str(exc))
    raise ExtractionError("PDF extraction failed. " + " | ".join(errors))


def extract_text(path: Path, mime_type: str, settings: Settings | None = None) -> ExtractionResult:
    """Route an uploaded file to its real extractor using validated MIME metadata."""
    settings = settings or get_settings()
    suffix = path.suffix.lower()
    if suffix == ".pdf":
        return extract_from_pdf(path, settings)
    if suffix == ".docx":
        return extract_from_docx(path)
    if suffix == ".pptx":
        return extract_from_pptx(path)
    if suffix in {".jpg", ".jpeg", ".png", ".tif", ".tiff", ".bmp"}:
        return extract_from_image(path, settings)
    raise ExtractionError(f"No extractor is registered for {mime_type} ({suffix}).")
