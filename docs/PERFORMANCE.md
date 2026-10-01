# Backend Performance Report

Date: 2026-10-01

## Measured baseline

A serial in-process `TestClient` benchmark ran 1,000 warmed `GET /api/health` requests with security and metrics middleware enabled:

| Metric | Result |
|---|---:|
| P50 | 4.394 ms |
| P95 | 6.688 ms |
| P99 | 7.641 ms |
| Maximum | 60.499 ms |
| Serial throughput | 219.00 requests/second |

These numbers measure Python/in-process test overhead on the Arena sandbox. They are **not** production network results, do not represent 1,000 concurrent users, and do not include PostgreSQL, Redis, Celery, OCR, or LLM latency. Therefore the 1,000 req/s production target is not claimed.

`cProfile` attributed most cumulative time to TestClient/httpx/AnyIO thread synchronization. No application business function appeared among the top cumulative entries for this health-only workload.

## Implemented optimizations

- GZip middleware for responses of at least 1,000 bytes.
- Existing ownership/course/status indexes retained.
- Pagination already enforced for document and extracted-text listings.
- Graph bandit ordering uses bounded topological generations.
- Provider input is capped at 50,000 characters.
- Streamed uploads avoid loading complete files into memory.
- Prometheus metrics use route templates rather than raw IDs, avoiding cardinality explosion.

## Scale risks found

1. Learning concept/path endpoints currently have no pagination.
2. Concept extraction performs several sequential flushes and existence checks (N+1 behavior on large concept sets).
3. Path generation materializes all concepts/edges/mastery states for a course.
4. Process-local metrics are not aggregated across workers.
5. LLM resilience has provider fallback but no durable response cache or circuit breaker.
6. No live database query timings were available because PostgreSQL was unavailable.

## Recommended next measurements

Run the included `load_tests/locustfile.py` against a production-like multi-worker deployment. Test 100, then 1,000 concurrent users; do not attempt 10,000 before database pool and worker saturation are understood. Record API-route P95, DB pool wait, SQL duration, Redis latency, queue depth, worker memory, OCR duration, error rate, and host saturation.
