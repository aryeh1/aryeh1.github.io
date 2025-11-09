const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

// All 24 books of Tanakh with their Sefaria names
const books = [
  { english: 'Genesis', key: 'genesis', sefaria: 'Genesis', chapters: 50 },
  { english: 'Exodus', key: 'exodus', sefaria: 'Exodus', chapters: 40 },
  { english: 'Leviticus', key: 'leviticus', sefaria: 'Leviticus', chapters: 27 },
  { english: 'Numbers', key: 'numbers', sefaria: 'Numbers', chapters: 36 },
  { english: 'Deuteronomy', key: 'deuteronomy', sefaria: 'Deuteronomy', chapters: 34 },
  { english: 'Joshua', key: 'joshua', sefaria: 'Joshua', chapters: 24 },
  { english: 'Judges', key: 'judges', sefaria: 'Judges', chapters: 21 },
  { english: 'I Samuel', key: 'i_samuel', sefaria: 'I Samuel', chapters: 31 },
  { english: 'II Samuel', key: 'ii_samuel', sefaria: 'II Samuel', chapters: 24 },
  { english: 'I Kings', key: 'i_kings', sefaria: 'I Kings', chapters: 22 },
  { english: 'II Kings', key: 'ii_kings', sefaria: 'II Kings', chapters: 25 },
  { english: 'Isaiah', key: 'isaiah', sefaria: 'Isaiah', chapters: 66 },
  { english: 'Jeremiah', key: 'jeremiah', sefaria: 'Jeremiah', chapters: 52 },
  { english: 'Ezekiel', key: 'ezekiel', sefaria: 'Ezekiel', chapters: 48 },
  { english: 'Hosea', key: 'hosea', sefaria: 'Hosea', chapters: 14 },
  { english: 'Joel', key: 'joel', sefaria: 'Joel', chapters: 4 },
  { english: 'Amos', key: 'amos', sefaria: 'Amos', chapters: 9 },
  { english: 'Obadiah', key: 'obadiah', sefaria: 'Obadiah', chapters: 1 },
  { english: 'Jonah', key: 'jonah', sefaria: 'Jonah', chapters: 4 },
  { english: 'Micah', key: 'micah', sefaria: 'Micah', chapters: 7 },
  { english: 'Nahum', key: 'nahum', sefaria: 'Nahum', chapters: 3 },
  { english: 'Habakkuk', key: 'habakkuk', sefaria: 'Habakkuk', chapters: 3 },
  { english: 'Zephaniah', key: 'zephaniah', sefaria: 'Zephaniah', chapters: 3 },
  { english: 'Haggai', key: 'haggai', sefaria: 'Haggai', chapters: 2 },
  { english: 'Zechariah', key: 'zechariah', sefaria: 'Zechariah', chapters: 14 },
  { english: 'Malachi', key: 'malachi', sefaria: 'Malachi', chapters: 3 },
  { english: 'Psalms', key: 'psalms', sefaria: 'Psalms', chapters: 150 },
  { english: 'Proverbs', key: 'proverbs', sefaria: 'Proverbs', chapters: 31 },
  { english: 'Job', key: 'job', sefaria: 'Job', chapters: 42 },
  { english: 'Song of Songs', key: 'song_of_songs', sefaria: 'Song of Songs', chapters: 8 },
  { english: 'Ruth', key: 'ruth', sefaria: 'Ruth', chapters: 4 },
  { english: 'Lamentations', key: 'lamentations', sefaria: 'Lamentations', chapters: 5 },
  { english: 'Ecclesiastes', key: 'ecclesiastes', sefaria: 'Ecclesiastes', chapters: 12 },
  { english: 'Esther', key: 'esther', sefaria: 'Esther', chapters: 10 },
  { english: 'Daniel', key: 'daniel', sefaria: 'Daniel', chapters: 12 },
  { english: 'Ezra', key: 'ezra', sefaria: 'Ezra', chapters: 10 },
  { english: 'Nehemiah', key: 'nehemiah', sefaria: 'Nehemiah', chapters: 13 },
  { english: 'I Chronicles', key: 'i_chronicles', sefaria: 'I Chronicles', chapters: 29 },
  { english: 'II Chronicles', key: 'ii_chronicles', sefaria: 'II Chronicles', chapters: 36 }
];

async function fetchSefaria(bookName, chapter) {
  const url = `https://www.sefaria.org/api/texts/${encodeURIComponent(bookName)}.${chapter}`;
  const { stdout } = await execPromise(`curl -s "${url}"`);
  return JSON.parse(stdout);
}

function extractParshaMarkers(sefariaData) {
  const markers = [];

  if (!sefariaData.he || !Array.isArray(sefariaData.he)) {
    return markers;
  }

  // Process each verse's Hebrew text
  sefariaData.he.forEach((hebrewText, index) => {
    const verseNum = index + 1;

    // Check for פ marker (pe/petucha)
    if (hebrewText.includes('mam-spi-pe')) {
      markers.push({ verse: verseNum, marker: 'פ' });
    }
    // Check for ס marker (samekh/setuma)
    else if (hebrewText.includes('mam-spi-samekh')) {
      markers.push({ verse: verseNum, marker: 'ס' });
    }
  });

  return markers;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateChapterWithMarkers(bookKey, chapter, markers) {
  const filePath = path.join(__dirname, '../public/data', bookKey, `${chapter}.json`);

  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠ File not found: ${filePath}`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // Add parsha markers to verses
  for (const marker of markers) {
    const verse = data.verses.find(v => v.number === marker.verse);
    if (verse) {
      verse.parsha = marker.marker;
    }
  }

  // Write back
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function processAllBooks() {
  console.log('Starting parsha marker extraction from Sefaria API...\n');

  let totalChapters = 0;
  let totalMarkers = 0;

  for (const book of books) {
    console.log(`Processing ${book.english} (${book.chapters} chapters)...`);

    for (let chapter = 1; chapter <= book.chapters; chapter++) {
      try {
        const data = await fetchSefaria(book.sefaria, chapter);
        const markers = extractParshaMarkers(data);

        if (markers.length > 0) {
          await updateChapterWithMarkers(book.key, chapter, markers);
          totalMarkers += markers.length;
          console.log(`  ✓ ${book.english} ${chapter}: ${markers.length} markers`);
        }

        totalChapters++;

        // Delay to avoid overwhelming the server
        await delay(300);

      } catch (error) {
        console.error(`  ✗ Error in ${book.english} ${chapter}:`, error.message);
      }
    }

    console.log(`✓ ${book.english} complete!\n`);
  }

  console.log(`\n✅ All done!`);
  console.log(`Total chapters processed: ${totalChapters}/929`);
  console.log(`Total parsha markers added: ${totalMarkers}`);
}

processAllBooks().catch(console.error);
