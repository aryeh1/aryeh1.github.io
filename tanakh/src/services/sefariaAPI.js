/**
 * Service for fetching commentaries from Sefaria API
 */

const SEFARIA_API_BASE = 'https://www.sefaria.org/api';

/**
 * Map book names to Sefaria API format
 * Some books need special formatting for the API
 */
function mapBookNameForSefaria(bookName) {
  const bookMap = {
    'I Samuel': 'I_Samuel',
    'II Samuel': 'II_Samuel',
    'I Kings': 'I_Kings',
    'II Kings': 'II_Kings',
    'I Chronicles': 'I_Chronicles',
    'II Chronicles': 'II_Chronicles',
    'Song of Songs': 'Song_of_Songs'
  };

  return bookMap[bookName] || bookName.replace(/ /g, '_');
}

/**
 * Fetch Rashi commentary for a specific verse
 * @param {string} bookName - English book name (e.g., "Genesis")
 * @param {number} chapter - Chapter number
 * @param {number} verse - Verse number
 */
export async function fetchRashiCommentary(bookName, chapter, verse) {
  try {
    const sefariaBookName = mapBookNameForSefaria(bookName);
    const url = `${SEFARIA_API_BASE}/texts/Rashi_on_${sefariaBookName}.${chapter}.${verse}`;

    console.log('Fetching Rashi commentary from:', url);
    const response = await fetch(url);

    if (!response.ok) {
      console.error('Sefaria API error:', response.status, response.statusText);
      throw new Error('Failed to fetch Rashi commentary');
    }

    const data = await response.json();

    // Check if we actually got commentary text
    if (!data.he && !data.text) {
      console.warn('No commentary found for', bookName, chapter, verse);
      return null;
    }

    return {
      text: data.he || data.text,
      english: data.text,
      hebrew: data.he,
      ref: data.ref
    };
  } catch (error) {
    console.error('Error fetching Rashi commentary:', error);
    return null;
  }
}

/**
 * Fetch Ibn Ezra commentary
 */
export async function fetchIbnEzraCommentary(bookName, chapter, verse) {
  try {
    const url = `${SEFARIA_API_BASE}/texts/Ibn_Ezra_on_${bookName}.${chapter}.${verse}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch Ibn Ezra commentary');
    }

    const data = await response.json();
    return {
      text: data.he || data.text,
      english: data.text,
      hebrew: data.he,
      ref: data.ref
    };
  } catch (error) {
    console.error('Error fetching Ibn Ezra commentary:', error);
    return null;
  }
}

/**
 * Fetch available commentaries for a verse
 */
export async function fetchAvailableCommentaries(bookName, chapter, verse) {
  const commentaries = [];

  const rashi = await fetchRashiCommentary(bookName, chapter, verse);
  if (rashi) {
    commentaries.push({ name: 'Rashi', nameHebrew: 'רש"י', ...rashi });
  }

  const ibnEzra = await fetchIbnEzraCommentary(bookName, chapter, verse);
  if (ibnEzra) {
    commentaries.push({ name: 'Ibn Ezra', nameHebrew: 'אבן עזרא', ...ibnEzra });
  }

  return commentaries;
}

/**
 * Check if Rashi commentary exists for a specific verse
 * This is a lightweight check that doesn't fetch the full commentary
 * @param {string} bookName - English book name (e.g., "Genesis")
 * @param {number} chapter - Chapter number
 * @param {number} verse - Verse number
 * @returns {Promise<boolean>} - True if commentary exists, false otherwise
 */
export async function hasRashiCommentary(bookName, chapter, verse) {
  try {
    const sefariaBookName = mapBookNameForSefaria(bookName);
    const url = `${SEFARIA_API_BASE}/texts/Rashi_on_${sefariaBookName}.${chapter}.${verse}`;

    const response = await fetch(url);

    if (!response.ok) {
      return false;
    }

    const data = await response.json();

    // Check if we actually got commentary text
    return !!(data.he || data.text);
  } catch (error) {
    console.error('Error checking Rashi commentary:', error);
    return false;
  }
}

/**
 * Check Rashi availability for all verses in a chapter
 * @param {string} bookName - English book name
 * @param {number} chapter - Chapter number
 * @param {number[]} verseNumbers - Array of verse numbers to check
 * @returns {Promise<Set<number>>} - Set of verse numbers that have Rashi commentary
 */
export async function checkRashiAvailability(bookName, chapter, verseNumbers) {
  const availabilityPromises = verseNumbers.map(async (verseNum) => {
    const hasRashi = await hasRashiCommentary(bookName, chapter, verseNum);
    return hasRashi ? verseNum : null;
  });

  const results = await Promise.all(availabilityPromises);
  return new Set(results.filter(v => v !== null));
}

/**
 * Strip nikud from Hebrew text (for display purposes)
 * Preserves maqaf (U+05BE) which is a hyphen used in Hebrew
 * Handles both strings and arrays (from Sefaria API)
 */
export function stripNikud(text) {
  if (!text) return text;

  // Handle arrays (Sefaria API returns arrays for commentary)
  if (Array.isArray(text)) {
    return text.map(item => stripNikud(item)).join('\n\n');
  }

  // Handle strings
  if (typeof text === 'string') {
    // Remove Hebrew vowel points and cantillation marks
    // Exclude maqaf (U+05BE) by splitting the range
    // Also strip HTML tags for clean display
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[\u0591-\u05BD\u05BF-\u05C7]/g, ''); // Remove nikud
  }

  return text;
}
