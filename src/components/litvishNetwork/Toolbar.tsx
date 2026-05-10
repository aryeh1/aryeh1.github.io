import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  { id: 'tree', label: 'אילן', hint: 'אילן יוחסין — שורש: הסבא מסלבודקא' },
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

/**
 * Floating, compact, popover-based toolbar.
 * - Always-visible chip row: layout segmented control + tools button.
 * - Popover (on click) shows: edge-type filters, exports, theme,
 *   reset, descendant-filter status.
 */
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
    <div dir="rtl" lang="he" className="relative inline-flex items-center gap-1.5"
         style={{ fontFamily: "'Noto Serif Hebrew', Georgia, serif" }}>
      <SegmentedControl<LayoutKind>
        options={LAYOUTS.map((l) => ({ value: l.id, label: l.label, title: l.hint }))}
        value={layout}
        onChange={onLayoutChange}
      />

      <IconBtn onClick={onResetView} aria-label="התאם לחלון" title="התאם לחלון">⤢</IconBtn>
      <IconBtn onClick={onToggleTheme} aria-label={isDark ? 'מצב בהיר' : 'מצב כהה'} title={isDark ? 'מצב בהיר' : 'מצב כהה'}>{isDark ? '☀' : '☾'}</IconBtn>
      <IconBtn onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="כלים" title="כלים נוספים">⚙</IconBtn>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-[calc(100%+8px)] z-50 w-[260px]
                       rounded-xl bg-[var(--bg-card)] dark:bg-[var(--bg-dark-card)]
                       border border-[var(--border)] dark:border-[var(--border-dark)]
                       shadow-xl p-3 space-y-3 text-[12px]"
          >
            {/* Descendant filter status */}
            {onlyDescendantsOf && (
              <div className="text-[11.5px] rounded-md p-2 bg-[var(--bg-alt)] dark:bg-[var(--bg-dark-alt)]">
                <div className="text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] text-[10px] mb-0.5">סינון:</div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium truncate">צאצאי {rootName ?? onlyDescendantsOf}</span>
                  <button
                    type="button"
                    onClick={onClearDescendantFilter}
                    className="text-[10px] underline decoration-dotted underline-offset-2 whitespace-nowrap"
                  >
                    בטל
                  </button>
                </div>
              </div>
            )}

            {/* Edge type filter chips */}
            <div>
              <div className="text-[10px] uppercase tracking-[0.06em] text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] mb-1.5">
                סוגי קשרים
              </div>
              <div className="flex flex-wrap gap-1">
                {EDGE_FILTERS.map(({ id, label, chipColor }) => {
                  const active = visibleEdgeTypes.has(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onToggleEdgeType(id)}
                      aria-pressed={active}
                      className={[
                        'text-[10.5px] px-2 py-0.5 rounded-full border transition-colors',
                        active
                          ? 'bg-[var(--bg-alt)] dark:bg-[var(--bg-dark-alt)] border-[var(--border)] dark:border-[var(--border-dark)]'
                          : 'bg-transparent text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] border-[var(--border)] dark:border-[var(--border-dark)] line-through',
                      ].join(' ')}
                    >
                      <span aria-hidden style={{ color: chipColor, marginInlineEnd: 3 }}>●</span>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Export */}
            <div>
              <div className="text-[10px] uppercase tracking-[0.06em] text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] mb-1.5">
                ייצוא
              </div>
              <div className="grid grid-cols-4 gap-1">
                <ExpBtn onClick={onExportPng}>PNG</ExpBtn>
                <ExpBtn onClick={onExportSvg}>SVG</ExpBtn>
                <ExpBtn onClick={onExportJson}>JSON</ExpBtn>
                <ExpBtn onClick={() => window.print()}>PDF</ExpBtn>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function IconBtn({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      type="button"
      className="w-8 h-8 inline-flex items-center justify-center rounded-full
                 border border-[var(--border)] dark:border-[var(--border-dark)]
                 bg-[var(--bg-card)] dark:bg-[var(--bg-dark-card)]
                 hover:bg-[var(--bg-alt)] dark:hover:bg-[var(--bg-dark-alt)]
                 text-[14px] leading-none transition-colors"
    >
      {children}
    </button>
  );
}

function ExpBtn({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      type="button"
      className="text-[10.5px] px-2 py-1 rounded border border-[var(--border)] dark:border-[var(--border-dark)]
                 hover:bg-[var(--bg-alt)] dark:hover:bg-[var(--bg-dark-alt)]
                 transition-colors"
    >
      {children}
    </button>
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
    <div className="inline-flex rounded-full border border-[var(--border)] dark:border-[var(--border-dark)] p-0.5
                    bg-[var(--bg-card)] dark:bg-[var(--bg-dark-card)] text-[11px]">
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
              'px-2.5 py-0.5 rounded-full transition-colors',
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
