# HAAFIZ EDU

Pakistan-first AI-powered personalized learning system. Development follows the approved ordered build plan: each step is implemented, tested, and reported before the next begins. The repository never returns fake AI or learning results when a dependency is unavailable.

## Build status

| Step | Deliverable | Status |
|---|---|---|
| 1 | Project structure, environment, PostgreSQL/Redis/Celery, React PWA, Docker | **Complete** |
| 2 | PDF/DOCX/PPTX/image upload and OCR pipeline | Not started |
| 3 | AI + deterministic concept extraction and knowledge graph | Not started |
| 4+ | Diagnostic, BKT, paths, FSRS, tutor, quizzes, planner, mock exams | Ordered backlog |

The earlier experimental dashboard remains temporarily available from `backend/main.py`; it is not presented as the final learning system. The new React workspace is under `frontend/` and becomes the product UI starting in Step 2.

## Repository structure

```text
backend/               FastAPI API and Celery worker
  app/api/             Versioned route modules
  app/core/            Typed config and JSON logging
  app/models/          SQLAlchemy models
  app/schemas/         Pydantic contracts
  app/services/        Domain services
frontend/              React 18 + TypeScript + Vite PWA
ai_services/           Provider adapters and fallback router
database/init/         Fresh PostgreSQL extension setup
docs/                  Architecture and UX decisions
tests/                 Pytest critical-path tests
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for component boundaries and security decisions.

## Prerequisites

### Recommended

- Docker Engine 24+
- Docker Compose v2

### Native development

- Python 3.11+
- Node.js 20+ (22 recommended)
- PostgreSQL 15+
- Redis 7+
- Tesseract with English and Urdu language packs
- Poppler utilities

## Docker setup

1. Create your local environment file:

   ```bash
   cp .env.example .env
   ```

2. Replace `POSTGRES_PASSWORD`, `SECRET_KEY`, and administrator password. AI keys are optional and should remain blank until configured.

3. Build and start:

   ```bash
   docker compose up --build
   ```

4. Open:

   - Frontend: <http://localhost:3000>
   - API: <http://localhost:8000>
   - OpenAPI: <http://localhost:8000/docs>

PostgreSQL and Redis are intentionally not exposed to the host.

## Native setup

```bash
cp .env.example .env
make setup
make dev
```

Run the React workspace separately:

```bash
cd frontend
npm run dev
```

## Quality checks

```bash
make test
make lint
cd frontend && npm run build
```

## Environment and AI policy

- Real keys belong only in `.env` or a deployment secret manager.
- `.env` is excluded from Git and Docker build context.
- Provider order will be Gemini → Groq → OpenRouter.
- A provider without a key is disabled.
- If all providers are unavailable, the API must return a clear unavailable state.
- Deterministic extraction in Step 3 will be labeled with its actual extraction method and confidence evidence; it will not impersonate AI output.

## Current step acceptance criteria

- Typed settings load from environment.
- Missing AI keys produce an empty enabled-provider list.
- PostgreSQL, Redis, backend, Celery worker, and frontend are defined in Compose.
- Backend image includes Tesseract English/Urdu and Poppler.
- Frontend production build is a mobile-first installable PWA shell.
- Containers have health checks and persistent named volumes.
- No secret is committed.
