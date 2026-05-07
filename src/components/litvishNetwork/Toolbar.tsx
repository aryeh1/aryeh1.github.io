import { useState } from 'react';
import type { EdgeType } from '@/data/litvishNetwork';
import type { LayoutKind } from '@/utils/litvishNetwork/layout';

interface Props {
  layout: LayoutKind;
  onLayoutChange: (l: LayoutKind) => void;
  visibleEdgeTypes: Set<EdgeType>;
  onToggleEdgeType: (t: EdgeType) => void;
  onlyDescendantsOf: string | null;
  onClearDescendantFilter: () => void;
  rootName?: string;
  onExportPng: () => void;
  onExportSvg: () => void;
  onExportJson: () => void;
  onResetView: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

const LAYOUTS: { id: LayoutKind; label: string; hint: string }[] = [
  { id: 'tree', label: 'אילן יוחסין', hint: 'עץ דגרה — שורש: הסבא מסלבודקא' },
  { id: 'network', label: 'רשת', hint: 'טבעות לפי דור' },
  { id: 'generations', label: 'דורות', hint: 'שורות לפי דור' },
];

const EDGE_FILTERS: { id: EdgeType; label: string; chipColor: string }[] = [
  { id: 'parent',     label: 'הורות',     chipColor: '#6A6A6A' },
  { id: 'spouse',     label: 'נישואין',   chipColor: '#B0394A' },
  { id: 'inlaw',      label: 'חיתון',     chipColor: '#C9697A' },
  { id: 'teacher',    label: 'רב→תלמיד',  chipColor: '#4A4A4A' },
  { id: 'succession', label: 'ירושת תפקיד', chipColor: '#B58400' },
];

export function Toolbar({
  layout,
  onLayoutChange,
  visibleEdgeTypes,
  onToggleEdgeType,
  onlyDescendantsOf,
  onClearDescendantFilter,
  rootName,
  onExportPng,
  onExportSvg,
  onExportJson,
  onResetView,
  isDark,
  onToggleTheme,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div
      dir="rtl"
      lang="he"
      className="rounded-2xl bg-[var(--bg-card)] dark:bg-[var(--bg-dark-card)]
                 border border-[var(--border)] dark:border-[var(--border-dark)]
                 shadow-md backdrop-blur"
      style={{ fontFamily: "'Noto Serif Hebrew', Georgia, serif" }}
    >
      {/* Compact row — always visible */}
      <div className="flex items-center gap-2 p-2.5">
        <SegmentedControl<LayoutKind>
          options={LAYOUTS.map((l) => ({ value: l.id, label: l.label, title: l.hint }))}
          value={layout}
          onChange={onLayoutChange}
        />

        <div className="hidden md:block w-px h-6 bg-[var(--border)] dark:bg-[var(--border-dark)] mx-1" />

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] dark:border-[var(--border-dark)]
                     hover:bg-[var(--bg-alt)] dark:hover:bg-[var(--bg-dark-alt)]"
          aria-expanded={open}
        >
          {open ? 'הסתר אפשרויות' : 'אפשרויות'}
        </button>

        <button
          type="button"
          onClick={onResetView}
          className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] dark:border-[var(--border-dark)]
                     hover:bg-[var(--bg-alt)] dark:hover:bg-[var(--bg-dark-alt)]
                     hidden md:inline-block"
        >
          התאם לחלון
        </button>

        <div className="ms-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'מצב בהיר' : 'מצב כהה'}
            className="w-8 h-8 rounded-full border border-[var(--border)] dark:border-[var(--border-dark)]
                       hover:bg-[var(--bg-alt)] dark:hover:bg-[var(--bg-dark-alt)]
                       inline-flex items-center justify-center text-base"
          >
            {isDark ? '☀' : '☽'}
          </button>
        </div>
      </div>

      {/* Expanded options */}
      {open && (
        <div className="border-t border-[var(--border)] dark:border-[var(--border-dark)] p-3 space-y-3">
          {/* Edge filter chips */}
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] mb-1.5">
              סוגי קשרים
            </div>
            <div className="flex flex-wrap gap-1.5">
              {EDGE_FILTERS.map(({ id, label, chipColor }) => {
                const active = visibleEdgeTypes.has(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onToggleEdgeType(id)}
                    aria-pressed={active}
                    className={[
                      'text-[11px] px-2.5 py-1 rounded-full border transition-colors',
                      active
                        ? 'bg-[var(--bg-alt)] dark:bg-[var(--bg-dark-alt)] border-[var(--border)] dark:border-[var(--border-dark)]'
                        : 'bg-transparent text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] border-[var(--border)] dark:border-[var(--border-dark)] line-through',
                    ].join(' ')}
                  >
                    <span aria-hidden style={{ color: chipColor, marginInlineEnd: 4 }}>●</span>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Descendant filter */}
          {onlyDescendantsOf && (
            <div className="text-xs">
              <span className="text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">מסונן לצאצאים של: </span>
              <span className="font-medium">{rootName ?? onlyDescendantsOf}</span>
              <button
                type="button"
                onClick={onClearDescendantFilter}
                className="ms-2 text-[10px] underline decoration-dotted underline-offset-2"
              >
                בטל סינון
              </button>
            </div>
          )}

          {/* Export */}
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] mb-1.5">
              ייצוא
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button type="button" onClick={onExportPng} className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] dark:border-[var(--border-dark)] hover:bg-[var(--bg-alt)] dark:hover:bg-[var(--bg-dark-alt)]">PNG</button>
              <button type="button" onClick={onExportSvg} className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] dark:border-[var(--border-dark)] hover:bg-[var(--bg-alt)] dark:hover:bg-[var(--bg-dark-alt)]">SVG</button>
              <button type="button" onClick={onExportJson} className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] dark:border-[var(--border-dark)] hover:bg-[var(--bg-alt)] dark:hover:bg-[var(--bg-dark-alt)]">JSON</button>
              <button type="button" onClick={() => window.print()} className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] dark:border-[var(--border-dark)] hover:bg-[var(--bg-alt)] dark:hover:bg-[var(--bg-dark-alt)]">הדפסה / PDF</button>
            </div>
          </div>

          {/* Mobile only: re-fit button */}
          <button
            type="button"
            onClick={onResetView}
            className="md:hidden text-xs w-full px-3 py-1.5 rounded-full border border-[var(--border)] dark:border-[var(--border-dark)] hover:bg-[var(--bg-alt)] dark:hover:bg-[var(--bg-dark-alt)]"
          >
            התאם לחלון
          </button>
        </div>
      )}
    </div>
  );
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; title?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-[var(--border)] dark:border-[var(--border-dark)] p-0.5 text-xs">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            title={o.title}
            aria-pressed={active}
            className={[
              'px-3 py-1 rounded-full transition-colors',
              active
                ? 'bg-[var(--accent)] text-white dark:bg-[var(--accent-dark)]'
                : 'text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)] hover:bg-[var(--bg-alt)] dark:hover:bg-[var(--bg-dark-alt)]',
            ].join(' ')}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
