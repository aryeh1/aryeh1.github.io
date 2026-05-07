import { useEffect, useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import type { Person } from '@/data/litvishNetwork';
import { normalizeHebrew, searchCorpus } from '@/utils/litvishNetwork/hebrew';

/**
 * Search box with Hebrew-aware fuzzy matching.
 *
 * - Strips niqqud and final-letter forms before indexing & matching
 *   (see ../../utils/litvishNetwork/hebrew.ts).
 * - Indexes name, nickname, alt-names, ASCII transliteration, bio, and
 *   significance — so "ליקווד" finds Aharon Kotler via his bio.
 */

interface Props {
  people: Person[];
  onSelect: (id: string) => void;
  onMatchedChange?: (ids: Set<string>) => void;
}

interface Indexable {
  id: string;
  name: string;
  nickname?: string;
  alt: string;
  bio: string;
}

export function SearchBar({ people, onSelect, onMatchedChange }: Props) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);

  const fuse = useMemo(() => {
    const docs: Indexable[] = people.map((p) => ({
      id: p.id,
      name: normalizeHebrew(p.name),
      nickname: p.nickname ? normalizeHebrew(p.nickname) : undefined,
      alt: searchCorpus([
        ...(p.altNames ?? []),
        p.ascii,
        ...(p.roles ?? []).map((r) => r.yeshivaId),
      ]),
      bio: searchCorpus([p.bio, p.significance]),
    }));
    return new Fuse(docs, {
      keys: [
        { name: 'name', weight: 0.5 },
        { name: 'nickname', weight: 0.25 },
        { name: 'alt', weight: 0.15 },
        { name: 'bio', weight: 0.1 },
      ],
      includeScore: true,
      threshold: 0.35,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }, [people]);

  const results = useMemo(() => {
    const norm = normalizeHebrew(q);
    if (!norm) return [];
    return fuse.search(norm).slice(0, 8);
  }, [fuse, q]);

  useEffect(() => {
    if (!onMatchedChange) return;
    if (!q.trim()) {
      onMatchedChange(new Set());
    } else {
      onMatchedChange(new Set(results.map((r) => r.item.id)));
    }
  }, [results, q, onMatchedChange]);

  const peopleById = useMemo(() => new Map(people.map((p) => [p.id, p])), [people]);

  return (
    <div className="relative w-full" dir="rtl">
      <div className="flex items-center gap-2 rounded-full px-4 py-2.5
                      bg-[var(--bg-card)] dark:bg-[var(--bg-dark-card)]
                      border border-[var(--border)] dark:border-[var(--border-dark)]
                      shadow-sm focus-within:ring-2 focus-within:ring-[var(--accent)] dark:focus-within:ring-[var(--accent-dark)]">
        <span aria-hidden className="text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] text-base">⌕</span>
        <input
          type="search"
          value={q}
          placeholder="חיפוש: שם, ישיבה, ניקבי…"
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--text-muted)] dark:placeholder:text-[var(--text-dark-muted)]"
          style={{ fontFamily: "'Noto Serif Hebrew', Georgia, serif" }}
          aria-label="חיפוש אישיות במפת הקשרים"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ('')}
            className="text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] text-xs px-1"
            aria-label="נקה"
          >
            ⨯
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <ul className="absolute z-30 mt-1 w-full max-h-[60vh] overflow-y-auto rounded-xl
                       bg-[var(--bg-card)] dark:bg-[var(--bg-dark-card)]
                       border border-[var(--border)] dark:border-[var(--border-dark)]
                       shadow-lg">
          {results.map((r) => {
            const p = peopleById.get(r.item.id);
            if (!p) return null;
            return (
              <li key={r.item.id}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { onSelect(r.item.id); setOpen(false); setQ(''); }}
                  className="w-full text-right px-4 py-2.5 hover:bg-[var(--bg-alt)] dark:hover:bg-[var(--bg-dark-alt)]
                             border-b border-[var(--border)] dark:border-[var(--border-dark)] last:border-b-0
                             transition-colors"
                  style={{ fontFamily: "'Noto Serif Hebrew', Georgia, serif" }}
                >
                  <div className="text-sm font-medium">{p.name}</div>
                  {p.nickname && (
                    <div className="text-xs text-[var(--accent)] dark:text-[var(--accent-dark)] mt-0.5">
                      {p.nickname}
                    </div>
                  )}
                  {p.significance && (
                    <div className="text-[11px] text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] mt-0.5 truncate">
                      {p.significance}
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
