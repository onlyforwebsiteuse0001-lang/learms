"""Exact, interpretable online Bayesian Knowledge Tracing updates."""
from dataclasses import dataclass


@dataclass(frozen=True)
class BKTParams:
    """Validated four-parameter BKT configuration."""
    p_learn: float = 0.15
    p_slip: float = 0.10
    p_guess: float = 0.20

    def __post_init__(self) -> None:
        for name, value in vars(self).items():
            if not 0 <= value <= 1:
                raise ValueError(f"{name} must be between 0 and 1")



def update_mastery(p_know: float, correct: bool, params: BKTParams | None = None) -> float:
    """Apply observation evidence followed by the BKT learning transition."""
    params = params or BKTParams()
    if not 0 <= p_know <= 1:
        raise ValueError("p_know must be between 0 and 1")
    if correct:
        numerator = p_know * (1 - params.p_slip)
        denominator = numerator + (1 - p_know) * params.p_guess
    else:
        numerator = p_know * params.p_slip
        denominator = numerator + (1 - p_know) * (1 - params.p_guess)
    # Degenerate parameters can assign zero likelihood to an observation. There
    # is then no Bayesian evidence to condition on, so preserve the prior rather
    # than emitting NaN/inf or inventing certainty.
    posterior = numerator / denominator if denominator > 0 else p_know
    transitioned = posterior + (1 - posterior) * params.p_learn
    return min(1.0, max(0.0, transitioned))
