const fs = require('fs');
const https = require('https');
const path = require('path');

// List of all 24 books of the Tanakh
const books = [
  // Torah
  { english: 'Genesis', hebrew: 'בראשית', sefaria: 'Genesis', chapters: 50 },
  { english: 'Exodus', hebrew: 'שמות', sefaria: 'Exodus', chapters: 40 },
  { english: 'Leviticus', hebrew: 'ויקרא', sefaria: 'Leviticus', chapters: 27 },
  { english: 'Numbers', hebrew: 'במדבר', sefaria: 'Numbers', chapters: 36 },
  { english: 'Deuteronomy', hebrew: 'דברים', sefaria: 'Deuteronomy', chapters: 34 },

  // Nevi'im (Prophets) - Former
  { english: 'Joshua', hebrew: 'יהושע', sefaria: 'Joshua', chapters: 24 },
  { english: 'Judges', hebrew: 'שופטים', sefaria: 'Judges', chapters: 21 },
  { english: 'I Samuel', hebrew: 'שמואל א', sefaria: 'I_Samuel', chapters: 31 },
  { english: 'II Samuel', hebrew: 'שמואל ב', sefaria: 'II_Samuel', chapters: 24 },
  { english: 'I Kings', hebrew: 'מלכים א', sefaria: 'I_Kings', chapters: 22 },
  { english: 'II Kings', hebrew: 'מלכים ב', sefaria: 'II_Kings', chapters: 25 },

  // Nevi'im (Prophets) - Latter
  { english: 'Isaiah', hebrew: 'ישעיהו', sefaria: 'Isaiah', chapters: 66 },
  { english: 'Jeremiah', hebrew: 'ירמיהו', sefaria: 'Jeremiah', chapters: 52 },
  { english: 'Ezekiel', hebrew: 'יחזקאל', sefaria: 'Ezekiel', chapters: 48 },
  { english: 'Hosea', hebrew: 'הושע', sefaria: 'Hosea', chapters: 14 },
  { english: 'Joel', hebrew: 'יואל', sefaria: 'Joel', chapters: 4 },
  { english: 'Amos', hebrew: 'עמוס', sefaria: 'Amos', chapters: 9 },
  { english: 'Obadiah', hebrew: 'עובדיה', sefaria: 'Obadiah', chapters: 1 },
  { english: 'Jonah', hebrew: 'יונה', sefaria: 'Jonah', chapters: 4 },
  { english: 'Micah', hebrew: 'מיכה', sefaria: 'Micah', chapters: 7 },
  { english: 'Nahum', hebrew: 'נחום', sefaria: 'Nahum', chapters: 3 },
  { english: 'Habakkuk', hebrew: 'חבקוק', sefaria: 'Habakkuk', chapters: 3 },
  { english: 'Zephaniah', hebrew: 'צפניה', sefaria: 'Zephaniah', chapters: 3 },
  { english: 'Haggai', hebrew: 'חגי', sefaria: 'Haggai', chapters: 2 },
  { english: 'Zechariah', hebrew: 'זכריה', sefaria: 'Zechariah', chapters: 14 },
  { english: 'Malachi', hebrew: 'מלאכי', sefaria: 'Malachi', chapters: 3 },

  // Ketuvim (Writings)
  { english: 'Psalms', hebrew: 'תהלים', sefaria: 'Psalms', chapters: 150 },
  { english: 'Proverbs', hebrew: 'משלי', sefaria: 'Proverbs', chapters: 31 },
  { english: 'Job', hebrew: 'איוב', sefaria: 'Job', chapters: 42 },
  { english: 'Song of Songs', hebrew: 'שיר השירים', sefaria: 'Song_of_Songs', chapters: 8 },
  { english: 'Ruth', hebrew: 'רות', sefaria: 'Ruth', chapters: 4 },
  { english: 'Lamentations', hebrew: 'איכה', sefaria: 'Lamentations', chapters: 5 },
  { english: 'Ecclesiastes', hebrew: 'קהלת', sefaria: 'Ecclesiastes', chapters: 12 },
  { english: 'Esther', hebrew: 'אסתר', sefaria: 'Esther', chapters: 10 },
  { english: 'Daniel', hebrew: 'דניאל', sefaria: 'Daniel', chapters: 12 },
  { english: 'Ezra', hebrew: 'עזרא', sefaria: 'Ezra', chapters: 10 },
  { english: 'Nehemiah', hebrew: 'נחמיה', sefaria: 'Nehemiah', chapters: 13 },
  { english: 'I Chronicles', hebrew: 'דברי הימים א', sefaria: 'I_Chronicles', chapters: 29 },
  { english: 'II Chronicles', hebrew: 'דברי הימים ב', sefaria: 'II_Chronicles', chapters: 36 }
];

