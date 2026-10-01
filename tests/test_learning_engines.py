"""Deterministic engine tests for graph, BKT, bandit, and extraction safety."""
import random

import pytest

from backend.app.services.bandit_service import Arm, choose_arm, update_posterior
from backend.app.services.bkt_service import BKTParams, update_mastery
from backend.app.services.concept_extraction_service import extract_deterministic
from backend.app.services.graph_service import (
    GraphCycleError,
    bandit_topological_order,
    build_graph,
    eligible_concepts,
    learning_order,
)


def test_bkt_correct_increases_and_incorrect_decreases_evidence() -> None:
    params = BKTParams(p_learn=.1, p_slip=.1, p_guess=.2)
    assert update_mastery(.3, True, params) > .3
    assert update_mastery(.8, False, params) < .8


def test_graph_rejects_cycle_and_orders_prerequisites() -> None:
    graph = build_graph(["a", "b", "c"], [("a", "b"), ("b", "c")])
    assert learning_order(graph) == ["a", "b", "c"]
    with pytest.raises(GraphCycleError):
        build_graph(["a", "b"], [("a", "b"), ("b", "a")])


def test_prerequisite_gating() -> None:
    graph = build_graph(["foundation", "advanced"], [("foundation", "advanced")])
    assert eligible_concepts(graph, {}) == ["foundation"]
    assert eligible_concepts(graph, {"foundation": .8}) == ["advanced"]


def test_bandit_is_reproducible_and_reward_updates() -> None:
    selected = choose_arm([Arm("a", 9, 1), Arm("b", 1, 9)], random.Random(42))
    assert selected.concept_id == "a"
    assert update_posterior(1, 1, .75) == (1.75, 1.25)


def test_deterministic_extraction_uses_source_only() -> None:
    text = "Cell Biology\nCell biology studies cells and their processes in living organisms.\nAdvanced Genetics requires Cell Biology."
    concepts, edges = extract_deterministic(text)
    assert concepts[0].name == "Cell Biology"
    assert concepts[0].evidence in text
    assert edges[0].source_name == "Cell Biology"
    assert edges[0].evidence in text


def test_bandit_order_never_violates_prerequisites() -> None:
    graph = build_graph(["foundation", "choice_a", "choice_b"], [("foundation", "choice_a"), ("foundation", "choice_b")])
    order = bandit_topological_order(graph, {"choice_a": (9, 1), "choice_b": (1, 9)}, "student-course")
    assert order[0] == "foundation"
    assert set(order[1:]) == {"choice_a", "choice_b"}
