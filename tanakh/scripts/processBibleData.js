const fs = require('fs');
const path = require('path');

// Hebrew letter to number conversion (basic)
const hebrewLetterValues = {
  'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
  'י': 10, 'כ': 20, 'ל': 30, 'מ': 40, 'נ': 50, 'ס': 60, 'ע': 70, 'פ': 80, 'צ': 90,
  'ק': 100, 'ר': 200, 'ש': 300, 'ת': 400
};

function convertHebrewNumber(hebNum) {
  if (!hebNum || typeof hebNum !== 'string') return 1;

  // If it's a simple number, return it
  if (/^\d+$/.test(hebNum)) return parseInt(hebNum, 10);

  // Handle compound Hebrew numbers (add up letter values)
  let total = 0;
  for (let char of hebNum) {
    total += (hebrewLetterValues[char] || 0);
  }
  return total || 1;
}

function parseBookAndChapter(book, chapterStr) {
  // Some books use format: "אא" where first letter = book part, second = chapter
  // For single books like Genesis, it's just "א", "ב", etc.

  // Books that are split: שמואל, מלכים, דברי הימים
  if (['שמואל', 'מלכים', 'דברי הימים'].includes(book) && chapterStr.length === 2) {
    const bookPart = convertHebrewNumber(chapterStr[0]); // 1 or 2
    const chapter = convertHebrewNumber(chapterStr[1]);
    return { bookPart, chapter };
  }

  // Regular books - just convert the chapter number
  return { bookPart: 1, chapter: convertHebrewNumber(chapterStr) };
}

// Book mapping with chapter counts and English names
const bookMapping = {
  'בראשית': { english: 'Genesis', hebrew: 'בראשית', key: 'genesis', chapters: 50 },
  'שמות': { english: 'Exodus', hebrew: 'שמות', key: 'exodus', chapters: 40 },
  'ויקרא': { english: 'Leviticus', hebrew: 'ויקרא', key: 'leviticus', chapters: 27 },
  'במדבר': { english: 'Numbers', hebrew: 'במדבר', key: 'numbers', chapters: 36 },
  'דברים': { english: 'Deuteronomy', hebrew: 'דברים', key: 'deuteronomy', chapters: 34 },

  'יהושוע': { english: 'Joshua', hebrew: 'יהושע', key: 'joshua', chapters: 24 },
  'שופטים': { english: 'Judges', hebrew: 'שופטים', key: 'judges', chapters: 21 },
  'שמואל1': { english: 'I Samuel', hebrew: 'שמואל א', key: 'i_samuel', chapters: 31 },
  'שמואל2': { english: 'II Samuel', hebrew: 'שמואל ב', key: 'ii_samuel', chapters: 24 },
  'מלכים1': { english: 'I Kings', hebrew: 'מלכים א', key: 'i_kings', chapters: 22 },
  'מלכים2': { english: 'II Kings', hebrew: 'מלכים ב', key: 'ii_kings', chapters: 25 },

  'ישעיהו': { english: 'Isaiah', hebrew: 'ישעיהו', key: 'isaiah', chapters: 66 },
  'ירמיהו': { english: 'Jeremiah', hebrew: 'ירמיהו', key: 'jeremiah', chapters: 52 },
  'יחזקאל': { english: 'Ezekiel', hebrew: 'יחזקאל', key: 'ezekiel', chapters: 48 },
  'הושע': { english: 'Hosea', hebrew: 'הושע', key: 'hosea', chapters: 14 },
  'יואל': { english: 'Joel', hebrew: 'יואל', key: 'joel', chapters: 4 },
  'עמוס': { english: 'Amos', hebrew: 'עמוס', key: 'amos', chapters: 9 },
  'עובדיה': { english: 'Obadiah', hebrew: 'עובדיה', key: 'obadiah', chapters: 1 },
  'יונה': { english: 'Jonah', hebrew: 'יונה', key: 'jonah', chapters: 4 },
  'מיכה': { english: 'Micah', hebrew: 'מיכה', key: 'micah', chapters: 7 },
  'נחום': { english: 'Nahum', hebrew: 'נחום', key: 'nahum', chapters: 3 },
  'חבקוק': { english: 'Habakkuk', hebrew: 'חבקוק', key: 'habakkuk', chapters: 3 },
  'צפניה': { english: 'Zephaniah', hebrew: 'צפניה', key: 'zephaniah', chapters: 3 },
  'חגיי': { english: 'Haggai', hebrew: 'חגי', key: 'haggai', chapters: 2 },
  'זכריה': { english: 'Zechariah', hebrew: 'זכריה', key: 'zechariah', chapters: 14 },
  'מלאכי': { english: 'Malachi', hebrew: 'מלאכי', key: 'malachi', chapters: 3 },

  'תהילים': { english: 'Psalms', hebrew: 'תהלים', key: 'psalms', chapters: 150 },
  'משלי': { english: 'Proverbs', hebrew: 'משלי', key: 'proverbs', chapters: 31 },
  'איוב': { english: 'Job', hebrew: 'איוב', key: 'job', chapters: 42 },
  'שיר השירים': { english: 'Song of Songs', hebrew: 'שיר השירים', key: 'song_of_songs', chapters: 8 },
  'רות': { english: 'Ruth', hebrew: 'רות', key: 'ruth', chapters: 4 },
  'איכה': { english: 'Lamentations', hebrew: 'איכה', key: 'lamentations', chapters: 5 },
  'קוהלת': { english: 'Ecclesiastes', hebrew: 'קהלת', key: 'ecclesiastes', chapters: 12 },
  'אסתר': { english: 'Esther', hebrew: 'אסתר', key: 'esther', chapters: 10 },
  'דנייאל': { english: 'Daniel', hebrew: 'דניאל', key: 'daniel', chapters: 12 },
  'עזרא': { english: 'Ezra', hebrew: 'עזרא', key: 'ezra', chapters: 10 },
  'נחמיה1': { english: 'Nehemiah', hebrew: 'נחמיה', key: 'nehemiah', chapters: 13 },
  'דברי הימים1': { english: 'I Chronicles', hebrew: 'דברי הימים א', key: 'i_chronicles', chapters: 29 },
  'דברי הימים2': { english: 'II Chronicles', hebrew: 'דברי הימים ב', key: 'ii_chronicles', chapters: 36 }
};

