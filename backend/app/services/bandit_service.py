"""Transparent Thompson Sampling primitives for learning recommendations."""
from __future__ import annotations

import random
from dataclasses import dataclass


@dataclass(frozen=True)
class Arm:
    """One eligible concept's Beta posterior."""
    concept_id: str
    alpha: float = 1.0
    beta: float = 1.0


def choose_arm(arms: list[Arm], rng: random.Random | None = None) -> Arm:
    """Select by probability matching; callers must prerequisite-filter arms first."""
    if not arms:
        raise ValueError("At least one prerequisite-safe arm is required")
    rng = rng or random.Random()
    return max(arms, key=lambda arm: rng.betavariate(arm.alpha, arm.beta))


def update_posterior(alpha: float, beta: float, reward: float) -> tuple[float, float]:
    """Update Beta evidence with normalized mastery gain in [0, 1]."""
    if alpha <= 0 or beta <= 0:
        raise ValueError("Beta parameters must be positive")
    if not 0 <= reward <= 1:
        raise ValueError("Reward must be normalized to [0, 1]")
    return alpha + reward, beta + (1 - reward)
