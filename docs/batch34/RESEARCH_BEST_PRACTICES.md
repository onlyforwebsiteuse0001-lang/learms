# Best practices

- Keep FastAPI handlers thin; use async I/O and never run blocking LLM/CPU work directly on the event loop.
- Use a task queue for long quiz generation and return a job status; use BackgroundTasks only for small post-response work.
- Use a WebSocket connection manager with disconnect cleanup, authentication, bounded messages, and polling fallback.
- Use Pydantic v2 schemas with strict validation and response models; reject unknown/unsafe generated fields.
- Use SQLAlchemy async sessions with request-scoped lifetime and transactions around state changes.
- Mock provider clients at the service boundary; test timeout, malformed output, and fallback behavior.
- Keep migrations additive, uniquely timestamped, and reversible where practical.
