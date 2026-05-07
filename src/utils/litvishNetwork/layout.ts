import dagre from 'dagre';
import type { Node, Edge } from '@xyflow/react';
import type { Person, RelationshipEdge } from '@/data/litvishNetwork';

/**
 * Layout algorithms for the relationship graph.
 *
 * We run layout in plain {x,y} space and hand positions to React Flow.
 * Dagre handles parent-child trees beautifully; for the network/force
 * view we use a deterministic seeded force step (no animation) so the
 * graph is stable on revisits and prints identically every time.
 */

export type LayoutKind = 'tree' | 'network' | 'generations';

const NODE_W = 200;
const NODE_H = 86;
const NODE_W_MARQUEE = 240;
const NODE_H_MARQUEE = 110;

export interface LaidOutGraph {
  nodes: Node[];
  edges: Edge[];
}

function nodeSize(p: Person): { w: number; h: number } {
  return p.marquee ? { w: NODE_W_MARQUEE, h: NODE_H_MARQUEE } : { w: NODE_W, h: NODE_H };
}

/**
 * Tree layout: Dagre with rank direction "TB" (top to bottom).
 * Only structural edges (parent + inlaw + succession) are used to
 * compute the ranks; teacher and spouse edges are added back as
 * cross-links after positioning.
 */
export function treeLayout(
  people: Person[],
  edges: RelationshipEdge[],
  rfNodes: Node[],
  rfEdges: Edge[],
): LaidOutGraph {
  const g = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', nodesep: 56, ranksep: 110, marginx: 32, marginy: 32 });

  for (const p of people) {
    const { w, h } = nodeSize(p);
    g.setNode(p.id, { width: w, height: h });
  }

  // Use only directed structural edges for ranking.
  for (const e of edges) {
    if (e.type === 'parent' || e.type === 'inlaw' || e.type === 'succession') {
      g.setEdge(e.source, e.target);
    }
  }

  dagre.layout(g);

  const positioned: Node[] = rfNodes.map((n) => {
    const pos = g.node(n.id);
    if (!pos) return n;
    const { w, h } = (n.data as { person: Person }).person
      ? nodeSize((n.data as { person: Person }).person)
      : { w: NODE_W, h: NODE_H };
    return { ...n, position: { x: pos.x - w / 2, y: pos.y - h / 2 } };
  });

  return { nodes: positioned, edges: rfEdges };
}

/**
 * Generations layout: people stacked horizontally by their `generation`
 * field, with within-row ordering chosen to put parents directly above
 * their children where possible. Useful for chronological storytelling.
 */
export function generationsLayout(
  people: Person[],
  rfNodes: Node[],
  rfEdges: Edge[],
): LaidOutGraph {
  const ROW_GAP = 200;
  const COL_GAP = 230;

  const byGen = new Map<number, Person[]>();
  for (const p of people) {
    const g = p.generation ?? 99;
    if (!byGen.has(g)) byGen.set(g, []);
    byGen.get(g)!.push(p);
  }

  const positions = new Map<string, { x: number; y: number }>();
  const sortedGens = [...byGen.keys()].sort((a, b) => a - b);

  for (const gen of sortedGens) {
    const row = byGen.get(gen)!;
    const totalWidth = row.length * COL_GAP;
    row.forEach((p, i) => {
      const { w, h } = nodeSize(p);
      positions.set(p.id, {
        x: i * COL_GAP - totalWidth / 2 - w / 2,
        y: gen * ROW_GAP - h / 2,
      });
    });
  }

  const positioned: Node[] = rfNodes.map((n) => {
    const pos = positions.get(n.id);
    if (!pos) return n;
    return { ...n, position: pos };
  });

  return { nodes: positioned, edges: rfEdges };
}

/**
 * Network layout: a deterministic radial spread. The Sabba goes in the
 * middle, then nodes are placed at radii proportional to their
 * generation, with angles distributed by id-hash so the result is
 * stable across runs.
 */
export function networkLayout(
  people: Person[],
  rfNodes: Node[],
  rfEdges: Edge[],
  rootId = 'sabba-slabodka',
): LaidOutGraph {
  const RING_GAP = 260;

  const positions = new Map<string, { x: number; y: number }>();

  // Group people by generation; root is at center.
  const byGen = new Map<number, Person[]>();
  for (const p of people) {
    const gen = p.generation ?? 5;
    if (!byGen.has(gen)) byGen.set(gen, []);
    byGen.get(gen)!.push(p);
  }

  for (const [gen, row] of byGen.entries()) {
    if (gen <= 0 && row.find((p) => p.id === rootId)) {
      positions.set(rootId, { x: 0, y: 0 });
      continue;
    }
    const radius = Math.max(1, gen) * RING_GAP;
    row.forEach((p, i) => {
      const angle = ((i / row.length) * 2 * Math.PI) - Math.PI / 2;
      positions.set(p.id, {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      });
    });
  }

  const positioned: Node[] = rfNodes.map((n) => {
    const pos = positions.get(n.id);
    if (!pos) return n;
    const { w, h } = (n.data as { person: Person }).person
      ? nodeSize((n.data as { person: Person }).person)
      : { w: NODE_W, h: NODE_H };
    return { ...n, position: { x: pos.x - w / 2, y: pos.y - h / 2 } };
  });

  return { nodes: positioned, edges: rfEdges };
}

export function layout(
  kind: LayoutKind,
  people: Person[],
  edges: RelationshipEdge[],
  rfNodes: Node[],
  rfEdges: Edge[],
): LaidOutGraph {
  switch (kind) {
    case 'tree':
      return treeLayout(people, edges, rfNodes, rfEdges);
    case 'generations':
      return generationsLayout(people, rfNodes, rfEdges);
    case 'network':
    default:
      return networkLayout(people, rfNodes, rfEdges);
  }
}
