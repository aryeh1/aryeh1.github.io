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
 * Strip nikud from Hebrew text (for display purposes)
 * Preserves maqaf (U+05BE) which is a hyphen used in Hebrew
 */
export function stripNikud(text) {
  if (!text) return text;
  // Remove Hebrew vowel points and cantillation marks
  // Exclude maqaf (U+05BE) by splitting the range
  return text.replace(/[\u0591-\u05BD\u05BF-\u05C7]/g, '');
}
