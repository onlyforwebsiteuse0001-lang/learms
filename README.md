# HAAFIZ EDU (Learms)

**Pakistan-first, AI-powered personalized learning system.** Upload your notes, the
pipeline extracts concepts, diagnoses what you know (BKT), and builds a learning
path — with honest capability reporting: the system never returns fake AI or
learning results when a dependency is unavailable.

## Status — v1.5.0 (Foundation Release, 2026-10-01)

| Component | State |
|---|---|
| Backend (FastAPI, PostgreSQL, Redis, Celery) | ✅ Built, tested (277 tests), verified end-to-end |
| Extraction pipeline (PDF/DOCX/PPTX/images + OCR) | ✅ Live-verified |
| Concept extraction + knowledge graph foundations | ✅ Working (source-grounded, deterministic) |
| Diagnostic + BKT mastery + learning path API | ✅ Working (BKT posterior updates verified) |
| Frontend (React 18 + TS + Vite PWA, en/ur) | ✅ 297 tests, production build green |
| Security package (auth/authz/validators/LLM guardrails) | ✅ Integrated, 20 tests |
| Content library | 🟡 21 courses / 280 concepts across 11 fields (taxonomy has gaps — see `content/INDEX.md`) |
| Tutor / Quiz / Planner / Mock exams | ⏳ v1.6.0 (frontend shells exist as pending pages) |
| FSRS scheduling | ⏳ v1.6.0 (dependency pinned, engine not wired yet) |

## Quick start (Docker)

```bash
git clone https://github.com/onlyforwebsiteuse0001-lang/learms.git
cd learns
cp .env.example .env           # set POSTGRES_PASSWORD and SECRET_KEY
docker compose up --build
```

- API + Swagger docs: http://localhost:8000/docs
- Frontend: http://localhost:3000

## Quick start (no Docker — dev sandbox)

```bash
python3 -m venv .venv && .venv/bin/pip install -r requirements-dev.txt pgserver
.venv/bin/python scripts/dev/run_demo_db.py      # real PostgreSQL, no root needed
cp .env.example .env                              # point DATABASE_URL at the printed URI
.venv/bin/alembic upgrade head
.venv/bin/uvicorn backend.app.main:app --reload   # API on :8000
.venv/bin/celery -A backend.app.worker.celery worker --loglevel=INFO   # worker
cd frontend && npm ci && VITE_DEV_API_TARGET=http://localhost:8000 npm run dev  # UI on :3000
```

## What the student journey looks like

1. Register / login (JWT)
2. Upload notes (PDF, DOCX, PPTX, JPG/PNG/TIFF/BMP) — validated, stored privately per student
3. Background extraction (Celery): digital text → OCR fallback → cleaning → language detection
4. Source-grounded concepts appear (no invented content without a configured AI provider)
5. Diagnostic questions → BKT mastery estimate per concept
6. Personalized learning path (topological prerequisites + bandit ordering), with reasons

## Repository map

```
backend/app/          FastAPI: auth, documents, learning APIs; BKT/bandits/graph services
backend/app/tasks.py  Celery extraction tasks (NullPool worker engine — see TEST-REPORT-8)
frontend/             React 18 + TypeScript + Vite PWA (same-origin /api, i18n en/ur)
security/             Standalone security library: auth, authz, validators, LLM guardrails
content/              11 fields, 21 courses, 280 concepts (+ validator script)
database/             Alembic migrations, init scripts
ai_services/          Vision/router services for configured AI providers
docs/                 Architecture, operations, security, per-agent session records
docs/release/         Agent 8 release documentation (audit, tests, docker, morning report)
docs/research-all/    Consolidated research: general, IT, medical, accounting
```

## Docs

- Architecture: `docs/ARCHITECTURE.md` · Deployment: `docs/DEPLOYMENT.md`
- Security design: `docs/security/` · Security policy: `SECURITY.md`
- Release evidence: `docs/release/TEST-REPORT-8.md`, `docs/release/DOCKER-REPORT-8.md`
- Contributing: `CONTRIBUTING.md` · Changelog: `CHANGELOG.md`

## Principles

1. **No fake results.** Missing model/key/tool ⇒ explicit honest status, not fabricated output.
2. **Student data isolation.** Per-student UUID storage paths, auth on every learning record.
3. **Same-origin frontend.** The browser only calls relative `/api/...`; dev proxy or nginx forward it.
4. **Bilingual by default.** Errors and UI copy ship in English + Urdu.
