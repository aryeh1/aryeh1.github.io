import type { MarkerType } from '@xyflow/react';
import type { EdgeType } from '@/data/litvishNetwork';

/**
 * Visual styling per edge type, used by React Flow's built-in renderer
 * (we don't need a custom edge component for these — just stroke,
 * dasharray, marker, and color).
 */

export interface EdgeVisual {
  stroke: string;
  strokeDasharray?: string;
  strokeWidth: number;
  markerEnd?: { type: MarkerType; color?: string };
  label?: string;
  animated?: boolean;
}

/**
 * Static palette — themed via CSS-vars in the actual rendered SVG so
 * dark mode works without re-rendering the graph.
 */
export const EDGE_STYLE: Record<EdgeType, EdgeVisual> = {
  parent: {
    stroke: 'var(--edge-parent, #6A6A6A)',
    strokeWidth: 1.5,
    label: 'הורה→ילד',
  },
  spouse: {
    stroke: 'var(--edge-spouse, #B0394A)',
    strokeWidth: 2,
    strokeDasharray: '0 0',
    label: 'נישואין',
  },
  inlaw: {
    stroke: 'var(--edge-inlaw, #C9697A)',
    strokeWidth: 1.4,
    strokeDasharray: '6 4',
    label: 'חתן',
  },
  teacher: {
    stroke: 'var(--edge-teacher, #4A4A4A)',
    strokeWidth: 1.2,
    strokeDasharray: '2 4',
    label: 'רב→תלמיד',
  },
  succession: {
    stroke: 'var(--edge-succession, #B58400)',
    strokeWidth: 1.8,
    label: 'ירושת תפקיד',
  },
};

export function visibleStyle(type: EdgeType, faded = false, highlighted = false): React.CSSProperties {
  const v = EDGE_STYLE[type];
  return {
    stroke: highlighted ? 'var(--accent, #8B2635)' : v.stroke,
    strokeWidth: highlighted ? v.strokeWidth + 1 : v.strokeWidth,
    strokeDasharray: v.strokeDasharray,
    opacity: faded ? 0.15 : 1,
  };
}
