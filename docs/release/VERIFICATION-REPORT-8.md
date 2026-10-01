# VERIFICATION-REPORT-8 — v1.5.0 Post-Release Validation

**Date:** 2026-10-01 · **Verifier:** Agent 8 · Method: live stack (native equivalent of compose)

## End-to-end student journey (all steps real, curl + running services)

| # | Step | Result |
|---|---|---|
| 1 | `POST /api/v1/auth/register` | ✅ 201, JWT (211-char bearer) + student UUID |
| 2 | Negative validation: upload `.txt` | ✅ Rejected — precise bilingual error naming supported types |
| 3 | Upload valid PDF | ✅ 202 `queued`, per-student storage |
| 4 | Async pipeline (`GET /jobs/{id}`) | ✅ `queued → success` ≈3s (Celery + real PostgreSQL) |
| 5 | `GET /documents`, `GET /documents/{id}/text` | ✅ page text + extraction method/confidence provenance |
| 6 | `GET /concepts?course=…` | ✅ 5 source-grounded concepts from headings (0 AI keys configured — deterministic honesty) |
| 7 | Diagnostic: start → answer ×3 → result | ✅ BKT posterior: 0.20→0.60 (correct), 0.20→0.176 (wrong); session completes |
| 8 | `GET /mastery/{student}` | ✅ per-concept % + `default_until_sufficient_data` honesty flag |
| 9 | `POST /path/generate`, `GET /path/current` | ✅ ordered 5-step path with `foundation` phase + reasons |
| 10 | `GET /api/health`, `/api/health/live`, `/docs` | ✅ ok / alive / 200 (Swagger) |
| 11 | Frontend dev server + `/api` proxy | ✅ vite on :3000, content synced (23 files), preview-host allowlist set |

## Regression caused/fixed during verification

- **Found:** cross-event-loop asyncpg reuse in celery workers (any second task in one child failed).
- **Fix:** NullPool worker engine (`backend/app/tasks.py`), full backend suite re-run: **277 passed / 0 failed** after fix.
- **Left as-is:** sqla+sqlite broker visibility quirk (sandbox-only; Redis in production compose).

## Performance snapshot (sandbox, 1 worker)

- Upload→extracted+concepts for a 1-page PDF: ~3s end-to-end.
- Health endpoint p95: <50ms local.
- Frontend build: 1.3s, PWA precache 330.86 KiB.

## Security verification

- `security/tests/` 20/20 (JWT binding, MFA, session limits, OAuth PKCE, path/command/SSRF validators, LLM injection/policy/redaction).
- No secrets tracked (`.env` gitignored; repo scanned — see TEST-REPORT + bandit/pip-audit results in MORNING_REPORT).
- Auth required on all student endpoints (401 verified unauthenticated).

## Conclusion

v1.5.0 meets its release bar: tested, integrated, honest about limitations. Ready for **demo/beta**; production hardening items tracked for v1.6.0 (see `docs/release/ROADMAP-v1.6.0.md` / GitHub issues).
