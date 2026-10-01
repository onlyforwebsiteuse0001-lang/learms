# Decisions

## D3-001: Isolate batch services behind adapters
**Decision:** Batch 3/4 services will depend on provider and learning-domain protocols, not Agent 1 internals.
**Basis:** The agent branch is separate and import names may change.
**Alternative:** Import concrete mastery/document models directly.
**Impact:** Safer parallel work, with an integration adapter required later.

## D3-002: Advisory LLM evaluation
**Decision:** Validate and label LLM feedback as advisory; deterministic fallbacks return unavailable rather than invented data.
**Basis:** Safety and honest-output requirements.
**Alternative:** Trust arbitrary provider JSON.
**Impact:** More explicit error handling and test fixtures.

## D3-003: Wellness is non-diagnostic
**Decision:** Pattern flags only trigger human escalation workflows.
**Basis:** Ethical safety requirements.
**Alternative:** Automated mental-health recommendations.
**Impact:** Requires privacy controls and counselor routing.
