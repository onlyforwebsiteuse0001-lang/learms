"""High-volume boundary and property tests for adaptive-learning primitives."""
from __future__ import annotations

import math
import random
import string

import networkx as nx
import pytest
from hypothesis import given, settings
from hypothesis import strategies as st

from backend.app.services.bandit_service import Arm, choose_arm, update_posterior
from backend.app.services.bkt_service import BKTParams, update_mastery
from backend.app.services.concept_extraction_service import (
    extract_deterministic,
    normalize_name,
)
from backend.app.services.graph_service import (
    GraphCycleError,
    bandit_topological_order,
    build_graph,
    concept_centrality,
    eligible_concepts,
    learning_order,
)


@pytest.mark.parametrize("p_know", [0.0, 1e-15, .01, .1, .2, .5, .8, .99, 1 - 1e-15, 1.0])
@pytest.mark.parametrize("correct", [False, True])
def test_bkt_outputs_are_finite_and_bounded(p_know: float, correct: bool) -> None:
    result = update_mastery(p_know, correct)
    assert math.isfinite(result)
    assert 0 <= result <= 1


@pytest.mark.parametrize("field", ["p_learn", "p_slip", "p_guess"])
@pytest.mark.parametrize("value", [-math.inf, -1, -.001, 1.001, 2, math.inf])
def test_bkt_rejects_parameters_outside_probability_domain(field: str, value: float) -> None:
    values = {"p_learn": .15, "p_slip": .1, "p_guess": .2, field: value}
    with pytest.raises(ValueError, match=field):
        BKTParams(**values)


@pytest.mark.parametrize("value", [-math.inf, -1, -.001, 1.001, 2, math.inf])
def test_bkt_rejects_invalid_prior(value: float) -> None:
    with pytest.raises(ValueError, match="p_know"):
        update_mastery(value, True)


def test_all_correct_sequence_converges_to_one() -> None:
    mastery = .2
    for _ in range(1_000):
        mastery = update_mastery(mastery, True)
    assert mastery == pytest.approx(1.0)


def test_all_wrong_with_no_learning_converges_to_zero() -> None:
    mastery = .8
    params = BKTParams(p_learn=0, p_slip=.1, p_guess=.2)
    for _ in range(1_000):
        mastery = update_mastery(mastery, False, params)
    assert mastery == pytest.approx(0.0, abs=1e-100)


def test_alternating_long_sequence_remains_numerically_stable() -> None:
    mastery = .2
    for index in range(10_000):
        mastery = update_mastery(mastery, index % 2 == 0)
    assert math.isfinite(mastery) and 0 <= mastery <= 1


@pytest.mark.parametrize(
    ("params", "prior", "correct", "expected"),
    [
        (BKTParams(p_learn=1, p_slip=.1, p_guess=.2), .2, False, 1),
        (BKTParams(p_learn=0, p_slip=0, p_guess=.2), .2, False, 0),
        (BKTParams(p_learn=0, p_slip=1, p_guess=0), .2, True, .2),
        (BKTParams(p_learn=0, p_slip=0, p_guess=1), 0, False, 0),
        (BKTParams(p_learn=0, p_slip=1, p_guess=1), 1, True, 1),
    ],
)
def test_bkt_degenerate_boundaries_are_defined(params: BKTParams, prior: float, correct: bool, expected: float) -> None:
    assert update_mastery(prior, correct, params) == pytest.approx(expected)


@given(
    p=st.floats(0, 1, allow_nan=False, allow_infinity=False),
    learn=st.floats(0, 1, allow_nan=False, allow_infinity=False),
    slip=st.floats(0, 1, allow_nan=False, allow_infinity=False),
    guess=st.floats(0, 1, allow_nan=False, allow_infinity=False),
    correct=st.booleans(),
)
@settings(max_examples=250)
def test_random_bkt_update_is_always_a_probability(p: float, learn: float, slip: float, guess: float, correct: bool) -> None:
    result = update_mastery(p, correct, BKTParams(learn, slip, guess))
    assert math.isfinite(result)
    assert 0 <= result <= 1


@given(st.lists(st.booleans(), min_size=0, max_size=500))
@settings(max_examples=100)
def test_random_answer_sequences_remain_bounded(answers: list[bool]) -> None:
    mastery = .2
    for answer in answers:
        mastery = update_mastery(mastery, answer)
    assert 0 <= mastery <= 1


@pytest.mark.parametrize("reward", [-1, -.01, 1.01, 2, math.inf])
def test_bandit_rejects_invalid_rewards(reward: float) -> None:
    with pytest.raises(ValueError, match="Reward"):
        update_posterior(1, 1, reward)


@pytest.mark.parametrize(("alpha", "beta"), [(0, 1), (1, 0), (-1, 1), (1, -1)])
def test_bandit_rejects_nonpositive_beta_parameters(alpha: float, beta: float) -> None:
    with pytest.raises(ValueError, match="positive"):
        update_posterior(alpha, beta, .5)


