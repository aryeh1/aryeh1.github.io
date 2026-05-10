import dagre from 'dagre';
import type { Node, Edge } from '@xyflow/react';
import { Position } from '@xyflow/react';
import type { Person, RelationshipEdge } from '@/data/litvishNetwork';

/**
 * Layout algorithms for the relationship graph.
 *
 * We compute positions in plain {x,y} coordinates and pass them to
 * React Flow. Layout is deterministic (no animated force step), so
 * the graph looks identical on every visit and prints cleanly.
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
 * Tree layout: Dagre TB (top→bottom). Only directed structural edges
 * (parent + inlaw + succession) drive rank assignment; teacher and
 * spouse edges are added back as cross-links AFTER positioning.
 *
 * We also pin source/target handles so edges look clean: top-down
 * for parent/inlaw/succession, side handles for spouse/teacher.
 */
export function treeLayout(
  people: Person[],
  edges: RelationshipEdge[],
  rfNodes: Node[],
  rfEdges: Edge[],
): LaidOutGraph {
  const g = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', nodesep: 38, ranksep: 90, marginx: 32, marginy: 32, ranker: 'tight-tree' });

  for (const p of people) {
    const { w, h } = nodeSize(p);
    g.setNode(p.id, { width: w, height: h });
  }

  for (const e of edges) {
    if (e.type === 'parent' || e.type === 'inlaw' || e.type === 'succession') {
      g.setEdge(e.source, e.target);
    }
  }

  dagre.layout(g);

  const positioned: Node[] = rfNodes.map((n) => {
    const pos = g.node(n.id);
    if (!pos) return { ...n, sourcePosition: Position.Bottom, targetPosition: Position.Top };
    const data = n.data as { person?: Person };
    const sz = data?.person ? nodeSize(data.person) : { w: NODE_W, h: NODE_H };
    return {
      ...n,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      position: { x: pos.x - sz.w / 2, y: pos.y - sz.h / 2 },
    };
  });

  // Tag each edge with the right handle pair so React Flow draws clean L-shapes.
  const typedEdges: Edge[] = rfEdges.map((e) => {
    const t = (e.data as { relType?: string } | undefined)?.relType;
    if (t === 'spouse' || t === 'teacher') {
      return { ...e, sourceHandle: 'l', targetHandle: 'r', type: 'default' };
    }
    return { ...e, sourceHandle: 'b', targetHandle: 't', type: 'smoothstep' };
  });

  return { nodes: positioned, edges: typedEdges };
}

/**
 * Generations layout: stacked horizontally by generation, sorted
 * within each row by parent x-position so descendants stay aligned
 * under their parents.
 */
export function generationsLayout(
  people: Person[],
  edges: RelationshipEdge[],
  rfNodes: Node[],
  rfEdges: Edge[],
): LaidOutGraph {
  const ROW_GAP = 180;
  const COL_GAP = 220;

  const byGen = new Map<number, Person[]>();
  for (const p of people) {
    const gen = p.generation ?? 99;
    if (!byGen.has(gen)) byGen.set(gen, []);
    byGen.get(gen)!.push(p);
  }

  // For better alignment, sort each row by the average x of its parents
  // in the previous row (if available).
  const positions = new Map<string, { x: number; y: number }>();
  const sortedGens = [...byGen.keys()].sort((a, b) => a - b);

  const parentMap = new Map<string, string[]>();
  for (const e of edges) {
    if (e.type === 'parent' || e.type === 'inlaw') {
      if (!parentMap.has(e.target)) parentMap.set(e.target, []);
      parentMap.get(e.target)!.push(e.source);
    }
  }

  for (const gen of sortedGens) {
    const row = byGen.get(gen)!;
    row.sort((a, b) => {
      const pa = (parentMap.get(a.id) ?? []).map((p) => positions.get(p)?.x ?? 0);
      const pb = (parentMap.get(b.id) ?? []).map((p) => positions.get(p)?.x ?? 0);
      const avgA = pa.length ? pa.reduce((s, v) => s + v, 0) / pa.length : 0;
      const avgB = pb.length ? pb.reduce((s, v) => s + v, 0) / pb.length : 0;
      return avgA - avgB;
    });
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
    if (!pos) return { ...n, sourcePosition: Position.Bottom, targetPosition: Position.Top };
    return {
      ...n,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      position: pos,
    };
  });

  return { nodes: positioned, edges: rfEdges.map((e) => ({ ...e, sourceHandle: 'b', targetHandle: 't', type: 'default' })) };
}

/**
 * Network layout: radial rings by generation, with the root (Sabba)
 * at the center. Angles are distributed by id-hash so the layout is
 * stable.
 */
export function networkLayout(
  people: Person[],
  rfNodes: Node[],
  rfEdges: Edge[],
  rootId = 'sabba-slabodka',
): LaidOutGraph {
  const RING_GAP = 320;

  const positions = new Map<string, { x: number; y: number }>();
  const byGen = new Map<number, Person[]>();
  for (const p of people) {
    const gen = p.generation ?? 5;
    if (!byGen.has(gen)) byGen.set(gen, []);
    byGen.get(gen)!.push(p);
  }

  for (const [gen, row] of byGen.entries()) {
    if (gen <= 0 && row.find((p) => p.id === rootId)) {
      positions.set(rootId, { x: 0, y: 0 });
      const others = row.filter((p) => p.id !== rootId);
      // small inner ring for parallels (gen <= 0 but not root)
      others.forEach((p, i) => {
        const angle = (i / Math.max(1, others.length)) * 2 * Math.PI;
        positions.set(p.id, { x: Math.cos(angle) * 160, y: Math.sin(angle) * 160 });
      });
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
    const data = n.data as { person?: Person };
    const sz = data?.person ? nodeSize(data.person) : { w: NODE_W, h: NODE_H };
    if (!pos) return n;
    return {
      ...n,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      position: { x: pos.x - sz.w / 2, y: pos.y - sz.h / 2 },
    };
  });

  return { nodes: positioned, edges: rfEdges.map((e) => ({ ...e, sourceHandle: undefined, targetHandle: undefined, type: 'default' })) };
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
      return generationsLayout(people, edges, rfNodes, rfEdges);
    case 'network':
    default:
      return networkLayout(people, rfNodes, rfEdges);
  }
}
