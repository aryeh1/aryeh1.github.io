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

const SECTION = 'text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] mb-1.5';

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
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          dir="rtl"
          lang="he"
          className="
            fixed z-30 pointer-events-auto
            inset-x-0 bottom-0 max-h-[55vh]
            md:inset-y-3 md:left-3 md:bottom-auto md:right-auto md:top-[64px] md:w-[320px] md:max-h-[calc(100vh-76px)]
            rounded-t-xl md:rounded-xl
            bg-[var(--bg-card)] dark:bg-[var(--bg-dark-card)]
            border border-[var(--border)] dark:border-[var(--border-dark)]
            shadow-lg
            flex flex-col
            text-[13px]
          "
          style={{ fontFamily: "'Noto Serif Hebrew', Georgia, serif" }}
        >
          {/* Header */}
          <header className="px-4 pt-3 pb-2.5 border-b border-[var(--border)] dark:border-[var(--border-dark)]
                             flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-[15px] leading-tight font-medium">{person.name}</div>
              {person.nickname && (
                <div className="mt-0.5 text-[12px] text-[var(--accent)] dark:text-[var(--accent-dark)]">
                  {person.nickname}
                </div>
              )}
              {(person.born || person.died) && (
                <div
                  className="mt-1 text-[11px] text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]"
                  style={{ direction: 'ltr', textAlign: 'right' }}
                >
                  {person.born ?? '?'}{person.died ? ` – ${person.died}` : ''}
                  {person.bornPlace ? ` · ${person.bornPlace}` : ''}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="סגור"
              className="text-base leading-none w-7 h-7 rounded-full hover:bg-[var(--bg-alt)] dark:hover:bg-[var(--bg-dark-alt)] inline-flex items-center justify-center"
            >
              ⨯
            </button>
          </header>

          {/* Body */}
          <div className="overflow-y-auto px-4 py-3 space-y-3.5 leading-[1.55]">
            {person.significance && (
              <section>
                <div className={SECTION + ' text-[var(--accent)] dark:text-[var(--accent-dark)]'}>למה במפה</div>
                <p className="text-[13px]">{person.significance}</p>
              </section>
            )}

            {person.bio && (
              <section>
                <div className={SECTION}>ביוגרפיה</div>
                <p className="text-[13px]">{person.bio}</p>
              </section>
            )}

            {person.roles && person.roles.length > 0 && (
              <section>
                <div className={SECTION}>תפקידים</div>
                <ul className="space-y-1">
                  {person.roles.map((r, i) => {
                    const y = yeshivotById.get(r.yeshivaId);
                    return (
                      <li key={i} className="text-[12.5px] flex items-baseline justify-between gap-2">
                        <span className="font-medium truncate">{y?.shortName ?? y?.name ?? r.yeshivaId}</span>
                        <span className="text-[11px] text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] whitespace-nowrap">
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
                <div className={SECTION}>גופים פוליטיים</div>
                <ul className="space-y-1">
                  {person.boards.map((bId) => {
                    const b = boardsById.get(bId);
                    return (
                      <li key={bId} className="text-[12.5px]">
                        <span className="font-medium">{b?.shortName ?? bId}</span>
                        {b?.description && (
                          <p className="text-[11px] text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] mt-0.5 leading-snug">
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
                <div className={SECTION}>מקורות</div>
                <ul className="space-y-1 text-[11px] break-all">
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

  const REL_GROUP_LABEL: Record<EdgeType, string> = {
    parent: 'הורות',
    spouse: 'נישואין',
    inlaw: 'חיתון',
    teacher: 'רב/תלמיד',
    succession: 'ירושת תפקיד',
  };

  return (
    <section>
      <div className={SECTION}>קשרים</div>
      <div className="space-y-2.5">
        {(Object.keys(grouped) as EdgeType[]).map((t) => {
          const list = grouped[t];
          if (list.length === 0) return null;
          return (
            <div key={t}>
              <div className="text-[10.5px] mb-1 text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)]">
                {REL_GROUP_LABEL[t]}
              </div>
              <ul className="space-y-0.5">
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
                        className="w-full text-right text-[12.5px] rounded-md px-2 py-1
                                   hover:bg-[var(--bg-alt)] dark:hover:bg-[var(--bg-dark-alt)]
                                   transition-colors flex items-center justify-between gap-2"
                      >
                        <span className="flex-1 truncate">{other.name}</span>
                        <span className="text-[10px] text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] whitespace-nowrap">
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
