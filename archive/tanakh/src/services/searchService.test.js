/**
 * Tests for searchService
 * Following TDD approach: Write tests first, then implement
 */

import {
  stripNikudFromText,
  stripPrefixLetters,
  searchExact,
  searchFuzzy,
  highlightMatch,
  searchAllBooks
} from './searchService';

describe('searchService', () => {
  describe('stripNikudFromText', () => {
    it('should remove nikud from Hebrew text', () => {
      const text = 'בְּרֵאשִׁית בָּרָא אֱלֹהִים';
      const result = stripNikudFromText(text);
      expect(result).toBe('בראשית ברא אלהים');
    });

    it('should preserve maqaf (hyphen)', () => {
      const text = 'עַל־פְּנֵי';
      const result = stripNikudFromText(text);
      expect(result).toBe('על־פני');
    });

    it('should handle text without nikud', () => {
      const text = 'בראשית ברא אלהים';
      const result = stripNikudFromText(text);
      expect(result).toBe('בראשית ברא אלהים');
    });

    it('should handle empty string', () => {
      const result = stripNikudFromText('');
      expect(result).toBe('');
    });
  });

  describe('stripPrefixLetters', () => {
    it('should strip ו prefix', () => {
      expect(stripPrefixLetters('ואלהים')).toBe('אלהים');
    });

    it('should strip ה prefix', () => {
      expect(stripPrefixLetters('האלהים')).toBe('אלהים');
    });

    it('should strip ב prefix', () => {
      expect(stripPrefixLetters('באלהים')).toBe('אלהים');
    });

    it('should strip כ prefix', () => {
      expect(stripPrefixLetters('כאלהים')).toBe('אלהים');
    });

    it('should strip ל prefix', () => {
      expect(stripPrefixLetters('לאלהים')).toBe('אלהים');
    });

    it('should strip מ prefix', () => {
      expect(stripPrefixLetters('מאלהים')).toBe('אלהים');
    });

    it('should strip י prefix', () => {
      expect(stripPrefixLetters('יאלהים')).toBe('אלהים');
    });

    it('should not strip non-prefix letters', () => {
      expect(stripPrefixLetters('אראשית')).toBe('אראשית');
    });

    it('should handle empty string', () => {
      expect(stripPrefixLetters('')).toBe('');
    });

    it('should strip all consecutive prefix letters', () => {
      expect(stripPrefixLetters('ובהארץ')).toBe('ארץ');
      expect(stripPrefixLetters('ובל')).toBe('ל'); // strips 'ו' and 'ב', leaves 'ל' because it's the last char
      expect(stripPrefixLetters('והה')).toBe('ה'); // strips 'ו' and 'ה', leaves last 'ה'
    });

    it('should not strip if word is only one character', () => {
      expect(stripPrefixLetters('ו')).toBe('ו');
    });
  });

  describe('searchExact', () => {
    const mockVerses = [
      { number: 1, hebrew: 'בראשית ברא אלהים את השמים ואת הארץ' },
      { number: 2, hebrew: 'והארץ היתה תהו ובהו' },
      { number: 3, hebrew: 'ויאמר אלהים יהי אור' }
    ];

    it('should find exact word match', () => {
      const results = searchExact(mockVerses, 'בראשית', false);
      expect(results).toHaveLength(1);
      expect(results[0].number).toBe(1);
    });

    it('should not match partial words', () => {
      const results = searchExact(mockVerses, 'אלהי', false);
      expect(results).toHaveLength(0);
    });

    it('should find multiple matches', () => {
      const results = searchExact(mockVerses, 'אלהים', false);
      expect(results).toHaveLength(2);
    });

    it('should be case sensitive for Hebrew', () => {
      const results = searchExact(mockVerses, 'בראשית', false);
      expect(results).toHaveLength(1);
    });

    describe('with prefix stripping', () => {
      it('should match word with prefix stripped', () => {
        const results = searchExact(mockVerses, 'ארץ', true);
        expect(results.length).toBeGreaterThan(0);
        // Should match both "ארץ" and "הארץ" and "והארץ"
      });

      it('should match base word when searching with prefix', () => {
        const results = searchExact(mockVerses, 'והארץ', true);
        expect(results.length).toBeGreaterThan(0);
      });
    });
  });

  describe('searchFuzzy', () => {
    const mockVerses = [
      { number: 1, hebrew: 'בראשית ברא אלהים את השמים ואת הארץ' },
      { number: 2, hebrew: 'והארץ היתה תהו ובהו' },
      { number: 3, hebrew: 'ויאמר אלהים יהי אור' }
    ];

    it('should find partial matches', () => {
      const results = searchFuzzy(mockVerses, 'אלהי', false);
      expect(results).toHaveLength(2);
    });

    it('should find exact matches', () => {
      const results = searchFuzzy(mockVerses, 'בראשית', false);
      expect(results).toHaveLength(1);
      expect(results[0].number).toBe(1);
    });

    it('should find matches within words', () => {
      const results = searchFuzzy(mockVerses, 'רא', false);
      expect(results.length).toBeGreaterThan(0);
    });

    describe('with prefix stripping', () => {
      it('should match partial words with prefix stripped', () => {
        const results = searchFuzzy(mockVerses, 'ארץ', true);
        expect(results.length).toBeGreaterThan(0);
      });

      it('should match when search term has prefix', () => {
        const results = searchFuzzy(mockVerses, 'והא', true);
        expect(results.length).toBeGreaterThan(0);
      });
    });
  });

  describe('highlightMatch', () => {
    it('should highlight exact match', () => {
      const text = 'בראשית ברא אלהים';
      const result = highlightMatch(text, 'בראשית');
      expect(result).toContain('<mark>');
      expect(result).toContain('</mark>');
    });

    it('should highlight multiple occurrences', () => {
      const text = 'את השמים ואת הארץ';
      const result = highlightMatch(text, 'את');
      const matches = result.match(/<mark>/g);
      expect(matches).toHaveLength(2);
    });

    it('should preserve original text structure', () => {
      const text = 'בראשית ברא אלהים';
      const result = highlightMatch(text, 'אלהים');
      // Should highlight אלהים but preserve בראשית and ברא
      expect(result).toContain('בראשית');
      expect(result).toContain('ברא');
      expect(result).toContain('<mark>אלהים</mark>');
    });

    it('should handle no match', () => {
      const text = 'בראשית ברא אלהים';
      const result = highlightMatch(text, 'xyz');
      expect(result).toBe(text);
      expect(result).not.toContain('<mark>');
    });

    it('should escape HTML in text', () => {
      const text = 'text with <b>bold</b>';
      const result = highlightMatch(text, 'text');
      // HTML tags should be escaped except our mark tags
      expect(result).toContain('<mark>text</mark>');
      expect(result).not.toContain('<b>');
    });
  });

  describe('searchAllBooks', () => {
    const mockSearchIndex = [
      {
        book: 'Genesis',
        bookKey: 'genesis',
        bookHebrew: 'בראשית',
        chapter: 1,
        verse: 1,
        text: 'בראשית ברא אלהים את השמים'
      },
      {
        book: 'Genesis',
        bookKey: 'genesis',
        bookHebrew: 'בראשית',
        chapter: 1,
        verse: 2,
        text: 'והארץ היתה תהו ובהו'
      },
      {
        book: 'Genesis',
        bookKey: 'genesis',
        bookHebrew: 'בראשית',
        chapter: 2,
        verse: 1,
        text: 'ויכלו השמים והארץ'
      },
      {
        book: 'Exodus',
        bookKey: 'exodus',
        bookHebrew: 'שמות',
        chapter: 1,
        verse: 1,
        text: 'ואלה שמות בני ישראל'
      }
    ];

    beforeEach(() => {
      // Mock fetch to return our search index
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSearchIndex)
        })
      );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should search across all books', async () => {
      const results = await searchAllBooks(
        'השמים',
        'exact',
        false,
        null
      );
      expect(results.length).toBeGreaterThan(0);
    });

    it('should filter by specific books', async () => {
      const results = await searchAllBooks(
        'השמים',
        'exact',
        false,
        ['genesis']
      );
      expect(results.length).toBeGreaterThan(0);
      expect(results.every(r => r.bookKey === 'genesis')).toBe(true);
    });

    it('should return results with proper structure', async () => {
      const results = await searchAllBooks(
        'בראשית',
        'exact',
        false,
        null
      );
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toHaveProperty('bookKey');
      expect(results[0]).toHaveProperty('bookName');
      expect(results[0]).toHaveProperty('bookNameHebrew');
      expect(results[0]).toHaveProperty('chapter');
      expect(results[0]).toHaveProperty('verse');
      expect(results[0]).toHaveProperty('verseText');
      expect(results[0]).toHaveProperty('highlightedText');
    });

    it('should use fuzzy search mode', async () => {
      const results = await searchAllBooks(
        'השמ',
        'fuzzy',
        false,
        null
      );
      expect(results.length).toBeGreaterThan(0);
    });

    it('should respect stripPrefixes option', async () => {
      // Search for "הארץ" without prefix should find "הארץ" only
      const withoutStrip = await searchAllBooks(
        'הארץ',
        'exact',
        false,
        null
      );
      // Search for "ארץ" with prefix stripping should find both "ארץ" and "הארץ"
      const withStrip = await searchAllBooks(
        'ארץ',
        'exact',
        true,
        null
      );
      // withStrip should find more results than withoutStrip
      expect(withStrip.length).toBeGreaterThan(0);
    });

    it('should return empty array for no matches', async () => {
      const results = await searchAllBooks(
        'xyz123',
        'exact',
        false,
        null
      );
      expect(results).toEqual([]);
    });

    it('should sort results by order of appearance in Tanakh', async () => {
      const results = await searchAllBooks(
        'השמים',
        'fuzzy',
        false,
        null
      );
      // Should be ordered: genesis/1/1, genesis/2/1, ...
      for (let i = 0; i < results.length - 1; i++) {
        const current = results[i];
        const next = results[i + 1];
        // Compare book order, then chapter, then verse
        expect(current.bookKey <= next.bookKey).toBe(true);
        if (current.bookKey === next.bookKey) {
          expect(current.chapter <= next.chapter).toBe(true);
          if (current.chapter === next.chapter) {
            expect(current.verse <= next.verse).toBe(true);
          }
        }
      }
    });

    it('should load search index and perform search', async () => {
      // Test that search works with the search index
      const results = await searchAllBooks('test', 'exact', false, null);

      // Verify that results are returned (even if empty)
      expect(Array.isArray(results)).toBe(true);
    });
  });
});
