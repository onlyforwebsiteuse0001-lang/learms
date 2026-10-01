import { useMemo } from 'react';
import type { Concept } from '../../api/types';

export interface GraphEdge {
  from: string; // prerequisite concept_id
  to: string; // dependent concept_id
}

interface ConceptGraphProps {
  concepts: Concept[];
  edges: GraphEdge[];
  selectedId?: string | null;
  masteryById?: Record<string, number>;
  onSelect?: (conceptId: string) => void;
  ariaLabel: string;
}

interface PositionedNode {
  concept: Concept;
  x: number;
  y: number;
  layer: number;
}

const NODE_W = 150;
const NODE_H = 46;
const GAP_X = 52;
const GAP_Y = 34;
const PAD = 18;

/**
 * Layered (Sugiyama-style) DAG layout — no physics simulation, no D3.
 *
 * A prerequisite graph is a DAG with a meaningful reading order, so a force-directed
 * layout is actively wrong here: it scatters nodes and hides the very thing the student
 * needs to see, which is "what must come before what". Longest-path layering puts every
 * concept strictly after all of its prerequisites, and layer index doubles as study order.
 *
 * Cycles cannot be assumed away — Agent 1's extraction is heuristic and may emit one. The
 * algorithm is cycle-tolerant: any node not resolved within `concepts.length` passes is
 * placed in a final layer rather than looping forever.
 */
export function layoutGraph(concepts: Concept[], edges: GraphEdge[]): { nodes: PositionedNode[]; width: number; height: number } {
  const ids = new Set(concepts.map((concept) => concept.concept_id));
  const prerequisitesOf = new Map<string, string[]>();
  for (const id of ids) prerequisitesOf.set(id, []);
  for (const edge of edges) {
    if (ids.has(edge.from) && ids.has(edge.to) && edge.from !== edge.to) {
      prerequisitesOf.get(edge.to)!.push(edge.from);
    }
  }

  const layerOf = new Map<string, number>();
  let changed = true;
  let guard = 0;
  while (changed && guard <= concepts.length) {
    changed = false;
    guard += 1;
    for (const concept of concepts) {
      const parents = prerequisitesOf.get(concept.concept_id) ?? [];
      const resolved = parents.filter((parent) => layerOf.has(parent));
      // A node is placeable once every prerequisite has a layer.
      if (resolved.length === parents.length) {
        const next = parents.length === 0 ? 0 : Math.max(...parents.map((p) => layerOf.get(p)!)) + 1;
        if (layerOf.get(concept.concept_id) !== next) {
          layerOf.set(concept.concept_id, next);
          changed = true;
        }
      }
    }
  }

  // Anything still unplaced sits in a cycle; park it after everything else so the graph
  // still renders and the student can see the nodes rather than getting a blank canvas.
  const maxLayer = layerOf.size ? Math.max(...layerOf.values()) : 0;
  for (const concept of concepts) {
    if (!layerOf.has(concept.concept_id)) layerOf.set(concept.concept_id, maxLayer + 1);
  }

  const byLayer = new Map<number, Concept[]>();
  for (const concept of concepts) {
    const layer = layerOf.get(concept.concept_id)!;
    if (!byLayer.has(layer)) byLayer.set(layer, []);
    byLayer.get(layer)!.push(concept);
  }
  for (const list of byLayer.values()) list.sort((a, b) => a.name.localeCompare(b.name));

  const layers = [...byLayer.keys()].sort((a, b) => a - b);
  const tallest = Math.max(1, ...layers.map((layer) => byLayer.get(layer)!.length));

  const nodes: PositionedNode[] = [];
  layers.forEach((layer, columnIndex) => {
    const column = byLayer.get(layer)!;
    const columnHeight = column.length * NODE_H + (column.length - 1) * GAP_Y;
    const totalHeight = tallest * NODE_H + (tallest - 1) * GAP_Y;
    const offsetY = (totalHeight - columnHeight) / 2;
    column.forEach((concept, rowIndex) => {
      nodes.push({
        concept,
        layer,
        x: PAD + columnIndex * (NODE_W + GAP_X),
        y: PAD + offsetY + rowIndex * (NODE_H + GAP_Y),
      });
    });
  });

  return {
    nodes,
    width: PAD * 2 + Math.max(1, layers.length) * NODE_W + Math.max(0, layers.length - 1) * GAP_X,
    height: PAD * 2 + tallest * NODE_H + (tallest - 1) * GAP_Y,
  };
}

