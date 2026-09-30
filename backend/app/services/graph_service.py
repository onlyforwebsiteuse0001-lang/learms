"""Validated educational prerequisite graph operations."""
from __future__ import annotations

import random

import networkx as nx

from backend.app.services.bandit_service import Arm, choose_arm


class GraphCycleError(ValueError):
    """Raised when a prerequisite edge would make learning order impossible."""


def build_graph(concept_ids: list[str], edges: list[tuple[str, str]]) -> nx.DiGraph:
    """Build a DAG where each edge points prerequisite → dependent concept."""
    graph = nx.DiGraph()
    graph.add_nodes_from(concept_ids)
    valid = set(concept_ids)
    for source, target in edges:
        if source not in valid or target not in valid:
            raise ValueError("Every edge endpoint must exist in the concept set")
        if source == target:
            raise GraphCycleError("A concept cannot be its own prerequisite")
        graph.add_edge(source, target)
        if not nx.is_directed_acyclic_graph(graph):
            graph.remove_edge(source, target)
            raise GraphCycleError(f"Prerequisite edge {source} → {target} creates a cycle")
    return graph


def learning_order(graph: nx.DiGraph) -> list[str]:
    """Return a deterministic valid prerequisite-first topological order."""
    if not nx.is_directed_acyclic_graph(graph):
        raise GraphCycleError("Learning graph contains a cycle")
    return list(nx.lexicographical_topological_sort(graph, key=str))


def eligible_concepts(graph: nx.DiGraph, mastery: dict[str, float], threshold: float = 0.70) -> list[str]:
    """Return unmastered concepts whose direct prerequisites meet threshold."""
    return [
        node for node in learning_order(graph)
        if mastery.get(node, 0.0) < threshold
        and all(mastery.get(parent, 0.0) >= threshold for parent in graph.predecessors(node))
    ]


def bandit_topological_order(graph: nx.DiGraph, posteriors: dict[str, tuple[float, float]], seed: str) -> list[str]:
    """Preserve DAG generations while Thompson-sampling safe ties within each frontier."""
    if not nx.is_directed_acyclic_graph(graph):
        raise GraphCycleError("Learning graph contains a cycle")
    rng = random.Random(seed)
    ordered: list[str] = []
    for generation in nx.topological_generations(graph):
        remaining = set(generation)
        while remaining:
            arms = [Arm(node, *posteriors.get(node, (1.0, 1.0))) for node in sorted(remaining)]
            selected = choose_arm(arms, rng)
            ordered.append(selected.concept_id)
            remaining.remove(selected.concept_id)
    return ordered
