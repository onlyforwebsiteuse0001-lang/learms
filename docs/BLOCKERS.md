# Blockers

## Container integration
Blocker: Docker/PostgreSQL/Redis/Tesseract are unavailable in this sandbox.
Tried: tool discovery and health reporting.
Need: Docker host running `docker compose up --build`.
Impact: migration SQL, unit/API tests and builds can be validated; true queue/OCR integration remains unverified.

## Live AI providers
Blocker: Gemini/Groq/OpenRouter keys are intentionally absent.
Tried: configuration inspection.
Need: environment-injected key and provider smoke test.
Impact: deterministic extraction is testable; real provider extraction is not claimed.
