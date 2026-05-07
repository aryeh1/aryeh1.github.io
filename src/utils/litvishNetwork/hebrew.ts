/**
 * Hebrew-text normalization for search and matching.
 *
 * - Strips niqqud (vowel points) and te'amim (cantillation marks) so
 *   "פִּינְקֶל" matches "פינקל".
 * - Folds final letters (ך,ם,ן,ף,ץ) to their non-final forms so a
 *   user typing "ם" finds "מ"-words and vice-versa.
 * - Removes apostrophes and punctuation that often appear in titled
 *   names ("ר'", "כנסת בית-יצחק").
 * - Keeps a parallel ASCII fold so Latin-keyboard typists ("Slabodka",
 *   "Kotler") find the right entries.
 */

const HEBREW_DIACRITICS = /[֑-ׇ]/g; // niqqud + te'amim block
const FINAL_LETTERS: Record<string, string> = {
  'ך': 'כ', // ך → כ
  'ם': 'מ', // ם → מ
  'ן': 'נ', // ן → נ
  'ף': 'פ', // ף → פ
  'ץ': 'צ', // ץ → צ
};
const PUNCT = /[''"׳״.,()-]/g;

export function normalizeHebrew(input: string): string {
  if (!input) return '';
  let s = input.normalize('NFC').replace(HEBREW_DIACRITICS, '');
  s = s.replace(/./g, (ch) => FINAL_LETTERS[ch] ?? ch);
  s = s.replace(PUNCT, ' ');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

/**
 * For a person, build the searchable corpus: name, nickname, alt-names,
 * and ASCII transliteration. Each is normalized.
 */
export function searchCorpus(parts: Array<string | undefined>): string {
  return parts
    .filter((p): p is string => Boolean(p))
    .map(normalizeHebrew)
    .join(' ');
}