// Function to extract parsha marker from verse text
// Returns { text: cleaned text, parsha: 'פ' | 'ס' | null }
function extractParsha(text) {
  if (!text) return { text: text, parsha: null };

  let parsha = null;

  // Check for parsha markers in HTML format: <span class="mam-spi-pe">{פ}</span> or {ס}
  const parshaMatch = text.match(/<span class="mam-spi-pe">\{([פס])\}<\/span>/);
  if (parshaMatch) {
    parsha = parshaMatch[1]; // Either 'פ' or 'ס'
  }

  // Remove all HTML tags and clean the text
  let cleanedText = text.replace(/<[^>]*>/g, '');

  // Remove curly braces around parsha markers
  cleanedText = cleanedText.replace(/\{[פס]\}/g, '');

  // Decode HTML entities
  cleanedText = cleanedText
    .replace(/&thinsp;/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"');

  return { text: cleanedText, parsha: parsha };
}

// Function to strip nikud and ta'amim (vowel points and cantillation marks)
function stripNikud(text) {
  if (!text) return text;

  // Remove Hebrew vowel points and cantillation marks
  // Unicode ranges: U+0591-U+05C7
  return text.replace(/[\u0591-\u05C7]/g, '');
}

// Function to fetch data from Sefaria API
function fetchFromSefaria(bookName, chapter) {
  return new Promise((resolve, reject) => {
    const url = `https://www.sefaria.org/api/texts/${bookName}.${chapter}`;

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Delay function to avoid rate limiting
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main function to fetch all books
async function fetchAllBooks() {
  const dataDir = path.join(__dirname, '../public/data');

  // Create data directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  console.log('Starting to fetch Tanakh text from Sefaria...\n');

  for (const book of books) {
    console.log(`Fetching ${book.english} (${book.hebrew})...`);

    const bookDir = path.join(dataDir, book.sefaria.toLowerCase());
    if (!fs.existsSync(bookDir)) {
      fs.mkdirSync(bookDir, { recursive: true });
    }

    for (let chapter = 1; chapter <= book.chapters; chapter++) {
      try {
        const response = await fetchFromSefaria(book.sefaria, chapter);

        // Extract Hebrew text, strip nikud, and extract parsha markers
        const verses = [];
        if (response.he && Array.isArray(response.he)) {
          response.he.forEach((verseText, index) => {
            // Extract parsha marker and clean text
            const { text: cleanedText, parsha } = extractParsha(verseText);

            // Strip nikud from cleaned text
            const hebrewText = stripNikud(cleanedText);

            // Build verse object
            const verse = {
              number: index + 1,
              hebrew: hebrewText
            };

            // Only add parsha field if marker is present
            if (parsha) {
              verse.parsha = parsha;
            }

            verses.push(verse);
          });
        }

        // Create chapter data object
        const chapterData = {
          book: book.english,
          bookHebrew: book.hebrew,
          chapter: chapter,
          verses: verses
        };

        // Save to file
        const filename = path.join(bookDir, `${chapter}.json`);
        fs.writeFileSync(filename, JSON.stringify(chapterData, null, 2), 'utf-8');

        console.log(`  Chapter ${chapter}/${book.chapters} saved`);

        // Add delay to avoid rate limiting (500ms between requests)
        await delay(500);

      } catch (error) {
        console.error(`  Error fetching chapter ${chapter}:`, error.message);
      }
    }

    console.log(`${book.english} complete!\n`);
  }

  // Create an index file with all book information
  const indexData = {
    sections: {
      torah: {
        name: 'Torah',
        hebrewName: 'תורה',
        books: books.slice(0, 5).map(b => ({
          english: b.english,
          hebrew: b.hebrew,
          key: b.sefaria.toLowerCase(),
          chapters: b.chapters
        }))
      },
      prophets: {
        name: 'Prophets',
        hebrewName: 'נביאים',
        books: books.slice(5, 21).map(b => ({
          english: b.english,
          hebrew: b.hebrew,
          key: b.sefaria.toLowerCase(),
          chapters: b.chapters
        }))
      },
      writings: {
        name: 'Writings',
        hebrewName: 'כתובים',
        books: books.slice(21).map(b => ({
          english: b.english,
          hebrew: b.hebrew,
          key: b.sefaria.toLowerCase(),
          chapters: b.chapters
        }))
      }
    }
  };

  fs.writeFileSync(
    path.join(dataDir, 'index.json'),
    JSON.stringify(indexData, null, 2),
    'utf-8'
  );

  console.log('All done! Index file created.');
  console.log(`Total files created: ${books.reduce((sum, b) => sum + b.chapters, 0)} chapters + 1 index`);
}

// Run the script
fetchAllBooks().catch(console.error);
