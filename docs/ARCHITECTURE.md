# HAAFIZ EDU architecture

## Ordered delivery status

- **Step 1 — project foundation:** complete
- **Step 2 — upload and OCR pipeline:** complete
- Step 3 — concept extraction and knowledge graph: not implemented yet

No unfinished step is represented as working.

## Repository boundaries

```text
backend/
  app/
    api/          FastAPI route modules
    core/         settings, security and structured logging
    models/       SQLAlchemy models
    schemas/      validated API contracts
    services/     document and learning-domain services
    database.py   async PostgreSQL session lifecycle
    worker.py     Celery configuration
    tasks.py      background task registration
  Dockerfile
frontend/
  src/            React + TypeScript application
  Dockerfile      production multi-stage image
  nginx.conf      SPA and /api reverse proxy
ai_services/      isolated Gemini/Groq/OpenRouter adapters
                       (implemented in ordered Step 3)
database/
  init/           fresh-cluster PostgreSQL extensions
  README.md       migration policy
docs/             architecture, UX, and operational decisions
tests/            backend critical-path tests
```

## Runtime topology

- React PWA is built to static assets and served by Nginx.
- Nginx proxies `/api` to FastAPI, keeping browser requests same-origin.
- FastAPI uses async SQLAlchemy with PostgreSQL.
- Redis databases are separated for cache, Celery broker, and task results.
- Celery processes expensive OCR/extraction outside HTTP requests.
- Uploads use a named local volume in development; an S3-compatible adapter is configurable later.
- API providers are enabled only when their environment keys are present.

## Security foundations

- `.env` is ignored; `.env.example` contains placeholders only.
- Containers run the backend as a non-root user.
- PostgreSQL and Redis are not published to the host by default.
- Secrets are represented by Pydantic `SecretStr` and must not enter logs.
- Source upload size is centrally limited.
- The API provider contract returns explicit unavailable/failure states; no fake output.

## Architecture decisions

1. PostgreSQL is the source of truth; Redis is never durable learning state.
2. Alembic owns application schema changes; init SQL only enables extensions.
3. Original files, extracted text, extraction metadata, and learning concepts remain separate records for provenance.
4. Background jobs are idempotent and identified by document ID.
5. Knowledge graph edges preserve extractor/provider/version metadata.
6. React PWA caches the application shell only; private API data is not put into Workbox's public runtime cache.
