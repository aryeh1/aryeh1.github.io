import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { Person } from '@/data/litvishNetwork';

/**
 * Custom React Flow node for one person in the network.
 *
 * The node is HTML (not canvas) so Hebrew RTL "just works": we set
 * dir="rtl" lang="he" on the inner div and the browser handles bidi.
 * The wrapper itself stays LTR — the React Flow canvas expects LTR
 * coordinates (see xyflow #3116).
 */

export interface PersonNodeData {
  person: Person;
  selected?: boolean;
  faded?: boolean;
  matched?: boolean;
  /** Top-3 yeshivot the person is associated with, for the badge row. */
  yeshivaLabels?: string[];
  onSelect?: (id: string) => void;
}

const ROLE_ICON: Record<string, string> = {
  meyased: '✪',  // ✪
  nasi: '★',     // ★
  rosh: '◆',     // ◆
  mashgiach: '◇', // ◇
  ram: '●',       // ●
  menahel: '■',   // ■
};

function lifespan(p: Person): string {
  if (!p.born && !p.died) return '';
  const a = p.born ?? '?';
  const b = p.died ?? '';
  return b ? `${a} – ${b}` : ` * ${a}`;
}

const PersonNodeBase = ({ data }: NodeProps & { data: PersonNodeData }) => {
  const { person, selected, faded, matched, yeshivaLabels = [] } = data;
  const isMarquee = !!person.marquee;

  return (
    <div className="relative" style={{ direction: 'ltr' }}>
      {/* Invisible handles on every side so dagre/network edges connect cleanly */}
      <Handle id="t" type="target" position={Position.Top} className="!opacity-0" />
      <Handle id="b" type="source" position={Position.Bottom} className="!opacity-0" />
      <Handle id="l" type="source" position={Position.Left} className="!opacity-0" />
      <Handle id="r" type="target" position={Position.Right} className="!opacity-0" />

      <div
        dir="rtl"
        lang="he"
        className={[
          'rounded-xl px-3 py-2 transition-all',
          'bg-[var(--bg-card)] dark:bg-[var(--bg-dark-card)]',
          'border-2',
          selected
            ? 'border-[var(--accent)] dark:border-[var(--accent-dark)] shadow-lg scale-[1.04]'
            : matched
              ? 'border-[var(--accent)]/70 dark:border-[var(--accent-dark)]/70 shadow-md'
              : 'border-[var(--border)] dark:border-[var(--border-dark)]',
          faded ? 'opacity-25' : 'opacity-100',
          isMarquee ? 'min-w-[230px] py-3' : 'min-w-[190px]',
          'cursor-pointer hover:shadow-md hover:-translate-y-0.5',
        ].join(' ')}
        style={{
          fontFamily: "'Noto Serif Hebrew', Georgia, serif",
          width: isMarquee ? 240 : 200,
          minHeight: isMarquee ? 110 : 86,
        }}
      >
        {/* Name */}
        <div className={isMarquee ? 'text-[15px] font-medium leading-tight' : 'text-[13px] font-medium leading-tight'}>
          {person.name}
          {person.uncertain ? (
            <span className="text-[10px] text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]"> [לאימות]</span>
          ) : null}
        </div>

        {/* Nickname */}
        {person.nickname && (
          <div className={`mt-0.5 ${isMarquee ? 'text-[12px]' : 'text-[11px]'} text-[var(--accent)] dark:text-[var(--accent-dark)] truncate`}>
            {person.nickname}
          </div>
        )}

        {/* Lifespan */}
        {(person.born || person.died) && (
          <div
            className="mt-0.5 text-[10px] text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]"
            style={{ direction: 'ltr', textAlign: 'right' }}
          >
            {lifespan(person)}
          </div>
        )}

        {/* Role icons + yeshiva tags */}
        {(person.roles && person.roles.length > 0) && (
          <div className="mt-1 flex flex-wrap gap-1 justify-end">
            {(person.roles ?? []).slice(0, 2).map((r, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded
                           bg-[var(--bg-alt)] dark:bg-[var(--bg-dark-alt)]
                           text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)]"
              >
                <span aria-hidden>{ROLE_ICON[r.role] ?? '□'}</span>
                <span>{yeshivaLabels[i] ?? ''}</span>
              </span>
            ))}
            {person.roles && person.roles.length > 2 && (
              <span className="text-[10px] text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
                +{person.roles.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Board membership chip */}
        {person.boards && person.boards.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1 justify-end">
            {person.boards.slice(0, 1).map((b) => (
              <span
                key={b}
                className="text-[9px] px-1.5 py-0.5 rounded-sm font-medium tracking-wide
                           border border-[var(--accent)] text-[var(--accent)]
                           dark:border-[var(--accent-dark)] dark:text-[var(--accent-dark)]"
              >
                {boardChip(b)}
              </span>
            ))}
            {person.boards.length > 1 && (
              <span className="text-[9px] text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
                +{person.boards.length - 1}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

function boardChip(b: string): string {
  switch (b) {
    case 'moetzes-degel': return 'מועצת דגל';
    case 'moetzes-aguda-il': return 'מועצת אגודה';
    case 'moetzes-aguda-us': return 'מועצת אגודה ארה"ב';
    case 'vaad-yeshivos': return 'ועד הישיבות';
    case 'chinuch-atzmai': return 'חינוך עצמאי';
    case 'pelag': return 'פלג ירושלמי';
    case 'badatz-bb': return 'בד"ץ ב"ב';
    default: return b;
  }
}

export const PersonNode = memo(PersonNodeBase);
