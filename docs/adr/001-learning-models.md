# ADR 001: Interpretable learning models

## Context
HAAFIZ EDU starts without the large, representative response logs required for neural knowledge tracing or reliable parameter fitting.

## Decision
Use exact online Bayesian Knowledge Tracing for current mastery and retain pyBKT for later offline fitting after sufficient logs. Use FSRS—not SM-2—for the later review scheduler because FSRS models difficulty, stability and retrievability explicitly.

## Consequences
Mastery is explainable as `p_know`; defaults must never be described as fitted. BKT has simpler assumptions than DKT. FSRS integration remains separate future work and must not be approximated under its name.
