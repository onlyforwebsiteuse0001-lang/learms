# Existing architecture audit

## Present before this build

- FastAPI modular package, async SQLAlchemy session dependency, JWT student identity.
- PostgreSQL/Alembic models for students, processing jobs, documents and page-level text.
- Persistent private upload paths and Celery extraction fan-out.
- PDF/DOCX/PPTX/image extraction, Tesseract routing, language detection and optional Gemini Vision fallback.
- React PWA authentication/upload/library interface.
- Explicit provider policy: no key means disabled; no successful state without real output.

## Gaps found

- No concept/prerequisite persistence or graph validation.
- No retry endpoint.
- No diagnostics, questions, BKT state, path or bandit persistence.
- No course boundary on concepts; for Batch 1 a document-derived course key is required.
- pyBKT is installed but inappropriate for fitting before enough response logs; online updates need an explicit formula.
- Full PostgreSQL/Celery/Tesseract integration cannot execute in this sandbox.

## Compatibility constraints

New models share the existing declarative Base and UUID ownership. New routes use the same JWT dependency. Existing extraction tasks are extended only after text persistence, preserving a truthful success/failure boundary.
