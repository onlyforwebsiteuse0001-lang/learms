# Batch 3/4 domain research

## Socratic tutoring
Use graduated scaffolding: clarify goal, ask for the learner's reasoning, offer an analogy, reveal a partial constraint, then provide a worked example only after demonstrated attempts. Never silently substitute an answer for a hint. Signals such as three consecutive errors, long pauses, and negative language should increase support while remaining non-diagnostic. Bloom levels (remember, understand, apply, analyze, evaluate, create) can select prompts and quiz items.

## FSRS
FSRS models stability, difficulty, and retrievability; retrievability follows a power-law forgetting curve and intervals target a desired retention. Persist state and review rating, not only a due date. Model New, Learning, Review, and Relearning transitions. Prefer the maintained `fsrs` package when dependency policy allows; otherwise isolate a scheduler adapter and test it against known vectors. This is preferable to SM-2's fixed ease-factor heuristic because FSRS is trained around retention and uses richer state.

## Adaptive assessment
A 3PL IRT item uses discrimination, difficulty, and guessing. Select items near estimated ability, constrain exposure, and calibrate from enough responses; do not claim calibrated ability from a single attempt. Include Bloom level and concept tags, and expose uncertainty.

## Explain-back
Score separate rubric dimensions: correctness, completeness, clarity, and appropriate examples. Return actionable feedback and preserve the learner's text. LLM output must be schema-validated, versioned, and treated as advisory; deterministic validation should handle malformed responses.

## Planning and catch-up
Prioritize due reviews, weak concepts, then new work. Generate bounded time blocks with Pomodoro defaults (25/5, configurable 50/10), prerequisites first, and explicit missed-session rescheduling. Catch-up plans should state assumptions and never invent unavailable resources.

## Exams
Enforce duration server-side, prohibit hints during attempts, record per-question timing, and calculate analytics from submitted answers. Revision plans should use due reviews, weak areas, and countdown time.

## Wellness safety
Mood, stress, sleep, and notes are self-reported signals, not diagnoses. Use plain disclaimers, minimize retention, restrict access, and escalate crisis indicators to a qualified human workflow. Never provide automated therapy or imply clinical certainty.

## Prompt versioning
Store prompt identifiers and versions with generated/evaluated artifacts. Use provider fallbacks only behind a common interface, with explicit unavailable/error states rather than fabricated content.
