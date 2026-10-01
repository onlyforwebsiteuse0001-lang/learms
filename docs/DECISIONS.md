# Architecture decisions

1. **Online BKT before pyBKT fitting.** Exact Bayesian updates use documented defaults. pyBKT fitting begins only after sufficient per-concept logs. Basis: `RESEARCH_DOMAIN.md#bayesian-knowledge-tracing`.
2. **Prerequisite safety before recommendation.** Candidate content is filtered by DAG prerequisites before any bandit sampling. Basis: educational KG research.
3. **Transparent Thompson baseline.** Beta Thompson Sampling is used only after prerequisite filtering. Reward is mastery gain; mood is not inferred. Basis: contextual-bandit research.
4. **Evidence-gated extraction.** Every LLM concept requires a source evidence span and schema validation. Missing keys invoke deterministic source-only extraction, never simulated AI.
5. **No fake diagnostic generation.** Diagnostics can start only where validated questions exist. If extraction has not produced question evidence, API returns an explicit unavailable/conflict state.
6. **PostgreSQL is authoritative.** Redis/Celery coordinates work; learning state and job state remain in PostgreSQL.
7. **Safety over claimed completeness.** Docker/provider integration not executable in sandbox is listed as unverified rather than marked complete.
