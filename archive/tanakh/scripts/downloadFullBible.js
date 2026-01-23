const fs = require('fs');
const path = require('path');
const https = require('https');

// All 39 books organized by section
const books = {
  torah: [
    { name: 'Genesis', hebrew: 'בראשית', key: 'genesis', path: 'Torah/Genesis', chapters: 50 },
    { name: 'Exodus', hebrew: 'שמות', key: 'exodus', path: 'Torah/Exodus', chapters: 40 },
    { name: 'Leviticus', hebrew: 'ויקרא', key: 'leviticus', path: 'Torah/Leviticus', chapters: 27 },
    { name: 'Numbers', hebrew: 'במדבר', key: 'numbers', path: 'Torah/Numbers', chapters: 36 },
    { name: 'Deuteronomy', hebrew: 'דברים', key: 'deuteronomy', path: 'Torah/Deuteronomy', chapters: 34 }
  ],
  prophets: [
    { name: 'Joshua', hebrew: 'יהושע', key: 'joshua', path: 'Prophets/Joshua', chapters: 24 },
    { name: 'Judges', hebrew: 'שופטים', key: 'judges', path: 'Prophets/Judges', chapters: 21 },
    { name: 'I Samuel', hebrew: 'שמואל א', key: 'i_samuel', path: 'Prophets/I%20Samuel', chapters: 31 },
    { name: 'II Samuel', hebrew: 'שמואל ב', key: 'ii_samuel', path: 'Prophets/II%20Samuel', chapters: 24 },
    { name: 'I Kings', hebrew: 'מלכים א', key: 'i_kings', path: 'Prophets/I%20Kings', chapters: 22 },
    { name: 'II Kings', hebrew: 'מלכים ב', key: 'ii_kings', path: 'Prophets/II%20Kings', chapters: 25 },
    { name: 'Isaiah', hebrew: 'ישעיהו', key: 'isaiah', path: 'Prophets/Isaiah', chapters: 66 },
    { name: 'Jeremiah', hebrew: 'ירמיהו', key: 'jeremiah', path: 'Prophets/Jeremiah', chapters: 52 },
    { name: 'Ezekiel', hebrew: 'יחזקאל', key: 'ezekiel', path: 'Prophets/Ezekiel', chapters: 48 },
    { name: 'Hosea', hebrew: 'הושע', key: 'hosea', path: 'Prophets/Hosea', chapters: 14 },
    { name: 'Joel', hebrew: 'יואל', key: 'joel', path: 'Prophets/Joel', chapters: 4 },
    { name: 'Amos', hebrew: 'עמוס', key: 'amos', path: 'Prophets/Amos', chapters: 9 },
    { name: 'Obadiah', hebrew: 'עובדיה', key: 'obadiah', path: 'Prophets/Obadiah', chapters: 1 },
    { name: 'Jonah', hebrew: 'יונה', key: 'jonah', path: 'Prophets/Jonah', chapters: 4 },
    { name: 'Micah', hebrew: 'מיכה', key: 'micah', path: 'Prophets/Micah', chapters: 7 },
    { name: 'Nahum', hebrew: 'נחום', key: 'nahum', path: 'Prophets/Nahum', chapters: 3 },
    { name: 'Habakkuk', hebrew: 'חבקוק', key: 'habakkuk', path: 'Prophets/Habakkuk', chapters: 3 },
    { name: 'Zephaniah', hebrew: 'צפניה', key: 'zephaniah', path: 'Prophets/Zephaniah', chapters: 3 },
    { name: 'Haggai', hebrew: 'חגי', key: 'haggai', path: 'Prophets/Haggai', chapters: 2 },
    { name: 'Zechariah', hebrew: 'זכריה', key: 'zechariah', path: 'Prophets/Zechariah', chapters: 14 },
    { name: 'Malachi', hebrew: 'מלאכי', key: 'malachi', path: 'Prophets/Malachi', chapters: 3 }
  ],
  writings: [
    { name: 'Psalms', hebrew: 'תהלים', key: 'psalms', path: 'Writings/Psalms', chapters: 150 },
    { name: 'Proverbs', hebrew: 'משלי', key: 'proverbs', path: 'Writings/Proverbs', chapters: 31 },
    { name: 'Job', hebrew: 'איוב', key: 'job', path: 'Writings/Job', chapters: 42 },
    { name: 'Song of Songs', hebrew: 'שיר השירים', key: 'song_of_songs', path: 'Writings/Song%20of%20Songs', chapters: 8 },
    { name: 'Ruth', hebrew: 'רות', key: 'ruth', path: 'Writings/Ruth', chapters: 4 },
    { name: 'Lamentations', hebrew: 'איכה', key: 'lamentations', path: 'Writings/Lamentations', chapters: 5 },
    { name: 'Ecclesiastes', hebrew: 'קהלת', key: 'ecclesiastes', path: 'Writings/Ecclesiastes', chapters: 12 },
    { name: 'Esther', hebrew: 'אסתר', key: 'esther', path: 'Writings/Esther', chapters: 10 },
    { name: 'Daniel', hebrew: 'דניאל', key: 'daniel', path: 'Writings/Daniel', chapters: 12 },
    { name: 'Ezra', hebrew: 'עזרא', key: 'ezra', path: 'Writings/Ezra', chapters: 10 },
    { name: 'Nehemiah', hebrew: 'נחמיה', key: 'nehemiah', path: 'Writings/Nehemiah', chapters: 13 },
    { name: 'I Chronicles', hebrew: 'דברי הימים א', key: 'i_chronicles', path: 'Writings/I%20Chronicles', chapters: 29 },
    { name: 'II Chronicles', hebrew: 'דברי הימים ב', key: 'ii_chronicles', path: 'Writings/II%20Chronicles', chapters: 36 }
  ]
};

const BASE_URL = 'https://raw.githubusercontent.com/TorahBibleCodes/Sefaria-Export/master/json/Tanakh';

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function downloadAndProcessBook(book) {
  const url = `${BASE_URL}/${book.path}/Hebrew/Tanach%20with%20Text%20Only.json`;

  console.log(`Downloading ${book.name}...`);

  try {
    const data = await fetchJSON(url);

    if (!data || !data.text || !Array.isArray(data.text)) {
      console.error(`  ✗ ${book.name}: Invalid data structure`);
      return;
    }

    // Create book directory
    const bookDir = path.join(__dirname, '../public/data', book.key);
    if (!fs.existsSync(bookDir)) {
      fs.mkdirSync(bookDir, { recursive: true });
    }

    // Process each chapter
    data.text.forEach((chapterVerses, chapterIndex) => {
      const chapterNum = chapterIndex + 1;

      const verses = chapterVerses.map((verseText, verseIndex) => ({
        number: verseIndex + 1,
        hebrew: verseText
      }));

      const chapterData = {
        book: book.name,
        bookHebrew: book.hebrew,
        chapter: chapterNum,
        verses: verses
      };

      const filename = path.join(bookDir, `${chapterNum}.json`);
      fs.writeFileSync(filename, JSON.stringify(chapterData, null, 2), 'utf-8');
    });

    console.log(`  ✓ ${book.name} (${data.text.length} chapters)`);

  } catch (error) {
    console.error(`  ✗ ${book.name}: ${error.message}`);
  }
}

async function downloadAll() {
  console.log('Starting download of full Hebrew Bible...\n');

  const allBooks = [...books.torah, ...books.prophets, ...books.writings];

  for (const book of allBooks) {
    await downloadAndProcessBook(book);
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n✅ Download complete!');
  console.log(`Total books: ${allBooks.length}`);
}

downloadAll().catch(console.error);
