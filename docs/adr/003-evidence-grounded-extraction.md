# ADR 003: Evidence-grounded extraction and fallback

## Context
Student notes are authoritative. Provider hallucinations would corrupt concepts, questions and mastery downstream.

## Decision
Require strict provider JSON and exact source-substring evidence for every accepted concept/relation. Route Gemini, Groq, then OpenRouter when configured. If unavailable or invalid, use a clearly labelled deterministic heading/explicit-relation extractor.

## Consequences
Unsupported output is discarded and missing AI does not block conservative extraction. Recall is intentionally lower than unconstrained generation. Deterministic output must never be presented as AI output.
