/**
 * Service for full-text search across Tanakh
 */

/**
 * Strip nikud (vowel points) from Hebrew text
 * Preserves maqaf (U+05BE)
 */
export function stripNikudFromText(text) {
  if (!text) return text;
  // Remove Hebrew vowel points and cantillation marks, but preserve maqaf
  return text.replace(/[\u0591-\u05BD\u05BF-\u05C7]/g, '');
}

/**
 * Hebrew prefix letters that can be stripped
 * ו (vav), ה (heh), ב (bet), כ (kaf), ל (lamed), מ (mem), י (yod)
 */
const PREFIX_LETTERS = ['ו', 'ה', 'ב', 'כ', 'ל', 'מ', 'י'];

/**
 * Strip prefix letters from a Hebrew word
 * Strips all consecutive prefix letters from the beginning
 * but always leaves at least one character
 */
export function stripPrefixLetters(word) {
  if (!word || word.length <= 1) return word;

  let result = word;
  let index = 0;

  // Strip consecutive prefix letters, but leave at least one char
  while (index < result.length - 1 && PREFIX_LETTERS.includes(result[index])) {
    index++;
  }

  return result.substring(index);
}

/**
 * Prepare text for searching by stripping nikud
 * Optionally strip prefix letters from each word
 */
function prepareTextForSearch(text, stripPrefixes) {
  if (!text) return '';

  let prepared = stripNikudFromText(text);

  if (stripPrefixes) {
    // Split into words, strip prefixes, rejoin
    const words = prepared.split(/\s+/);
    prepared = words.map(word => stripPrefixLetters(word)).join(' ');
  }

  return prepared;
}

/**
 * Search for exact word matches in verses
 * Returns array of matching verses
 */
export function searchExact(verses, searchTerm, stripPrefixes) {
  if (!verses || !searchTerm) return [];

  const preparedSearch = prepareTextForSearch(searchTerm, stripPrefixes);

  return verses.filter(verse => {
    const preparedVerse = prepareTextForSearch(verse.hebrew, stripPrefixes);

    // Use word boundaries to match whole words only
    // Split by spaces and check if any word matches
    const words = preparedVerse.split(/\s+/);
    const searchWords = preparedSearch.split(/\s+/);

    // Check if any search word matches any verse word
    return searchWords.some(searchWord =>
      words.some(word => word === searchWord)
    );
  });
}

/**
 * Search for fuzzy matches (substring) in verses
 * Returns array of matching verses
 */
export function searchFuzzy(verses, searchTerm, stripPrefixes) {
  if (!verses || !searchTerm) return [];

  const preparedSearch = prepareTextForSearch(searchTerm, stripPrefixes);

  return verses.filter(verse => {
    const preparedVerse = prepareTextForSearch(verse.hebrew, stripPrefixes);
    return preparedVerse.includes(preparedSearch);
  });
}

/**
 * Highlight matched search term in text
 * Returns HTML string with <mark> tags around matches
 */
export function highlightMatch(text, searchTerm) {
  if (!text || !searchTerm) return text;

  // Escape HTML to prevent XSS - replace all HTML tags except what we'll add
  const safeText = text.replace(/<[^>]*>/g, '');

  // Strip nikud from search term for matching
  const preparedSearch = stripNikudFromText(searchTerm);
  const preparedText = stripNikudFromText(safeText);

  // Find all occurrences
  const regex = new RegExp(escapeRegExp(preparedSearch), 'gi');
  const matches = [];
  let match;

  while ((match = regex.exec(preparedText)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length
    });
  }

  if (matches.length === 0) {
    return safeText;
  }

  // Build highlighted text by inserting mark tags
  // Work backwards to preserve indices
  let result = safeText;
  for (let i = matches.length - 1; i >= 0; i--) {
    const { start, end } = matches[i];
    result = result.substring(0, end) + '</mark>' + result.substring(end);
    result = result.substring(0, start) + '<mark>' + result.substring(start);
  }

  return result;
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Get all books from book index
 */
function getAllBooks(bookIndex) {
  if (!bookIndex || !bookIndex.sections) return [];

  const allBooks = [];
  Object.values(bookIndex.sections).forEach(section => {
    if (section.books) {
      allBooks.push(...section.books);
    }
  });
  return allBooks;
}

/**
 * Search across all books in the Tanakh
 *
 * @param {string} searchTerm - The Hebrew text to search for
 * @param {string} searchMode - 'exact' or 'fuzzy'
 * @param {boolean} stripPrefixes - Whether to strip prefix letters
 * @param {Array<string>} bookFilter - Array of book keys to search, or null for all
 * @param {Object} bookIndex - The book index object
 * @param {Function} loadChapterFunc - Function to load chapter data (bookKey, chapterNum)
 * @returns {Promise<Array>} - Array of search results
 */
export async function searchAllBooks(
  searchTerm,
  searchMode,
  stripPrefixes,
  bookFilter,
  bookIndex,
  loadChapterFunc
) {
  if (!searchTerm || !bookIndex || !loadChapterFunc) {
    return [];
  }

  const allBooks = getAllBooks(bookIndex);
  const booksToSearch = bookFilter && bookFilter.length > 0
    ? allBooks.filter(book => bookFilter.includes(book.key))
    : allBooks;

  const results = [];

  // Search each book
  for (const book of booksToSearch) {
    // Search each chapter in the book
    for (let chapterNum = 1; chapterNum <= book.chapters; chapterNum++) {
      try {
        const chapterData = await loadChapterFunc(book.key, chapterNum);

        // Search verses in chapter
        const searchFunc = searchMode === 'fuzzy' ? searchFuzzy : searchExact;
        const matchingVerses = searchFunc(chapterData.verses, searchTerm, stripPrefixes);

        // Add results
        for (const verse of matchingVerses) {
          results.push({
            bookKey: book.key,
            bookName: book.english,
            bookNameHebrew: book.hebrew,
            chapter: chapterNum,
            verse: verse.number,
            verseText: verse.hebrew,
            highlightedText: highlightMatch(verse.hebrew, searchTerm)
          });
        }
      } catch (error) {
        // Skip chapters that fail to load
        console.warn(`Failed to load ${book.key} chapter ${chapterNum}:`, error);
      }
    }
  }

  // Results are already sorted by order of appearance (books, then chapters, then verses)
  return results;
}
