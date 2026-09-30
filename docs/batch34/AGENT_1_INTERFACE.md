# Agent 1 interface (read-only review)

Reviewed `origin/agent1` at `297f557`. The current upstream implementation exposes the existing FastAPI application under `backend.app.main`, with async SQLAlchemy configuration in `backend.app.database`. Existing domain work includes document ingestion and learning/mastery services, and migrations `20261001_01_document_pipeline.py` and `20261001_02_learning_engine.py`.

Batch 3/4 must depend on stable identifiers from the learning domain rather than modifying its models: `student_id`, `concept_id`, and learning-path/mastery read services. Integration should be through a new router registration module and explicit dependency adapters. Agent 1's branch was not merged into this session branch, so no assumptions about final import names should be hard-coded until integration.
