import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useDarkMode } from '@/hooks/useDarkMode';
import {
  people,
  edges as relEdges,
  yeshivot,
  boards,
  type EdgeType,
} from '@/data/litvishNetwork';
import { layout, type LayoutKind } from '@/utils/litvishNetwork/layout';
import { exportPng, exportSvg, exportJson } from '@/utils/litvishNetwork/export';
import { PersonNode, type PersonNodeData } from '@/components/litvishNetwork/PersonNode';
import { EDGE_STYLE } from '@/components/litvishNetwork/edgeStyles';
import { SearchBar } from '@/components/litvishNetwork/SearchBar';
import { Toolbar } from '@/components/litvishNetwork/Toolbar';
import { DetailsPanel } from '@/components/litvishNetwork/DetailsPanel';

const nodeTypes = { person: PersonNode } as const;

const ALL_EDGE_TYPES: EdgeType[] = ['parent', 'spouse', 'inlaw', 'teacher', 'succession'];

/**
 * Page-local CSS:
 *   1. Reset the global `h1/h2/h3` size overrides for this page only —
 *      Tailwind v4 puts utilities in @layer utilities, and unlayered
 *      global element selectors win, so without this all headings
 *      explode to 2.5rem.
 *   2. Edge colors as CSS variables so dark mode flips them without
 *      re-rendering the graph.
 */
const PAGE_VARS = `
.litvish-page h1, .litvish-page h2, .litvish-page h3, .litvish-page h4 {
  all: unset;
  display: block;
}
:root {
  --edge-parent: #6A6A6A;
  --edge-spouse: #B0394A;
  --edge-inlaw: #C9697A;
  --edge-teacher: #4A4A4A;
  --edge-succession: #B58400;
}
.dark {
  --edge-parent: #B0B0B0;
  --edge-spouse: #E27485;
  --edge-inlaw: #E89DAB;
  --edge-teacher: #B5B5B5;
  --edge-succession: #E0B85C;
}
`;

interface State {
  selectedId: string | null;
  matchedIds: Set<string>;
  layoutKind: LayoutKind;
  visibleEdgeTypes: Set<EdgeType>;
  onlyDescendantsOf: string | null;
}

