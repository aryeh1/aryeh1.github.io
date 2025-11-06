/**
 * Tests for textLoader service
 */

import { parseReference, findBookByKey, findBookByName, getAllBooks } from './textLoader';

// Mock book index for testing
const mockBookIndex = {
  sections: {
    torah: {
      name: 'Torah',
      hebrewName: 'תורה',
      books: [
        {
          english: 'Genesis',
          hebrew: 'בראשית',
          key: 'genesis',
          chapters: 50
        },
        {
          english: 'Exodus',
          hebrew: 'שמות',
          key: 'exodus',
          chapters: 40
        }
      ]
    },
    prophets: {
      name: 'Prophets',
      hebrewName: 'נביאים',
      books: [
        {
          english: 'Joshua',
          hebrew: 'יהושע',
          key: 'joshua',
          chapters: 24
        }
      ]
    }
  }
};

describe('textLoader service', () => {
  describe('getAllBooks', () => {
    it('should return all books from all sections', () => {
      const books = getAllBooks(mockBookIndex);
      expect(books).toHaveLength(3);
      expect(books[0].key).toBe('genesis');
      expect(books[1].key).toBe('exodus');
      expect(books[2].key).toBe('joshua');
    });

    it('should return empty array for null index', () => {
      const books = getAllBooks(null);
      expect(books).toEqual([]);
    });
  });

  describe('findBookByKey', () => {
    it('should find book by key', () => {
      const book = findBookByKey(mockBookIndex, 'genesis');
      expect(book).toBeDefined();
      expect(book.english).toBe('Genesis');
      expect(book.chapters).toBe(50);
    });

    it('should return undefined for non-existent key', () => {
      const book = findBookByKey(mockBookIndex, 'nonexistent');
      expect(book).toBeUndefined();
    });
  });

  describe('findBookByName', () => {
    it('should find book by English name (case insensitive)', () => {
      const book = findBookByName(mockBookIndex, 'Genesis');
      expect(book).toBeDefined();
      expect(book.key).toBe('genesis');
    });

    it('should find book by Hebrew name', () => {
      const book = findBookByName(mockBookIndex, 'בראשית');
      expect(book).toBeDefined();
      expect(book.key).toBe('genesis');
    });

    it('should return undefined for non-existent name', () => {
      const book = findBookByName(mockBookIndex, 'NonExistent');
      expect(book).toBeUndefined();
    });
  });

  describe('parseReference', () => {
    describe('English references', () => {
      it('should parse "Genesis 1:1" format', () => {
        const result = parseReference('Genesis 1:1', mockBookIndex);
        expect(result).toEqual({
          bookKey: 'genesis',
          chapter: 1,
          verse: 1
        });
      });

      it('should parse "Genesis 1" format (no verse)', () => {
        const result = parseReference('Genesis 1', mockBookIndex);
        expect(result).toEqual({
          bookKey: 'genesis',
          chapter: 1,
          verse: null
        });
      });

      it('should handle case insensitive book names', () => {
        const result = parseReference('genesis 1', mockBookIndex);
        expect(result).toEqual({
          bookKey: 'genesis',
          chapter: 1,
          verse: null
        });
      });

      it('should parse multi-digit chapters and verses', () => {
        const result = parseReference('Genesis 50:26', mockBookIndex);
        expect(result).toEqual({
          bookKey: 'genesis',
          chapter: 50,
          verse: 26
        });
      });
    });

    describe('Hebrew references', () => {
      it('should parse "בראשית 1" format', () => {
        const result = parseReference('בראשית 1', mockBookIndex);
        expect(result).toEqual({
          bookKey: 'genesis',
          chapter: 1,
          verse: null
        });
      });

      it('should parse "בראשית 1:1" format', () => {
        const result = parseReference('בראשית 1:1', mockBookIndex);
        expect(result).toEqual({
          bookKey: 'genesis',
          chapter: 1,
          verse: 1
        });
      });
    });

    describe('Error handling', () => {
      it('should return null for invalid format', () => {
        const result = parseReference('invalid', mockBookIndex);
        expect(result).toBeNull();
      });

      it('should return null for non-existent book', () => {
        const result = parseReference('NonExistent 1', mockBookIndex);
        expect(result).toBeNull();
      });

      it('should return null for chapter out of range', () => {
        const result = parseReference('Genesis 100', mockBookIndex);
        expect(result).toBeNull();
      });

      it('should return null for chapter 0', () => {
        const result = parseReference('Genesis 0', mockBookIndex);
        expect(result).toBeNull();
      });

      it('should return null for empty string', () => {
        const result = parseReference('', mockBookIndex);
        expect(result).toBeNull();
      });

      it('should return null for null input', () => {
        const result = parseReference(null, mockBookIndex);
        expect(result).toBeNull();
      });
    });

    describe('Whitespace handling', () => {
      it('should handle extra whitespace', () => {
        const result = parseReference('  Genesis  1:1  ', mockBookIndex);
        expect(result).toEqual({
          bookKey: 'genesis',
          chapter: 1,
          verse: 1
        });
      });
    });
  });
});