function processData() {
  console.log('Loading Hebrew Bible JSON...');
  const rawData = JSON.parse(fs.readFileSync('/tmp/hebrewBible.json', 'utf-8'));

  console.log(`Total verses: ${rawData.length}`);

  // Group by book, then by chapter
  const bookData = {};

  rawData.forEach(verse => {
    let bookName = verse.book;
    const { bookPart, chapter } = parseBookAndChapter(bookName, verse.chapter);

    // Handle split books - add book part to the name
    if (bookName === 'שמואל') {
      bookName = `שמואל${bookPart}`;
    } else if (bookName === 'מלכים') {
      bookName = `מלכים${bookPart}`;
    } else if (bookName === 'דברי הימים') {
      bookName = `דברי הימים${bookPart}`;
    } else if (bookName === 'עזרא / נחמיה') {
      // This is combined - check chapter to split
      if (chapter <= 10) {
        bookName = 'עזרא';
      } else {
        bookName = 'נחמיה1';
      }
    }

    const bookInfo = bookMapping[bookName];
    if (!bookInfo) {
      console.log(`Unknown book: ${bookName}`);
      return;
    }

    const bookKey = bookInfo.key;

    if (!bookData[bookKey]) {
      bookData[bookKey] = {
        info: bookInfo,
        chapters: {}
      };
    }

    // For Ezra/Nehemiah, adjust chapter if it's Nehemiah
    let adjustedChapter = chapter;
    if (bookName === 'נחמיה1') {
      adjustedChapter = chapter - 10;
    }

    if (!bookData[bookKey].chapters[adjustedChapter]) {
      bookData[bookKey].chapters[adjustedChapter] = [];
    }

    bookData[bookKey].chapters[adjustedChapter].push({
      number: convertHebrewNumber(verse.verse),
      hebrew: verse.content
    });
  });

  // Create directory structure and save files
  const dataDir = path.join(__dirname, '../public/data');

  console.log('\nCreating JSON files...');

  Object.entries(bookData).forEach(([bookKey, data]) => {
    const bookDir = path.join(dataDir, bookKey);
    if (!fs.existsSync(bookDir)) {
      fs.mkdirSync(bookDir, { recursive: true });
    }

    const chapterCount = Object.keys(data.chapters).length;

    Object.entries(data.chapters).forEach(([chapterNum, verses]) => {
      const chapterData = {
        book: data.info.english,
        bookHebrew: data.info.hebrew,
        chapter: parseInt(chapterNum, 10),
        verses: verses.sort((a, b) => a.number - b.number)
      };

      const filename = path.join(bookDir, `${chapterNum}.json`);
      fs.writeFileSync(filename, JSON.stringify(chapterData, null, 2), 'utf-8');
    });

    console.log(`✓ ${data.info.english} (${chapterCount} chapters)`);
  });

  console.log('\nComplete! All books processed.');
  console.log(`Total books: ${Object.keys(bookData).length}`);
}

processData();
