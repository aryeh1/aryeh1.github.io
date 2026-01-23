const fs = require('fs');
const https = require('https');
const path = require('path');

// All 24 books of Tanakh with their Mechon Mamre codes
const books = [
  { english: 'Genesis', key: 'genesis', code: '01', chapters: 50 },
  { english: 'Exodus', key: 'exodus', code: '02', chapters: 40 },
  { english: 'Leviticus', key: 'leviticus', code: '03', chapters: 27 },
  { english: 'Numbers', key: 'numbers', code: '04', chapters: 36 },
  { english: 'Deuteronomy', key: 'deuteronomy', code: '05', chapters: 34 },
  { english: 'Joshua', key: 'joshua', code: '06', chapters: 24 },
  { english: 'Judges', key: 'judges', code: '07', chapters: 21 },
  { english: 'I Samuel', key: 'i_samuel', code: '08a', chapters: 31 },
  { english: 'II Samuel', key: 'ii_samuel', code: '08b', chapters: 24 },
  { english: 'I Kings', key: 'i_kings', code: '09a', chapters: 22 },
  { english: 'II Kings', key: 'ii_kings', code: '09b', chapters: 25 },
  { english: 'Isaiah', key: 'isaiah', code: '10', chapters: 66 },
  { english: 'Jeremiah', key: 'jeremiah', code: '11', chapters: 52 },
  { english: 'Ezekiel', key: 'ezekiel', code: '12', chapters: 48 },
  { english: 'Hosea', key: 'hosea', code: '13', chapters: 14 },
  { english: 'Joel', key: 'joel', code: '14', chapters: 4 },
  { english: 'Amos', key: 'amos', code: '15', chapters: 9 },
  { english: 'Obadiah', key: 'obadiah', code: '16', chapters: 1 },
  { english: 'Jonah', key: 'jonah', code: '17', chapters: 4 },
  { english: 'Micah', key: 'micah', code: '18', chapters: 7 },
  { english: 'Nahum', key: 'nahum', code: '19', chapters: 3 },
  { english: 'Habakkuk', key: 'habakkuk', code: '20', chapters: 3 },
  { english: 'Zephaniah', key: 'zephaniah', code: '21', chapters: 3 },
  { english: 'Haggai', key: 'haggai', code: '22', chapters: 2 },
  { english: 'Zechariah', key: 'zechariah', code: '23', chapters: 14 },
  { english: 'Malachi', key: 'malachi', code: '24', chapters: 3 },
  { english: 'Psalms', key: 'psalms', code: '26', chapters: 150 },
  { english: 'Proverbs', key: 'proverbs', code: '27', chapters: 31 },
  { english: 'Job', key: 'job', code: '28', chapters: 42 },
  { english: 'Song of Songs', key: 'song_of_songs', code: '29', chapters: 8 },
  { english: 'Ruth', key: 'ruth', code: '30', chapters: 4 },
  { english: 'Lamentations', key: 'lamentations', code: '31', chapters: 5 },
  { english: 'Ecclesiastes', key: 'ecclesiastes', code: '32', chapters: 12 },
  { english: 'Esther', key: 'esther', code: '33', chapters: 10 },
  { english: 'Daniel', key: 'daniel', code: '34', chapters: 12 },
  { english: 'Ezra', key: 'ezra', code: '35a', chapters: 10 },
  { english: 'Nehemiah', key: 'nehemiah', code: '35b', chapters: 13 },
  { english: 'I Chronicles', key: 'i_chronicles', code: '25a', chapters: 29 },
  { english: 'II Chronicles', key: 'ii_chronicles', code: '25b', chapters: 36 }
];

function fetchMechonMamre(bookCode, chapter) {
  return new Promise((resolve, reject) => {
    const chapterPad = chapter.toString().padStart(2, '0');
    const url = `https://mechon-mamre.org/p/pt/pt${bookCode}${chapterPad}.htm`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractParshaMarkers(html) {
  const markers = [];
  // Look for {P} and {S} markers in the HTML
  const lines = html.split('\n');

  for (const line of lines) {
    // Match verse numbers and markers
    const verseMatch = line.match(/<B>(\d+)<\/B>/);
    if (verseMatch) {
      const verseNum = parseInt(verseMatch[1]);

      // Check for {P} marker
      if (line.includes('{P}')) {
        markers.push({ verse: verseNum, marker: 'פ' });
      }
      // Check for {S} marker
      else if (line.includes('{S}')) {
        markers.push({ verse: verseNum, marker: 'ס' });
      }
    }
  }

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
  console.log('Starting parsha marker extraction from Mechon Mamre...\n');

  let totalChapters = 0;
  let totalMarkers = 0;

  for (const book of books) {
    console.log(`Processing ${book.english} (${book.chapters} chapters)...`);

    for (let chapter = 1; chapter <= book.chapters; chapter++) {
      try {
        const html = await fetchMechonMamre(book.code, chapter);
        const markers = extractParshaMarkers(html);

        if (markers.length > 0) {
          await updateChapterWithMarkers(book.key, chapter, markers);
          totalMarkers += markers.length;
          console.log(`  ✓ ${book.english} ${chapter}: ${markers.length} markers`);
        }

        totalChapters++;

        // Delay to avoid overwhelming the server
        await delay(200);

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
