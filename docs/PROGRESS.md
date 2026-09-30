# Progress

Updated: 2026-10-01

| Phase | Status | Evidence |
|---|---|---|
| Phase 0 research | Complete | Four `RESEARCH_*.md` documents and decisions |
| Step 2 auth/upload/OCR | Complete | Commit `d5ac2ac`; 19-test checkpoint |
| Batch 1 concepts/KG | Code complete; live integration blocked | Migration, provider router, fallback, graph APIs/tests |
| Batch 2 diagnostic/BKT/path | Backend complete; UI/integration open | Required tables/endpoints, exact BKT and safe bandit tests |
| 80% coverage target | Not met | Latest recorded full coverage 65% |
| Production stack verification | Blocked | Docker unavailable; no live provider keys |

## Active hardening session

Agent 1 backend hardening started 2026-10-01. Baseline is 29 passing tests and 65% combined backend/AI coverage. Plan: `docs/HARDENING_PLAN.md`.

Checkpoint 1 complete: added Hypothesis and 72 new algorithm test cases (101 focused tests total). BKT now handles degenerate probability boundaries without NaN/inf; Unicode concept normalization strips presentation/combining marks; graph centrality and 10,000-node behavior are covered. One initial Urdu normalization assertion exposed and drove the normalization fix.

Checkpoint 2 complete: 34 provider/extraction tests and 25 security tests pass. Provider ordering, malformed/partial/hallucinated output, timeouts, local OCR/PDF/Office failures, archive bombs, magic bytes, streamed size limits, filenames, production settings and HTTP headers are covered. Fixed an exclusive-file cleanup bug that could delete a pre-existing destination after `xb` failed.

Current unit: API/service contract tests and coverage measurement.

## Next engineering work

1. Raise backend coverage with service, API contract, integration and security tests.
2. Harden authentication, uploads, middleware, audit logs and tenant isolation.
3. Add metrics/readiness, performance profiling and operational runbooks.
4. Attempt real PostgreSQL/Redis/Celery integration where runtimes permit.
5. Gather sufficient response logs before any pyBKT fitting.
