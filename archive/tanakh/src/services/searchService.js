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

// Cache for the pre-built search index
let searchIndexCache = null;

/**
 * Load the pre-built search index
 * Loads once and caches in memory for subsequent searches
 *
 * @returns {Promise<Array>} - Array of all verses
 */
async function loadSearchIndex() {
  if (searchIndexCache) {
    return searchIndexCache;
  }

  try {
    // Use PUBLIC_URL to ensure correct path in production (e.g., /tanakh-deploy/data/...)
    const publicUrl = process.env.PUBLIC_URL || '';
    const response = await fetch(`${publicUrl}/data/search-index.json`);
    if (!response.ok) {
      throw new Error(`Failed to load search index: ${response.status}`);
    }

    searchIndexCache = await response.json();
    console.log(`Search index loaded: ${searchIndexCache.length} verses`);
    return searchIndexCache;
  } catch (error) {
    console.error('Error loading search index:', error);
    throw error;
  }
}

/**
 * Convert search index verse format to match expected result format
 */
function formatSearchResult(indexVerse, searchTerm) {
  return {
    bookKey: indexVerse.bookKey,
    bookName: indexVerse.book,
    bookNameHebrew: indexVerse.bookHebrew,
    chapter: indexVerse.chapter,
    verse: indexVerse.verse,
    verseText: indexVerse.text,
    highlightedText: highlightMatch(indexVerse.text, searchTerm)
  };
}

/**
 * Search across all books in the Tanakh using pre-built search index
 *
 * @param {string} searchTerm - The Hebrew text to search for
 * @param {string} searchMode - 'exact' or 'fuzzy'
 * @param {boolean} stripPrefixes - Whether to strip prefix letters
 * @param {Array<string>} bookFilter - Array of book keys to search, or null for all
 * @returns {Promise<Array>} - Array of search results
 */
export async function searchAllBooks(
  searchTerm,
  searchMode,
  stripPrefixes,
  bookFilter
) {
  if (!searchTerm) {
    return [];
  }

  // Load the search index (cached after first load)
  const searchIndex = await loadSearchIndex();

  // Filter by books if specified
  const versesToSearch = bookFilter && bookFilter.length > 0
    ? searchIndex.filter(v => bookFilter.includes(v.bookKey))
    : searchIndex;

  // Convert to format expected by search functions
  const verses = versesToSearch.map(v => ({
    number: v.verse,
    hebrew: v.text
  }));

  // Search verses
  const searchFunc = searchMode === 'fuzzy' ? searchFuzzy : searchExact;
  const matchingVerses = searchFunc(verses, searchTerm, stripPrefixes);

  // Map back to original index verses and format results
  const results = matchingVerses.map(verse => {
    const indexVerse = versesToSearch.find(
      v => v.text === verse.hebrew
    );
    return formatSearchResult(indexVerse, searchTerm);
  });

  // Results are already sorted by order of appearance (books, then chapters, then verses)
  return results;
}
