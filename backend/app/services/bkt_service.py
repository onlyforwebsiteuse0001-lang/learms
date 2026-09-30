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
        if self.p_slip + self.p_guess >= 1:
            raise ValueError("slip + guess must be below 1 for identifiable evidence")


def update_mastery(p_know: float, correct: bool, params: BKTParams | None = None) -> float:
    """Apply observation evidence followed by the BKT learning transition."""
    params = params or BKTParams()
    if not 0 <= p_know <= 1:
        raise ValueError("p_know must be between 0 and 1")
    if correct:
        denominator = p_know * (1 - params.p_slip) + (1 - p_know) * params.p_guess
        posterior = p_know * (1 - params.p_slip) / denominator
    else:
        denominator = p_know * params.p_slip + (1 - p_know) * (1 - params.p_guess)
        posterior = p_know * params.p_slip / denominator
    transitioned = posterior + (1 - posterior) * params.p_learn
    return min(1.0, max(0.0, transitioned))
