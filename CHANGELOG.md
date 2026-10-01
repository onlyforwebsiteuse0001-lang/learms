# Changelog

All notable changes to HAAFIZ EDU / Learms. Format follows Keep a Changelog; the project
uses SemVer.

## [1.5.0] — 2026-10-01 — Foundation Release (Agent 8 integration)

### Integrated
- **Agent 1 — Backend core** (was PR #1): FastAPI app (auth, documents, learning),
  extraction/OCR pipeline services, Celery tasks, Alembic migrations, Docker.
- **Agent 2 — Frontend + content** (PR #5): React 18 + TS + Vite PWA with i18n (en/ur),
  297 vitest tests, 21-course content library, content sync tooling.
- **Agent 3 — Security layer** (from `arena/01a0f44e-learms`): `security/` library —
  JWT, MFA/TOTP, OAuth PKCE, session store, password hashing (argon2), RBAC/ABAC/RLS,
  input validators (command/path/SSRF), LLM guardrails (injection detection, sanitizer,
  output validation, policy, audit), API hardening (headers, rate limiting, request
  signing), plus 30 design docs under `docs/security/`.
- **Research consolidation** into `docs/research-all/`: general (Agent 4), IT (Agent 5),
  medical (Agent 6), accounting (Agent 7) — 225+ research documents preserved.

### Fixed
- **Worker event-loop pool bug (high):** celery prefork children crashed on every task
  after the first (`asyncpg` connection reused across event loops). Workers now use a
  dedicated NullPool engine (`backend/app/tasks.py`).
- `.gitignore` hardened (union of agent rules: venvs, logs, coverage, caches).
- CI workflow `security.yml`: bare `schedule:` trigger made valid with a weekly cron.

### Added
- CI/CD: `.github/workflows/test.yml` (backend/security/frontend), `security.yml`
  (bandit, pip-audit, gitleaks, trivy), `docker.yml` (compose build + smoke test).
- `scripts/dev/run_demo_db.py` — dockerless real-PostgreSQL dev helper (pgserver).
- Release documentation: audit, test, docker, verification and morning reports under
  `docs/release/`; `content/INDEX.md`; this changelog; CONTRIBUTING; DEPLOYMENT.

### Verified
- Backend: 277 tests + 987 subtests green · Security: 20 green · Frontend: 297 green ·
  production build green · end-to-end student journey (register → upload → extract →
  concepts → diagnostic/BKT → learning path) on a live stack.

### Known limitations (honest)
- Content coverage incomplete: 21 courses of a much larger taxonomy (48 validator warnings).
- Tutor/Quiz/Planner/Mock-exam are pending-backend shells (v1.6.0).
- OCR and AI-provider paths require host tools/keys; health endpoint reports capability honestly.
- `backend/main.py` (legacy duplicate entrypoint) remains for compatibility, unused, slated for v1.6.0 cleanup.

[1.5.0]: https://github.com/onlyforwebsiteuse0001-lang/learms/releases/tag/v1.5.0
