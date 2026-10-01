# ADR 002: Thompson Sampling behind prerequisite safety

## Context
The product needs adaptive recommendations but lacks enough data and safety evidence for unconstrained reinforcement learning.

## Decision
Use Beta-posterior Thompson Sampling with Beta(1,1) cold start. Prerequisite DAG generations are a hard safety boundary; sampling only orders eligible ties. Reward is normalized observed mastery improvement, not clicks or inferred mood.

## Consequences
Exploration is interpretable and auditable. It cannot bypass prerequisites. Context and reward sophistication are intentionally limited until genuine observations exist.
