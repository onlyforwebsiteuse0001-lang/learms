# Contributing to HAAFIZ EDU

## Ground rules

1. **Never fake results.** If a model, key, or system tool is missing, report the
   capability as unavailable. Fabricated AI/learning output is a release-blocking defect.
2. Keep student data isolated: per-student paths, auth on every request, no caches of
   private learning data in shared stores.
3. All user-facing errors are bilingual (English + Urdu).
4. Frontend stays same-origin: browser code calls relative `/api/...` only.

## Development setup

See README "Quick start" (Docker) or "no Docker" path. For tests you need:

```bash
python3 -m venv .venv && .venv/bin/pip install -r requirements-dev.txt
cd frontend && npm ci && cd ..
```

## Running tests (important ordering)

```bash
# 1. Generate the gitignored frontend content mirror FIRST (one pytest asserts it)
python3 scripts/content/sync_to_frontend.py
# 2. Backend + ai_services
.venv/bin/python -m pytest tests/ -q
# 3. Security package (needs: argon2-cffi pyotp cryptography PyJWT pydantic hypothesis)
.venv/bin/python -m pytest security/tests/ -q
# 4. Frontend
cd frontend && npm test && npm run build
```

Content changes must pass `python3 scripts/content/validate_content.py`.

## Conventions

- Branches: `arena/<id>-learms` per agent session; PRs target `main`; **no force-push**.
- Commits: imperative, scoped (`backend:`, `frontend:`, `security:`, `docs:`, `release:`).
- Secrets only via environment (see `.env.example`); nothing secret-shaped in commits —
  CI runs gitleaks.
- Python 3.11, FastAPI 0.115+, SQLAlchemy 2 async, Celery 5; TypeScript strict, vitest.

## Releasing

Agent 8's release runbook lives in `docs/release/` (SESSION-STATE-8 → MORNING_REPORT-8).
Tags: `vMAJOR.MINOR.PATCH`; GitHub Releases carry changelog notes.
