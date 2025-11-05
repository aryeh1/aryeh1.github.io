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

export async function loadChapter(bookKey, chapterNumber) {
  try {
    const response = await fetch(
      `${process.env.PUBLIC_URL}/data/${bookKey}/${chapterNumber}.json`
    );
    if (!response.ok) {
      throw new Error(`Failed to load ${bookKey} chapter ${chapterNumber}`);
    }
    return await response.json();
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
    /^(.+?)\s+(\d+):(\d+)$/,  // Book Chapter:Verse
    /^(.+?)\s+(\d+)$/,         // Book Chapter
  ];

  for (const pattern of patterns) {
    const match = ref.match(pattern);
    if (match) {
      const bookName = match[1];
      const chapter = parseInt(match[2], 10);
      const verse = match[3] ? parseInt(match[3], 10) : null;

      const book = findBookByName(bookIndex, bookName);
      if (book && chapter > 0 && chapter <= book.chapters) {
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
