# HAAFIZ EDU

Pakistan-first AI-powered personalized learning system. Development follows the approved ordered build plan: each step is implemented, tested, and reported before the next begins. The repository never returns fake AI or learning results when a dependency is unavailable.

## Build status

| Step | Deliverable | Status |
|---|---|---|
| 1 | Project structure, PostgreSQL/Redis/Celery, React PWA, Docker | **Complete** |
| 2 | Authenticated uploads, extraction/OCR, durable jobs and source library UI | **Complete** |
| 3 | AI + deterministic concept extraction and knowledge graph | Not started |
| 4+ | Diagnostic, BKT, paths, FSRS, tutor, quizzes, planner, mock exams | Ordered backlog |

## Step 2 capabilities

- Multi-file authenticated upload with a configurable count and per-file size limit
- PDF, DOCX, PPTX, JPG/JPEG, PNG, TIFF and BMP validation
- Corrupt, empty, oversized and mismatched-container rejection before queueing
- Private UUID-based storage paths separated by student
- Celery batch fan-out with one resilient task per document
- Digital PDF extraction through `pdfplumber`, then `pypdf`
- Scanned PDF and image OCR through Tesseract (`eng+urd`, 300 DPI by default)
- DOCX paragraph/table extraction and PPTX slide/table extraction
- Gemini Vision only as a configured fallback after local image/PDF extraction failure
- Repeated header/footer and page-number cleaning without rewriting source content
- English, Urdu, mixed-script and unknown language detection
- Durable page-level method/confidence provenance
- Pollable job counters and explicit `queued`, `processing`, `partial`, `success`, `failed` states
- Student-owned list, detail, paginated text and delete endpoints
- Mobile-first React authentication, upload progress and private source library UI

## Repository structure

```text
backend/app/api/v1/       Authentication and document routes
backend/app/models/       SQLAlchemy source-document models
backend/app/schemas/      Pydantic API contracts
backend/app/services/     Extraction, OCR, cleaning, and document operations
backend/app/tasks.py      Celery extraction and batch tasks
frontend/                 React 18 + TypeScript + Vite PWA
database/migrations/      Alembic migrations
ai_services/              Explicit external provider adapters
tests/fixtures/           Small PDF, DOCX, and image examples
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for security and component boundaries.

## Docker setup

Prerequisites: Docker Engine 24+ and Docker Compose v2.

```bash
cp .env.example .env
# Set POSTGRES_PASSWORD, SECRET_KEY and HAAFIZ_ADMIN_PASSWORD in .env
docker compose up --build
```

Open:

- Frontend: <http://localhost:3000>
- API: <http://localhost:8000>
- OpenAPI in non-production: <http://localhost:8000/docs>

The backend container runs `alembic upgrade head` before Uvicorn starts. PostgreSQL and Redis are not exposed to the host. Source files persist in the `upload_data` named volume. The Celery worker mounts the same private volume.

## Native setup

Install PostgreSQL 15+, Redis 7+, Poppler, Tesseract, and English/Urdu language packs, then:

```bash
cp .env.example .env
make setup
alembic upgrade head
make dev
```

Run Celery and React separately:

```bash
.venv/bin/celery -A backend.app.worker.celery worker --loglevel=INFO
cd frontend && npm run dev
```

## Authenticate and upload

Register:

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ali Khan","email":"ali@example.com","password":"a-secure-password"}'
```

Copy `access_token`, then upload one or more files:

```bash
curl -X POST http://localhost:8000/api/v1/documents/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F 'files=@tests/fixtures/sample-digital.pdf' \
  -F 'files=@tests/fixtures/sample.docx'
```

The upload returns HTTP `202` with `job_id` and file IDs. Poll the job:

```bash
curl http://localhost:8000/api/v1/jobs/$JOB_ID \
  -H "Authorization: Bearer $TOKEN"
```

List documents or fetch extracted text:

```bash
curl http://localhost:8000/api/v1/documents \
  -H "Authorization: Bearer $TOKEN"

curl 'http://localhost:8000/api/v1/documents/'$DOCUMENT_ID'/text?page=1&page_size=20' \
  -H "Authorization: Bearer $TOKEN"
```

## Upload and OCR configuration

| Variable | Default | Purpose |
|---|---:|---|
| `MAX_UPLOAD_MB` | `50` | Limit per file |
| `MAX_FILES_PER_UPLOAD` | `10` | Limit per request |
| `UPLOAD_DIR` | `/app/data/uploads` in Docker | Private source storage |
| `TESSERACT_LANGUAGES` | `eng+urd` | English and Urdu OCR |
| `OCR_DPI` | `300` | PDF rasterization/OCR DPI |
| `GEMINI_API_KEY` | blank | Optional final vision fallback |

No Gemini key is required for digital PDF, DOCX, PPTX or local OCR. If local OCR fails and no Gemini key exists, the document is marked failed with an explicit unavailable message. It is never marked successful without meaningful extracted text.

## API endpoints delivered in Step 2

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/documents/upload`
- `GET /api/v1/documents`
- `GET /api/v1/documents/{document_id}`
- `DELETE /api/v1/documents/{document_id}`
- `GET /api/v1/documents/{document_id}/text`
- `GET /api/v1/jobs/{job_id}`
- `GET /api/health`

## Quality checks

```bash
.venv/bin/pytest -q
.venv/bin/ruff check backend/app ai_services tests
.venv/bin/alembic upgrade head --sql
cd frontend && npm run build
```

## Honest limitations at Step 2

- The sandbox does not provide Docker, PostgreSQL, Redis, Tesseract, or Urdu trained data, so full container-to-container execution could not be performed here. Docker images install Tesseract `eng` and `urd`; Compose wiring is defined for deployment verification on a Docker host.
- PDF/DOCX parsing tests use real generated files. OCR routing/failure tests mock the Tesseract process because the sandbox has no Tesseract binary; real OCR runs inside the backend Docker image.
- Handwriting, formulas, and complex tables depend on source quality. Gemini is attempted only when configured and still may fail; failure remains explicit.
- WebSocket notifications are not implemented. The required polling endpoint is implemented.
- Concept extraction and knowledge graph construction are deliberately not included; those are ordered Step 3.

## Concept, diagnostic, mastery, and path APIs

Uploaded documents now feed an evidence-gated concept pipeline. Configured AI order is Gemini, Groq, then OpenRouter; without working keys the system labels and uses a conservative deterministic source-only extractor.

Authenticated endpoints:

- `POST /api/v1/jobs/{job_id}/retry`
- `GET /api/v1/concepts?course={course_key}`
- `GET /api/v1/concepts/{concept_id}/prerequisites`
- `POST /api/v1/diagnostic/start`
- `POST /api/v1/diagnostic/{session_id}/answer`
- `GET /api/v1/diagnostic/{session_id}/result`
- `GET /api/v1/mastery/{student_id}`
- `GET /api/v1/mastery/{student_id}/concept/{concept_id}`
- `POST /api/v1/path/generate`
- `GET /api/v1/path/current`
- `GET /api/v1/path/why/{concept_id}`

Diagnostics explicitly return unavailable when fewer than three source-grounded questions exist. Mastery is exact online BKT (`p_know * 100`); defaults are not represented as fitted. Paths enforce prerequisite topology before Thompson Sampling.
