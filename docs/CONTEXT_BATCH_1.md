# Batch 1 Context — Source Ingestion and Concept Graph

## Implemented

- Upload/OCR pipeline from Step 2 remains the source of truth.
- Successful extraction now invokes concept extraction in the same durable processing task.
- Provider order: Gemini → Groq → OpenRouter when administrator keys are configured.
- Every provider response is schema validated; evidence must be an exact source substring.
- Missing/failing providers use an explicitly labelled `deterministic_source_only` heading/explicit-relation extractor.
- Concepts are conservatively deduplicated by student, course key, and normalized name.
- Concept-document links preserve source evidence.
- Only explicit deterministic prerequisite phrases are emitted; all graph additions are cycle checked.
- Diagnostic questions use only real headings from at least three extracted concepts as alternatives.

## Safety invariants

No key means no AI claim. Provider output unsupported by source is discarded. Cyclic or missing-endpoint edges are rejected. Deterministic extraction does not infer semantic prerequisites.

## API

- `GET /api/v1/concepts?course=...`
- `GET /api/v1/concepts/{concept_id}/prerequisites`
- `POST /api/v1/jobs/{job_id}/retry`

## Known limits

The deterministic method targets clear headings and explicit English prerequisite phrases. Urdu content is retained as concepts when clearly formatted but deterministic Urdu relation extraction is not yet implemented. Live provider calls were not run because keys are absent; routing and hallucinated-evidence rejection are tested with mocks.
