/**
 * Tests for sefariaAPI service
 */

import { stripNikud } from './sefariaAPI';

describe('sefariaAPI service', () => {
  describe('stripNikud', () => {
    it('should remove nikud (vowel points) from Hebrew text', () => {
      // Hebrew text with nikud
      const withNikud = 'בְּרֵאשִׁית בָּרָא אֱלֹהִים';
      const withoutNikud = 'בראשית ברא אלהים';
      expect(stripNikud(withNikud)).toBe(withoutNikud);
    });

    it('should remove cantillation marks', () => {
      // Text with cantillation marks
      const withCantillation = 'בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים';
      const withoutCantillation = 'בראשית ברא אלהים';
      expect(stripNikud(withCantillation)).toBe(withoutCantillation);
    });

    it('should handle text without nikud', () => {
      const plainText = 'בראשית ברא אלהים';
      expect(stripNikud(plainText)).toBe(plainText);
    });

    it('should handle empty string', () => {
      expect(stripNikud('')).toBe('');
    });

    it('should handle null/undefined', () => {
      expect(stripNikud(null)).toBeNull();
      expect(stripNikud(undefined)).toBeUndefined();
    });

    it('should preserve maqaf (hyphen) characters', () => {
      const textWithMaqaf = 'על־פני';
      expect(stripNikud(textWithMaqaf)).toBe('על־פני');
    });

    it('should preserve spaces and punctuation', () => {
      const text = 'בְּרֵאשִׁית בָּרָא, אֱלֹהִים.';
      const expected = 'בראשית ברא, אלהים.';
      expect(stripNikud(text)).toBe(expected);
    });
  });
});
