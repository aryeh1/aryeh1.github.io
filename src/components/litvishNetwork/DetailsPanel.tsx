import { motion, AnimatePresence } from 'framer-motion';
import type { Person, RelationshipEdge, EdgeType, Yeshiva, Board } from '@/data/litvishNetwork';

interface Props {
  person: Person | null;
  edges: RelationshipEdge[];
  peopleById: Map<string, Person>;
  yeshivotById: Map<string, Yeshiva>;
  boardsById: Map<string, Board>;
  onSelect: (id: string) => void;
  onClose: () => void;
}

const ROLE_LABEL: Record<string, string> = {
  meyased: 'מייסד',
  nasi: 'נשיא',
  rosh: 'ראש ישיבה',
  mashgiach: 'משגיח',
  ram: 'ר"מ',
  menahel: 'מנהל',
};

const REL_LABEL: Record<EdgeType, { in: string; out: string }> = {
  parent: { in: 'הורה', out: 'ילד' },
  spouse: { in: 'בן/בת זוג', out: 'בן/בת זוג' },
  inlaw: { in: 'חותן', out: 'חתן' },
  teacher: { in: 'רב', out: 'תלמיד' },
  succession: { in: 'קודם בתפקיד', out: 'יורש בתפקיד' },
};

export function DetailsPanel({
  person,
  edges,
  peopleById,
  yeshivotById,
  boardsById,
  onSelect,
  onClose,
}: Props) {
  return (
    <AnimatePresence>
      {person && (
        <motion.aside
          key={person.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          dir="rtl"
          lang="he"
          className="
            fixed z-30
            inset-x-0 bottom-0 max-h-[70vh]
            md:inset-y-4 md:right-4 md:bottom-auto md:left-auto md:w-[380px] md:max-h-[calc(100vh-2rem)]
            rounded-t-2xl md:rounded-2xl
            bg-[var(--bg-card)] dark:bg-[var(--bg-dark-card)]
            border border-[var(--border)] dark:border-[var(--border-dark)]
            shadow-xl
            flex flex-col
          "
          style={{ fontFamily: "'Noto Serif Hebrew', Georgia, serif" }}
        >
          {/* Header */}
          <header className="px-5 pt-4 pb-3 border-b border-[var(--border)] dark:border-[var(--border-dark)]
                             flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-medium leading-tight">{person.name}</h2>
              {person.nickname && (
                <p className="mt-0.5 text-sm text-[var(--accent)] dark:text-[var(--accent-dark)]">
                  {person.nickname}
                </p>
              )}
              {(person.born || person.died) && (
                <p
                  className="mt-1 text-xs text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]"
                  style={{ direction: 'ltr', textAlign: 'right' }}
                >
                  {person.born ?? '?'}{person.died ? ` – ${person.died}` : ''}
                  {person.bornPlace ? ` · ${person.bornPlace}` : ''}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="סגור"
              className="text-xl leading-none px-2 py-1 rounded-full hover:bg-[var(--bg-alt)] dark:hover:bg-[var(--bg-dark-alt)]"
            >
              ⨯
            </button>
          </header>

          {/* Body */}
          <div className="overflow-y-auto px-5 py-4 space-y-5">
            {person.significance && (
              <section>
                <h3 className="text-[11px] uppercase tracking-wider text-[var(--accent)] dark:text-[var(--accent-dark)] mb-1">
                  למה במפה
                </h3>
                <p className="text-sm leading-relaxed">{person.significance}</p>
              </section>
            )}

            {person.bio && (
              <section>
                <h3 className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] mb-1">
                  ביוגרפיה
                </h3>
                <p className="text-sm leading-relaxed">{person.bio}</p>
              </section>
            )}

            {person.roles && person.roles.length > 0 && (
              <section>
                <h3 className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] mb-2">
                  תפקידים
                </h3>
                <ul className="space-y-1">
                  {person.roles.map((r, i) => {
                    const y = yeshivotById.get(r.yeshivaId);
                    return (
                      <li key={i} className="text-sm flex items-baseline justify-between gap-3">
                        <span className="font-medium">{y?.shortName ?? y?.name ?? r.yeshivaId}</span>
                        <span className="text-xs text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
                          {ROLE_LABEL[r.role] ?? r.role}
                          {r.fromYear ? ` · ${r.fromYear}${r.toYear ? `–${r.toYear}` : ''}` : ''}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {person.boards && person.boards.length > 0 && (
              <section>
                <h3 className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] mb-2">
                  גופים פוליטיים
                </h3>
                <ul className="space-y-1">
                  {person.boards.map((bId) => {
                    const b = boardsById.get(bId);
                    return (
                      <li key={bId} className="text-sm">
                        <span className="font-medium">{b?.shortName ?? bId}</span>
                        {b?.description && (
                          <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] mt-0.5">
                            {b.description}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            <RelationshipsSection
              personId={person.id}
              edges={edges}
              peopleById={peopleById}
              onSelect={onSelect}
            />

            {person.sources && person.sources.length > 0 && (
              <section>
                <h3 className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] mb-2">
                  מקורות
                </h3>
                <ul className="space-y-1 text-xs">
                  {person.sources.map((s, i) => (
                    <li key={i}>
                      <a href={s} target="_blank" rel="noreferrer noopener" className="underline decoration-dotted underline-offset-2 hover:text-[var(--accent)] dark:hover:text-[var(--accent-dark)]">
                        {s}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function RelationshipsSection({
  personId,
  edges,
  peopleById,
  onSelect,
}: {
  personId: string;
  edges: RelationshipEdge[];
  peopleById: Map<string, Person>;
  onSelect: (id: string) => void;
}) {
  const grouped: Record<EdgeType, Array<{ otherId: string; direction: 'in' | 'out'; note?: string }>> = {
    parent: [], spouse: [], inlaw: [], teacher: [], succession: [],
  };
  for (const e of edges) {
    if (e.source === personId) {
      grouped[e.type].push({ otherId: e.target, direction: 'out', note: e.note });
    } else if (e.target === personId) {
      grouped[e.type].push({ otherId: e.source, direction: 'in', note: e.note });
    }
  }

  const has = (Object.keys(grouped) as EdgeType[]).some((k) => grouped[k].length > 0);
  if (!has) return null;

  return (
    <section>
      <h3 className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] mb-2">
        קשרים
      </h3>
      <div className="space-y-3">
        {(Object.keys(grouped) as EdgeType[]).map((t) => {
          const list = grouped[t];
          if (list.length === 0) return null;
          return (
            <div key={t}>
              <div className="text-[11px] mb-1 text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)]">
                {t === 'parent' ? 'הורות' : t === 'spouse' ? 'נישואין' : t === 'inlaw' ? 'חיתון' : t === 'teacher' ? 'רב/תלמיד' : 'ירושת תפקיד'}
              </div>
              <ul className="space-y-1">
                {list.map((rel, i) => {
                  const other = peopleById.get(rel.otherId);
                  if (!other) return null;
                  const labelKey: 'in' | 'out' = rel.direction;
                  const role = REL_LABEL[t][labelKey];
                  return (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => onSelect(rel.otherId)}
                        className="w-full text-right text-sm rounded-md px-2 py-1.5
                                   hover:bg-[var(--bg-alt)] dark:hover:bg-[var(--bg-dark-alt)]
                                   border border-transparent hover:border-[var(--border)] dark:hover:border-[var(--border-dark)]
                                   transition-colors flex items-center justify-between gap-2"
                      >
                        <span className="flex-1 truncate">{other.name}</span>
                        <span className="text-[10px] text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
                          {rel.note ? rel.note : role}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
