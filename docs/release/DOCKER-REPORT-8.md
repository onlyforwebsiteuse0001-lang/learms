# DOCKER-REPORT-8 — Build/Runtime Verification for v1.5.0

**Date:** 2026-10-01 · **Executor:** Agent 8

## 1. Docker availability

Docker / docker compose are **NOT available** in the release sandbox (no daemon, package mirrors blocked). Therefore: (a) static verification of all Docker assets, (b) a **native equivalent stack** running the same components, and (c) a CI workflow (`.github/workflows/docker.yml`) so `docker compose build` is exercised on GitHub runners where Docker exists.

## 2. Static verification of Docker assets ✅

| Asset | Verdict |
|---|---|
| `docker-compose.yml` | 5 services wired correctly: `postgres:16-alpine` (healthcheck pg_isready), `redis:7-alpine` (AOF, 256mb, healthcheck), `backend` (env_file + DATABASE_URL/REDIS_URL/CELERY_* interpolation, volume for uploads, health-gated depends_on, port 8000), `worker` (celery `-A backend.app.worker.celery`, concurrency 2), `frontend` (port 3000→80). Required secret `POSTGRES_PASSWORD` enforced via `:?`. Named volumes declared. |
| `backend/Dockerfile` | python:3.11-slim, tesseract eng+urd + poppler installed, non-root `appuser`, HEALTHCHECK hits `/api/health` (route confirmed present), entrypoint runs `alembic upgrade head` then uvicorn. Requirements install before code copy (layer-cache friendly). |
| `frontend/Dockerfile` + `nginx.conf` | Multi-stage node build → nginx; nginx proxies `/api` to `backend:8000` (matches frontend same-origin design). |
| `.dockerignore` | Excludes venv/node_modules/dist/coverage/git. |

No defects found statically. (Real container build runs in CI — workflow added in Phase 5.)

## 3. Native equivalent stack (this sandbox) ✅

| Component | Production (compose) | Sandbox substitute |
|---|---|---|
| PostgreSQL 16 | `postgres:16-alpine` | **Real PostgreSQL** via pip `pgserver` (unix socket, role+db `haafiz`, alembic migrations applied clean) — helper: `scripts/dev/run_demo_db.py` |
| Redis 7 | broker/result/dedupe | kombu `sqla+sqlite` broker + `db+sqlite` results (sandbox substitution; caveat: stale-message visibility if worker dies ungracefully) |
| API | uvicorn in container | uvicorn `backend.app.main:app` :8000 (system python deps identical to requirements.txt) |
| Worker | celery container | celery worker (prefork, concurrency 1) |
| Frontend | nginx :3000 | vite dev :3000 with `/api` proxy → localhost:8000 |

## 4. End-to-end verification (real calls, real DB) ✅

Full student journey executed against the running stack on 2026-10-01:

1. ✅ `POST /api/v1/auth/register` → JWT + student_id (UUID)
2. ✅ Upload validation: `.txt` rejected with precise bilingual error; valid PDF accepted (202)
3. ✅ Async pipeline: `queued → success` in ~3s (worker + DB). First run exposed a **real cross-event-loop pool bug** → fixed (NullPool worker engine), re-verified twice
4. ✅ `GET /documents` + `GET /documents/{id}/text` — page text, method/confidence provenance
5. ✅ `GET /concepts?course=…` — 5 source-grounded concepts from headings (no AI keys configured → deterministic path, honestly empty AI provider list)
6. ✅ `POST /diagnostic/start` → 3 questions; answers → result with **BKT mastery deltas** (0.20→0.60 correct, 0.20→0.176 wrong)
7. ✅ `GET /mastery/{student_id}` — per-concept mastery with `parameter_status: default_until_sufficient_data` honesty flag
8. ✅ `POST /path/generate` + `GET /path/current` — topological+learning-order path with reasons

`GET /api/health` → `{"status":"ok",...,"tesseract_installed":false,"ai_providers_enabled":[]}` (honest capability reporting, by design).

## 5. Sandbox limitations (not repo defects)

- Container build not executed here → CI `docker.yml` covers it.
- OCR (tesseract) and AI-provider paths unexercised live; unit tests cover logic; honest health flags.
- sqla+sqlite broker is dev-grade only; production uses Redis (as compose does).