def test_bandit_empty_arm_set_is_explicit_error() -> None:
    with pytest.raises(ValueError, match="At least one"):
        choose_arm([])


def test_bandit_exploitation_dominates_with_strong_posterior() -> None:
    arms = [Arm("strong", 100, 1), Arm("weak", 1, 100)]
    wins = sum(choose_arm(arms, random.Random(seed)).concept_id == "strong" for seed in range(500))
    assert wins >= 495


def test_bandit_cold_start_explores_both_arms() -> None:
    arms = [Arm("a"), Arm("b")]
    selected = {choose_arm(arms, random.Random(seed)).concept_id for seed in range(100)}
    assert selected == {"a", "b"}


@pytest.mark.parametrize(
    ("nodes", "edges", "expected"),
    [([], [], []), (["a"], [], ["a"]), (["b", "a"], [], ["a", "b"]), (["a", "b", "c"], [("a", "c")], ["a", "b", "c"]), (["a", "b", "c"], [("b", "c"), ("a", "c")], ["a", "b", "c"]),
    ],
)
def test_graph_shapes_have_deterministic_topology(nodes: list[str], edges: list[tuple[str, str]], expected: list[str]) -> None:
    assert learning_order(build_graph(nodes, edges)) == expected


@pytest.mark.parametrize(
    "edges",
    [[("a", "a")], [("a", "b"), ("b", "a")], [("a", "b"), ("b", "c"), ("c", "a")]],
)
def test_graph_rejects_cycle_shapes(edges: list[tuple[str, str]]) -> None:
    nodes = sorted({item for edge in edges for item in edge})
    with pytest.raises(GraphCycleError):
        build_graph(nodes, edges)


def test_graph_rejects_unknown_endpoint() -> None:
    with pytest.raises(ValueError, match="endpoint"):
        build_graph(["a"], [("a", "missing")])


def test_ten_thousand_node_graph_orders_without_recursion_failure() -> None:
    nodes = [str(index) for index in range(10_000)]
    graph = build_graph(nodes, [(str(index), str(index + 1)) for index in range(9_999)])
    order = learning_order(graph)
    assert len(order) == 10_000 and order[0] == "0" and order[-1] == "9999"


def test_centrality_empty_single_and_chain() -> None:
    assert concept_centrality(nx.DiGraph()) == {}
    assert concept_centrality(build_graph(["only"], [])) == {"only": 1.0}
    scores = concept_centrality(build_graph(["a", "b", "c"], [("a", "b"), ("b", "c")]))
    assert scores["b"] > scores["a"] == scores["c"]


def test_bandit_topology_is_stable_for_same_seed() -> None:
    graph = build_graph(["root", "a", "b", "leaf"], [("root", "a"), ("root", "b"), ("a", "leaf"), ("b", "leaf")])
    posteriors = {"a": (3, 2), "b": (2, 3)}
    first = bandit_topological_order(graph, posteriors, "stable")
    assert first == bandit_topological_order(graph, posteriors, "stable")
    assert first[0] == "root" and first[-1] == "leaf"


def test_eligible_concepts_boundary_threshold() -> None:
    graph = build_graph(["root", "leaf"], [("root", "leaf")])
    assert eligible_concepts(graph, {"root": .699999}) == ["root"]
    assert eligible_concepts(graph, {"root": .7}) == ["leaf"]
    assert eligible_concepts(graph, {"root": .7, "leaf": .7}) == []


@pytest.mark.parametrize(
    ("raw", "expected"),
    [("  Cell   Biology! ", "cell biology"), ("عِلْم الأحياء", "علم الأحياء"), ("C++", "c++"), ("---", "---"), ("", "")],
)
def test_concept_normalization_boundaries(raw: str, expected: str) -> None:
    assert normalize_name(raw) == expected


@pytest.mark.parametrize(
    "heading",
    ["Cell Biology", "علم الأحياء", "A Heading With Unicode Ω", "1.2 Genetics", "2) Advanced Algebra"],
)
def test_heading_extraction_supports_varied_source_text(heading: str) -> None:
    text = f"{heading}\nThis source sentence provides a sufficiently detailed description for the heading."
    concepts, _ = extract_deterministic(text)
    assert concepts and concepts[0].evidence in text


def test_extraction_caps_huge_heading_input() -> None:
    text = "\n".join(f"Concept {letter}{index}\nA sufficiently long source description for concept number {index}." for index, letter in enumerate(string.ascii_uppercase * 10))
    concepts, _ = extract_deterministic(text, max_concepts=17)
    assert len(concepts) == 17


def test_explicit_relation_requires_both_valid_names() -> None:
    text = "Advanced Genetics requires Cell Biology."
    _, relations = extract_deterministic(text)
    assert len(relations) == 1
    assert relations[0].source_name == "Cell Biology"
    assert relations[0].target_name == "Advanced Genetics"
