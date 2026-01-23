/**
 * Service for loading Bible text from JSON files
 */

export async function loadBookIndex() {
  try {
    const response = await fetch(`${process.env.PUBLIC_URL}/data/index.json`);
    if (!response.ok) {
      throw new Error('Failed to load book index');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading book index:', error);
    throw error;
  }
}

/**
 * Strip maqaf (hyphen) characters from Hebrew text
 * Maqaf is ־ (U+05BE)
 */
function stripMaqaf(text) {
  if (!text) return text;
  return text.replace(/־/g, ' ');
}

export async function loadChapter(bookKey, chapterNumber) {
  try {
    const response = await fetch(
      `${process.env.PUBLIC_URL}/data/${bookKey}/${chapterNumber}.json`
    );
    if (!response.ok) {
      throw new Error(`Failed to load ${bookKey} chapter ${chapterNumber}`);
    }
    const data = await response.json();

    // Strip maqaf from all verse text for clean display
    if (data.verses) {
      data.verses = data.verses.map(verse => ({
        ...verse,
        hebrew: stripMaqaf(verse.hebrew)
      }));
    }

    return data;
  } catch (error) {
    console.error(`Error loading chapter ${bookKey} ${chapterNumber}:`, error);
    throw error;
  }
}

export function getAllBooks(bookIndex) {
  if (!bookIndex || !bookIndex.sections) return [];

  const allBooks = [];
  Object.values(bookIndex.sections).forEach(section => {
    if (section.books) {
      allBooks.push(...section.books);
    }
  });
  return allBooks;
}

export function findBookByKey(bookIndex, bookKey) {
  const allBooks = getAllBooks(bookIndex);
  return allBooks.find(book => book.key === bookKey);
}

export function findBookByName(bookIndex, bookName) {
  const allBooks = getAllBooks(bookIndex);
  return allBooks.find(
    book =>
      book.english.toLowerCase() === bookName.toLowerCase() ||
      book.hebrew === bookName
  );
}

/**
 * Convert Hebrew numeral to Arabic number
 * Supports standard Hebrew gematria (א=1, ב=2, י=10, כ=20, etc.)
 */
function hebrewToNumber(hebrewNumeral) {
  if (!hebrewNumeral) return null;

  const hebrewValues = {
    'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
    'י': 10, 'כ': 20, 'ך': 20, 'ל': 30, 'מ': 40, 'ם': 40, 'נ': 50, 'ן': 50,
    'ס': 60, 'ע': 70, 'פ': 80, 'ף': 80, 'צ': 90, 'ץ': 90,
    'ק': 100, 'ר': 200, 'ש': 300, 'ת': 400
  };

  let total = 0;
  for (let i = 0; i < hebrewNumeral.length; i++) {
    const char = hebrewNumeral[i];
    if (hebrewValues[char]) {
      total += hebrewValues[char];
    } else {
      // Invalid character in Hebrew numeral
      return null;
    }
  }

  return total > 0 ? total : null;
}

/**
 * Parse references like "Genesis 1:1" or "בראשית א:א"
 * Returns { bookKey, chapter, verse } or null if invalid
 */
export function parseReference(referenceString, bookIndex) {
  if (!referenceString || !bookIndex) return null;

  // Remove extra whitespace
  const ref = referenceString.trim();

  // Try to match patterns like:
  // "Genesis 1:1", "Genesis 1", "בראשית א", "בראשית א:א"
  const patterns = [
    /^(.+?)\s+(\d+):(\d+)$/,      // Book Chapter:Verse (Arabic numerals)
    /^(.+?)\s+(\d+)$/,             // Book Chapter (Arabic numerals)
    /^(.+?)\s+([א-ת]+):([א-ת]+)$/, // Book Chapter:Verse (Hebrew numerals)
    /^(.+?)\s+([א-ת]+)$/,          // Book Chapter (Hebrew numerals)
  ];

  for (const pattern of patterns) {
    const match = ref.match(pattern);
    if (match) {
      const bookName = match[1];
      let chapter, verse;

      // Check if chapter/verse are Hebrew numerals or Arabic
      if (/^\d+$/.test(match[2])) {
        // Arabic numerals
        chapter = parseInt(match[2], 10);
        verse = match[3] ? parseInt(match[3], 10) : null;
      } else {
        // Hebrew numerals
        chapter = hebrewToNumber(match[2]);
        verse = match[3] ? hebrewToNumber(match[3]) : null;
      }

      const book = findBookByName(bookIndex, bookName);
      if (book && chapter && chapter > 0 && chapter <= book.chapters) {
        return {
          bookKey: book.key,
          chapter,
          verse
        };
      }
    }
  }

  return null;
}
