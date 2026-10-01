# DEPLOYMENT — HAAFIZ EDU v1.5.0

## 1. Docker Compose (canonical)

```bash
cp .env.example .env
# REQUIRED: edit .env — POSTGRES_PASSWORD, SECRET_KEY (>=32 chars), HAAFIZ_ADMIN_*
docker compose up --build -d
docker compose ps                 # 5 services: postgres, redis, backend, worker, frontend
curl http://localhost:8000/api/health
```

Services:

| Service | Image/build | Port | Notes |
|---|---|---|---|
| postgres | postgres:16-alpine | — | init scripts mounted from `database/init/` |
| redis | redis:7-alpine | — | AOF on, 256mb LRU |
| backend | `backend/Dockerfile` | 8000 | runs `alembic upgrade head` then uvicorn |
| worker | same image, celery command | — | extraction/concept tasks |
| frontend | `frontend/Dockerfile` (nginx) | 3000 | proxies `/api` → backend |

Volumes: `postgres_data`, `redis_data`, `upload_data`.

## 2. Environment variables

See `.env.example` (fully commented). Production mandates:

- `APP_ENV=production`, `FORCE_HTTPS=true`, strong `SECRET_KEY`
- `CORS_ORIGINS` restricted to your domain
- `GEMINI_API_KEY` / `GROQ_API_KEY` only if AI providers are wanted — absent keys ⇒ the
  platform stays deterministic and says so (no fake AI)

## 3. Dockerless development (works on bare machines)

We ship a real-PostgreSQL helper that needs no root/Docker (used for the v1.5.0
release verification):

```bash
.venv/bin/pip install pgserver
.venv/bin/python scripts/dev/run_demo_db.py     # prints a unix-socket URI
# put that URI (as postgresql+asyncpg://…) into .env DATABASE_URL, then:
.venv/bin/alembic upgrade head
.venv/bin/uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
.venv/bin/celery -A backend.app.worker.celery worker --loglevel=INFO --concurrency=1
cd frontend && VITE_DEV_API_TARGET=http://localhost:8000 npm run dev
```

Without Redis, Celery can use the SQLAlchemy broker for dev only:
`CELERY_BROKER_URL=sqla+sqlite:////tmp/haafiz-celery-broker.db`,
`CELERY_RESULT_BACKEND=db+sqlite:////tmp/haafiz-celery-results.db`.
Caveat (verified during release): if the worker dies ungracefully, queued messages may
stay invisible until the visibility timeout — purge and restart the worker. Use Redis
for anything serious.

## 4. Health & operations

- `GET /api/health` — status + honest capability flags (tesseract, AI providers)
- `GET /api/health/live` — liveness
- Logs: structured JSON via structlog; `docker compose logs -f backend worker`
- DB migrations: `alembic upgrade head` (idempotent; runs automatically on backend boot)

## 5. CI/CD

- `test.yml` — backend (pytest + coverage), security package, frontend (vitest + build)
- `security.yml` — bandit, pip-audit, gitleaks, Trivy (weekly cron + per-push)
- `docker.yml` — compose config validation, full image build, backend health smoke test
