# Engineering best-practice research

## FastAPI and SQLAlchemy

Use typed `Annotated` dependencies, request-scoped `AsyncSession`, asyncpg, explicit eager loading, Pydantic v2 `from_attributes`, and route/service separation. Avoid CPU/blocking work in the event loop. Transaction boundaries belong at the request/task orchestration boundary.

Sources:
- https://softaims.com/blog/fastapi-production-api-guide-2026
- https://oneuptime.com/blog/post/2026-01-27-sqlalchemy-fastapi/view

## Celery

Long OCR/LLM work belongs in a durable worker, not FastAPI BackgroundTasks. Tasks need stable IDs, idempotency, time limits, durable status, no exception leakage to students, and retry only for transient failures. Database state is authoritative; Redis result state is not.

## Pydantic v2

Use strict request/response contracts, `model_config = ConfigDict(from_attributes=True)`, bounded fields and validators. Never serialize secrets or raw provider exceptions.

## Testing

Keep deterministic unit tests for formulas/graphs/extractors, dependency-overridden API tests, and separate Docker/PostgreSQL integration tests. Mock external AI calls; assert no-provider and malformed-output behavior. A passing mocked test is not reported as a real provider integration test.

## Docker

Use slim pinned major images, non-root execution, health checks, named volumes, internal-only PostgreSQL/Redis, `.dockerignore`, migrations before API start, and shared upload storage between API/worker. Secret values enter through environment/deployment secret managers only.
