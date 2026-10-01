# Agent 1 Backend Hardening Plan

Updated: 2026-10-01

## Guardrails

- Work only on `arena/01a0f3e4-learms` and update PR #1.
- Do not modify `frontend/`, `content/`, or Agent 3 API domains (`tutor`, `quiz`, `planner`, `exam`, `catchup`, `attendance`).
- Never claim live infrastructure/provider results unless actually executed.
- Preserve source evidence, tenant isolation, and prerequisite safety invariants.

## Baseline

- 29 tests passing.
- Combined backend/AI coverage: 65%.
- Docker unavailable in the prior session; live PostgreSQL/Redis/Celery status must be rechecked.
- No configured live AI keys at baseline.

## Execution order

1. Expand pure service/property tests and fix mathematical edge cases.
2. Add API contract/auth/tenant tests with dependency-overridden async sessions.
3. Add production security middleware, upload hardening, rate limiting, audit events, and tests.
4. Add readiness/liveness/Prometheus metrics and operational documentation.
5. Add pagination/index/query improvements, provider retries/circuit breaker/cache design, profiling and load-test assets.
6. Attempt real PostgreSQL/Redis/Celery integration if runtimes are available; otherwise provide executable opt-in tests and exact blocker evidence.
7. Run full validation, measure exact coverage/performance, update reports and PR #1.

## Checkpoints

Each coherent unit receives a `hardening: [step] - description` commit and push. `docs/PROGRESS.md` records actual results and next recovery point.

## Recovery

Read this file and `docs/PROGRESS.md`, inspect `git log --oneline -20`, then run `.venv/bin/pytest --cov=backend.app --cov=ai_services` before resuming the first incomplete item.