function PageInner() {
  const { isDark, toggleTheme } = useDarkMode();
  const reactFlow = useReactFlow();

  const peopleById = useMemo(() => new Map(people.map((p) => [p.id, p])), []);
  const yeshivotById = useMemo(() => new Map(yeshivot.map((y) => [y.id, y])), []);
  const boardsById = useMemo(() => new Map(boards.map((b) => [b.id, b])), []);
  const yeshivaShortById = useMemo(() => new Map(yeshivot.map((y) => [y.id, y.shortName ?? y.name])), []);

  const [state, setState] = useState<State>({
    selectedId: null,
    matchedIds: new Set(),
    layoutKind: 'tree',
    visibleEdgeTypes: new Set(ALL_EDGE_TYPES),
    onlyDescendantsOf: null,
  });

  const visibleIds = useMemo<Set<string> | null>(() => {
    if (!state.onlyDescendantsOf) return null;
    const seen = new Set<string>([state.onlyDescendantsOf]);
    const queue = [state.onlyDescendantsOf];
    while (queue.length) {
      const cur = queue.shift()!;
      for (const e of relEdges) {
        if (e.source === cur && (e.type === 'parent' || e.type === 'inlaw' || e.type === 'spouse')) {
          if (!seen.has(e.target)) { seen.add(e.target); queue.push(e.target); }
        }
      }
    }
    return seen;
  }, [state.onlyDescendantsOf]);

  const baseNodes: Node[] = useMemo(() => {
    return people.map((p) => {
      const yeshivaLabels = (p.roles ?? []).slice(0, 2).map((r) => yeshivaShortById.get(r.yeshivaId) ?? '');
      const data: PersonNodeData = { person: p, yeshivaLabels };
      return {
        id: p.id,
        type: 'person',
        data: data as unknown as Record<string, unknown>,
        position: { x: 0, y: 0 },
        draggable: false,
        selectable: true,
      };
    });
  }, [yeshivaShortById]);

  const baseEdges: Edge[] = useMemo(() => {
    return relEdges.map((e) => {
      const v = EDGE_STYLE[e.type];
      return {
        id: e.id,
        source: e.source,
        target: e.target,
        type: 'default',
        style: {
          stroke: v.stroke,
          strokeWidth: v.strokeWidth,
          strokeDasharray: v.strokeDasharray,
          opacity: e.uncertain ? 0.55 : 1,
        },
        data: { relType: e.type, note: e.note },
        zIndex: e.type === 'spouse' || e.type === 'succession' ? 1 : 0,
      } satisfies Edge;
    });
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(baseNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(baseEdges);

  /**
   * Re-run layout on layoutKind / descendant-filter change.
   */
  useEffect(() => {
    const peopleSubset = visibleIds ? people.filter((p) => visibleIds.has(p.id)) : people;
    const edgesSubset = visibleIds
      ? relEdges.filter((e) => visibleIds.has(e.source) && visibleIds.has(e.target))
      : relEdges;

    const idsInSubset = new Set(peopleSubset.map((p) => p.id));
    const rfNodesSubset = baseNodes.filter((n) => idsInSubset.has(n.id));
    const rfEdgesSubset = baseEdges.filter((e) => idsInSubset.has(e.source) && idsInSubset.has(e.target));

    const laid = layout(state.layoutKind, peopleSubset, edgesSubset, rfNodesSubset, rfEdgesSubset);
    setNodes(laid.nodes);
    setEdges(laid.edges);
    const t = setTimeout(() => reactFlow.fitView({ padding: 0.15, duration: 300 }), 60);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.layoutKind, visibleIds, baseNodes, baseEdges]);

  /**
   * Selection / search highlight overlay.
   */
  useEffect(() => {
    const sel = state.selectedId;
    const matched = state.matchedIds;
    const hasFilter = !!sel || matched.size > 0;

    const connectedIds = new Set<string>();
    if (sel) {
      connectedIds.add(sel);
      for (const e of relEdges) {
        if (e.source === sel) connectedIds.add(e.target);
        if (e.target === sel) connectedIds.add(e.source);
      }
    }

    setNodes((prev) =>
      prev.map((n) => {
        const isSel = n.id === sel;
        const isMatched = matched.has(n.id);
        const isConnected = connectedIds.has(n.id);
        const faded = hasFilter && !isSel && !isMatched && !isConnected;
        const data = n.data as unknown as PersonNodeData;
        return {
          ...n,
          data: {
            ...data,
            selected: isSel,
            faded,
            matched: isMatched,
          } as unknown as Record<string, unknown>,
          selected: isSel,
        };
      }),
    );

    setEdges((prev) =>
      prev.map((e) => {
        const involves = sel && (e.source === sel || e.target === sel);
        const visible = state.visibleEdgeTypes.has((e.data?.relType as EdgeType) ?? 'parent');
        const baseV = EDGE_STYLE[(e.data?.relType as EdgeType) ?? 'parent'];
        return {
          ...e,
          hidden: !visible,
          animated: false,
          style: {
            stroke: involves ? 'var(--accent)' : baseV.stroke,
            strokeWidth: involves ? baseV.strokeWidth + 1.2 : baseV.strokeWidth,
            strokeDasharray: baseV.strokeDasharray,
            opacity: hasFilter && !involves ? 0.18 : 1,
          },
        };
      }),
    );
  }, [state.selectedId, state.matchedIds, state.visibleEdgeTypes, setNodes, setEdges]);

  const centerOnNode = useCallback((id: string) => {
    const node = nodes.find((nn) => nn.id === id);
    if (!node) return;
    const w = window.innerWidth;
    const z = w < 600 ? 1.0 : 1.25;
    setTimeout(() => reactFlow.setCenter(node.position.x + 100, node.position.y + 50, { zoom: z, duration: 350 }), 30);
  }, [nodes, reactFlow]);

  const handleNodeClick: NodeMouseHandler = useCallback((_e, n) => {
    setState((s) => ({ ...s, selectedId: n.id }));
    centerOnNode(n.id);
  }, [centerOnNode]);

  const handlePaneClick = useCallback(() => {
    setState((s) => ({ ...s, selectedId: null }));
  }, []);

  const handleSelectFromSearch = useCallback((id: string) => {
    setState((s) => ({ ...s, selectedId: id }));
    centerOnNode(id);
  }, [centerOnNode]);

  const toggleEdgeType = useCallback((t: EdgeType) => {
    setState((s) => {
      const next = new Set(s.visibleEdgeTypes);
      if (next.has(t)) next.delete(t); else next.add(t);
      return { ...s, visibleEdgeTypes: next };
    });
  }, []);

  const setLayoutKind = useCallback((l: LayoutKind) => {
    setState((s) => ({ ...s, layoutKind: l }));
  }, []);

  const setMatchedIds = useCallback((ids: Set<string>) => {
    setState((s) => ({ ...s, matchedIds: ids }));
  }, []);

  const filterToDescendantsOf = useCallback((id: string) => {
    setState((s) => ({ ...s, onlyDescendantsOf: id }));
  }, []);

  const clearDescendantFilter = useCallback(() => {
    setState((s) => ({ ...s, onlyDescendantsOf: null }));
  }, []);

  const resetView = useCallback(() => {
    reactFlow.fitView({ padding: 0.15, duration: 350 });
  }, [reactFlow]);

  const selectedPerson = state.selectedId ? peopleById.get(state.selectedId) ?? null : null;
  const rootForFilter = state.onlyDescendantsOf ? peopleById.get(state.onlyDescendantsOf) ?? null : null;

  return (
    <div className="litvish-page fixed inset-0 bg-[var(--bg-primary)] dark:bg-[var(--bg-dark)] text-[var(--text-primary)] dark:text-[var(--text-dark)]">
      <style>{PAGE_VARS}</style>

      {/* Canvas — fills the entire viewport. Strictly LTR for xyflow #3116. */}
      <div className="absolute inset-0" style={{ direction: 'ltr' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          proOptions={{ hideAttribution: true }}
          minZoom={0.15}
          maxZoom={3}
          panOnDrag
          zoomOnPinch
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable
        >
          <Background gap={28} size={1} color={isDark ? '#2E2E2E' : '#E4DFD4'} />
          <Controls position="bottom-right" showInteractive={false} className="!shadow-md" />
          <MiniMap
            position="top-left"
            pannable
            zoomable
            ariaLabel="מפת ניווט"
            nodeColor={(n) => {
              const data = n.data as unknown as PersonNodeData;
              if (data?.person?.marquee) return isDark ? '#C4424F' : '#8B2635';
              return isDark ? '#3A3A3A' : '#B0AAA0';
            }}
            maskColor={isDark ? 'rgba(20,20,20,0.65)' : 'rgba(247,245,240,0.7)'}
            className="!hidden md:!block !bg-[var(--bg-card)] dark:!bg-[var(--bg-dark-card)] !w-[180px] !h-[120px]"
          />
        </ReactFlow>
      </div>

      {/* Top floating header — single compact row */}
      <header
        dir="rtl"
        lang="he"
        className="absolute top-0 inset-x-0 z-20 px-3 md:px-4 pt-3 pb-2
                   pointer-events-none"
      >
        <div className="max-w-[1400px] mx-auto flex items-center gap-2 pointer-events-auto">
          {/* Title chip */}
          <div
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full
                       bg-[var(--bg-card)]/95 dark:bg-[var(--bg-dark-card)]/95
                       border border-[var(--border)] dark:border-[var(--border-dark)]
                       shadow-sm backdrop-blur whitespace-nowrap"
            style={{ fontFamily: "'Noto Serif Hebrew', Georgia, serif" }}
          >
            <span className="text-[13px] font-medium">רשת הליטאיות</span>
            <span className="w-1 h-1 rounded-full bg-[var(--accent)] dark:bg-[var(--accent-dark)]" />
            <span className="text-[11px] text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
              מסלבודקא לתשפ"ו
            </span>
          </div>

          <div className="flex-1 min-w-0 max-w-[480px]">
            <SearchBar people={people} onSelect={handleSelectFromSearch} onMatchedChange={setMatchedIds} />
          </div>

          <Toolbar
            layout={state.layoutKind}
            onLayoutChange={setLayoutKind}
            visibleEdgeTypes={state.visibleEdgeTypes}
            onToggleEdgeType={toggleEdgeType}
            onlyDescendantsOf={state.onlyDescendantsOf}
            onClearDescendantFilter={clearDescendantFilter}
            rootName={rootForFilter?.name}
            onExportPng={() => exportPng()}
            onExportSvg={() => exportSvg()}
            onExportJson={() => exportJson(people, relEdges)}
            onResetView={resetView}
            isDark={isDark}
            onToggleTheme={toggleTheme}
          />
        </div>
      </header>

      {/* Floating CTA when a person is selected — "show only descendants" */}
      {selectedPerson && state.onlyDescendantsOf !== selectedPerson.id && (
        <button
          type="button"
          dir="rtl"
          onClick={() => filterToDescendantsOf(selectedPerson.id)}
          className="absolute bottom-4 left-4 z-20 text-[12px] px-3 py-1.5 rounded-full
                     bg-[var(--accent)] text-white dark:bg-[var(--accent-dark)]
                     shadow-md hover:opacity-90 transition-opacity"
          style={{ fontFamily: "'Noto Serif Hebrew', Georgia, serif" }}
        >
          ⤳ צאצאי {selectedPerson.nickname ?? selectedPerson.name.split(' ').slice(-2).join(' ')}
        </button>
      )}

      {/* Details panel — bottom drawer on mobile, left sidebar on desktop */}
      <DetailsPanel
        person={selectedPerson}
        edges={relEdges}
        peopleById={peopleById}
        yeshivotById={yeshivotById}
        boardsById={boardsById}
        onSelect={handleSelectFromSearch}
        onClose={() => setState((s) => ({ ...s, selectedId: null }))}
      />
    </div>
  );
}

/**
 * Outer wrapper supplies the ReactFlowProvider context.
 */
export function LitvishNetwork() {
  return (
    <ReactFlowProvider>
      <PageInner />
    </ReactFlowProvider>
  );
}
