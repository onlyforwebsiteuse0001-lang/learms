# Batch 2 Context — Diagnostic, Mastery and Learning Paths

## BKT

The engine uses exact online BKT: observation posterior followed by learning transition. Persisted state is `p_know`; displayed mastery is exactly `p_know * 100`. Defaults are `p_know=.20`, `p_learn=.15`, `p_slip=.10`, `p_guess=.20` and are explicitly identified as defaults, not fitted values. pyBKT remains reserved for offline fitting after sufficient response logs.

## Diagnostics

A diagnostic can start only with at least three validated, source-grounded items. Otherwise the API returns an explicit bilingual unavailable response. Each answer updates BKT immediately and stores before/after evidence.

## Paths and bandit

Prerequisites form a DAG. Topological generations are the safety boundary; Thompson Sampling only orders concepts within an eligible generation and therefore cannot bypass prerequisites. Cold start is Beta(1,1). Reward is normalized positive mastery improvement from a real answer; no clicks or inferred mood are used. Mood is not currently collected.

## Explainability

Path steps store a prerequisite/foundation reason and expose source evidence. Current API copy supports English and Roman Urdu errors. Full Roman Urdu explanation translation remains future UI work.
