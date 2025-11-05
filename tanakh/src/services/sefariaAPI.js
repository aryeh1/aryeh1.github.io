/**
 * Service for fetching commentaries from Sefaria API
 */

const SEFARIA_API_BASE = 'https://www.sefaria.org/api';

/**
 * Fetch Rashi commentary for a specific verse
 * @param {string} bookName - English book name (e.g., "Genesis")
 * @param {number} chapter - Chapter number
 * @param {number} verse - Verse number
 */
export async function fetchRashiCommentary(bookName, chapter, verse) {
  try {
    const url = `${SEFARIA_API_BASE}/texts/Rashi_on_${bookName}.${chapter}.${verse}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch Rashi commentary');
    }

    const data = await response.json();
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
 */
export function stripNikud(text) {
  if (!text) return text;
  // Remove Hebrew vowel points and cantillation marks
  return text.replace(/[\u0591-\u05C7]/g, '');
}