function masteryStroke(value: number | undefined): string {
  if (value === undefined) return 'var(--line-300)';
  if (value < 0.2) return 'var(--mastery-0)';
  if (value < 0.4) return 'var(--mastery-1)';
  if (value < 0.6) return 'var(--mastery-2)';
  if (value < 0.8) return 'var(--mastery-3)';
  return 'var(--mastery-4)';
}

export function ConceptGraph({
  concepts,
  edges,
  selectedId,
  masteryById = {},
  onSelect,
  ariaLabel,
}: ConceptGraphProps) {
  const { nodes, width, height } = useMemo(() => layoutGraph(concepts, edges), [concepts, edges]);
  const positionById = useMemo(() => new Map(nodes.map((node) => [node.concept.concept_id, node])), [nodes]);

  return (
    <div style={{ overflowX: 'auto', overflowY: 'hidden' }} className="chart-plot">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        role="group"
        aria-label={ariaLabel}
        style={{ maxInlineSize: 'none', display: 'block' }}
      >
        <defs>
          <marker id="cg-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill="var(--ink-400)" />
          </marker>
        </defs>

        {edges.map((edge) => {
          const from = positionById.get(edge.from);
          const to = positionById.get(edge.to);
          if (!from || !to) return null;
          const x1 = from.x + NODE_W;
          const y1 = from.y + NODE_H / 2;
          const x2 = to.x;
          const y2 = to.y + NODE_H / 2;
          const midX = (x1 + x2) / 2;
          const highlighted = selectedId === edge.from || selectedId === edge.to;
          return (
            <path
              key={`${edge.from}->${edge.to}`}
              d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
              fill="none"
              stroke={highlighted ? 'var(--brand-500)' : 'var(--line-300)'}
              strokeWidth={highlighted ? 2 : 1.2}
              markerEnd="url(#cg-arrow)"
            />
          );
        })}

        {nodes.map((node) => {
          const selected = selectedId === node.concept.concept_id;
          const mastery = masteryById[node.concept.concept_id];
          const label =
            mastery === undefined
              ? node.concept.name
              : `${node.concept.name}, ${Math.round(mastery * 100)}% mastery`;
          return (
            <g
              key={node.concept.concept_id}
              transform={`translate(${node.x}, ${node.y})`}
              role="button"
              tabIndex={0}
              aria-label={label}
              aria-pressed={selected}
              style={{ cursor: onSelect ? 'pointer' : 'default' }}
              onClick={() => onSelect?.(node.concept.concept_id)}
              onKeyDown={(event) => {
                // 2.1.1 Keyboard: SVG groups are not natively operable, so Enter/Space
                // are wired explicitly rather than leaving the graph mouse-only.
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect?.(node.concept.concept_id);
                }
              }}
            >
              <rect
                width={NODE_W}
                height={NODE_H}
                rx="9"
                fill={selected ? 'var(--brand-050)' : 'var(--surface)'}
                stroke={selected ? 'var(--brand-500)' : masteryStroke(mastery)}
                strokeWidth={selected ? 2.5 : 1.5}
              />
              <text
                x={NODE_W / 2}
                y={mastery === undefined ? NODE_H / 2 + 4 : NODE_H / 2 - 2}
                textAnchor="middle"
                fontSize="11.5"
                fontWeight="600"
                fill="var(--ink-900)"
              >
                {node.concept.name.length > 20 ? `${node.concept.name.slice(0, 19)}…` : node.concept.name}
              </text>
              {mastery !== undefined && (
                <text x={NODE_W / 2} y={NODE_H / 2 + 13} textAnchor="middle" fontSize="10" fill="var(--ink-400)">
                  {Math.round(mastery * 100)}%
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
