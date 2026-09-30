import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Concept } from '../../api/types';
import { renderWithProviders } from '../../test/utils';
import { ConceptGraph, layoutGraph } from './ConceptGraph';

const concept = (id: string, name = id): Concept => ({
  concept_id: id,
  name,
  description: null,
  phase: null,
  confidence: null,
  extraction_method: null,
  evidence: null,
});

const layerOf = (nodes: ReturnType<typeof layoutGraph>['nodes'], id: string) =>
  nodes.find((node) => node.concept.concept_id === id)!.layer;

describe('layoutGraph', () => {
  it('puts a root concept in layer 0', () => {
    const { nodes } = layoutGraph([concept('a')], []);
    expect(layerOf(nodes, 'a')).toBe(0);
  });

  it('places a concept strictly after its prerequisite', () => {
    const { nodes } = layoutGraph([concept('a'), concept('b')], [{ from: 'a', to: 'b' }]);
    expect(layerOf(nodes, 'b')).toBeGreaterThan(layerOf(nodes, 'a'));
  });

  it('uses the longest path, not the shortest, so nothing appears too early', () => {
    // a -> b -> c and a -> c: c must sit after b, not beside it.
    const { nodes } = layoutGraph(
      [concept('a'), concept('b'), concept('c')],
      [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' },
        { from: 'a', to: 'c' },
      ],
    );
    expect(layerOf(nodes, 'a')).toBe(0);
    expect(layerOf(nodes, 'b')).toBe(1);
    expect(layerOf(nodes, 'c')).toBe(2);
  });

  it('keeps independent roots in the same layer', () => {
    const { nodes } = layoutGraph([concept('a'), concept('b')], []);
    expect(layerOf(nodes, 'a')).toBe(layerOf(nodes, 'b'));
  });

  it('renders every node even when extraction produced a cycle', () => {
    // Agent 1's prerequisite extraction is heuristic; a cycle must not blank the canvas.
    const { nodes } = layoutGraph(
      [concept('a'), concept('b')],
      [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'a' },
      ],
    );
    expect(nodes).toHaveLength(2);
  });

  it('terminates on a self-loop and ignores it', () => {
    const { nodes } = layoutGraph([concept('a')], [{ from: 'a', to: 'a' }]);
    expect(layerOf(nodes, 'a')).toBe(0);
  });

  it('ignores edges pointing at concepts that are not in the set', () => {
    const { nodes } = layoutGraph([concept('a')], [{ from: 'ghost', to: 'a' }]);
    expect(layerOf(nodes, 'a')).toBe(0);
  });

  it('reports a canvas big enough to hold the nodes', () => {
    const { width, height } = layoutGraph(
      [concept('a'), concept('b'), concept('c')],
      [{ from: 'a', to: 'b' }],
    );
    expect(width).toBeGreaterThan(0);
    expect(height).toBeGreaterThan(0);
  });

  it('handles an empty graph without dividing by zero', () => {
    const { nodes, width, height } = layoutGraph([], []);
    expect(nodes).toEqual([]);
    expect(Number.isFinite(width)).toBe(true);
    expect(Number.isFinite(height)).toBe(true);
  });
});

describe('ConceptGraph', () => {
  const concepts = [concept('c-1', 'Limits'), concept('c-2', 'Derivatives')];
  const edges = [{ from: 'c-1', to: 'c-2' }];

  it('exposes the diagram to assistive technology with a label', () => {
    renderWithProviders(<ConceptGraph concepts={concepts} edges={edges} ariaLabel="Prerequisite graph" />);
    expect(screen.getByRole('group', { name: 'Prerequisite graph' })).toBeInTheDocument();
  });

  it('makes every node keyboard operable, not mouse-only (WCAG 2.1.1)', async () => {
    const onSelect = vi.fn();
    renderWithProviders(
      <ConceptGraph concepts={concepts} edges={edges} ariaLabel="Graph" onSelect={onSelect} />,
    );
    const node = screen.getByRole('button', { name: 'Limits' });
    node.focus();
    await userEvent.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith('c-1');
  });

  it('announces mastery in the node label so colour is never the only signal', () => {
    renderWithProviders(
      <ConceptGraph
        concepts={concepts}
        edges={edges}
        ariaLabel="Graph"
        masteryById={{ 'c-1': 0.42 }}
      />,
    );
    expect(screen.getByRole('button', { name: 'Limits, 42% mastery' })).toBeInTheDocument();
  });

  it('marks the selected node as pressed', () => {
    renderWithProviders(
      <ConceptGraph concepts={concepts} edges={edges} ariaLabel="Graph" selectedId="c-2" />,
    );
    expect(screen.getByRole('button', { name: 'Derivatives' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders a node per concept', () => {
    renderWithProviders(<ConceptGraph concepts={concepts} edges={edges} ariaLabel="Graph" />);
    expect(screen.getByText('Limits')).toBeInTheDocument();
    expect(screen.getByText('Derivatives')).toBeInTheDocument();
  });

  it('calls onSelect with the concept id when a node is activated', async () => {
    const onSelect = vi.fn();
    renderWithProviders(
      <ConceptGraph concepts={concepts} edges={edges} ariaLabel="Graph" onSelect={onSelect} />,
    );
    await userEvent.click(screen.getByText('Limits'));
    expect(onSelect).toHaveBeenCalledWith('c-1');
  });

  it('stays stable with no concepts', () => {
    renderWithProviders(<ConceptGraph concepts={[]} edges={[]} ariaLabel="Graph" />);
    expect(screen.getByRole('group', { name: 'Graph' })).toBeInTheDocument();
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});
