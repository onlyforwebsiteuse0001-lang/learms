# Batch 1 Report

**Status:** implemented and statically/test validated; live provider and production PostgreSQL/Celery runtime verification remain blocked by environment.

## Schema

`concepts`, `prerequisites`, and `concept_documents` are added by migration `20261001_02_learning_engine.py`. Concepts record method, confidence and verbatim evidence. Relations record confidence, evidence, method, and approval status.

## Implementation

- `ai_services/concept_router.py`: strict JSON provider router and evidence gate.
- `backend/app/services/concept_extraction_service.py`: honest deterministic fallback.
- `backend/app/services/concept_service.py`: deduplication, provenance, DAG validation and source-grounded diagnostic item creation.
- `backend/app/services/graph_service.py`: DAG construction, topological ordering, cycle rejection and gating.
- Processing task now persists concepts after extracted text.

## Validation

Unit tests cover source containment, invented evidence rejection, cycle rejection, ordering, and non-inference. Alembic offline SQL generates all Batch 1 tables. No real external API calls occur in tests.
