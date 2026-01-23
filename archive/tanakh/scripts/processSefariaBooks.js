const fs = require('fs');
const path = require('path');

const books = [
  { file: '/tmp/genesis.json', name: 'Genesis', hebrew: 'בראשית', key: 'genesis' },
  { file: '/tmp/exodus.json', name: 'Exodus', hebrew: 'שמות', key: 'exodus' },
  { file: '/tmp/leviticus.json', name: 'Leviticus', hebrew: 'ויקרא', key: 'leviticus' },
  { file: '/tmp/numbers.json', name: 'Numbers', hebrew: 'במדבר', key: 'numbers' },
  { file: '/tmp/deuteronomy.json', name: 'Deuteronomy', hebrew: 'דברים', key: 'deuteronomy' },

  { file: '/tmp/joshua.json', name: 'Joshua', hebrew: 'יהושע', key: 'joshua' },
  { file: '/tmp/judges.json', name: 'Judges', hebrew: 'שופטים', key: 'judges' },
  { file: '/tmp/i_samuel.json', name: 'I Samuel', hebrew: 'שמואל א', key: 'i_samuel' },
  { file: '/tmp/ii_samuel.json', name: 'II Samuel', hebrew: 'שמואל ב', key: 'ii_samuel' },
  { file: '/tmp/i_kings.json', name: 'I Kings', hebrew: 'מלכים א', key: 'i_kings' },
  { file: '/tmp/ii_kings.json', name: 'II Kings', hebrew: 'מלכים ב', key: 'ii_kings' },

  { file: '/tmp/isaiah.json', name: 'Isaiah', hebrew: 'ישעיהו', key: 'isaiah' },
  { file: '/tmp/jeremiah.json', name: 'Jeremiah', hebrew: 'ירמיהו', key: 'jeremiah' },
  { file: '/tmp/ezekiel.json', name: 'Ezekiel', hebrew: 'יחזקאל', key: 'ezekiel' },
  { file: '/tmp/hosea.json', name: 'Hosea', hebrew: 'הושע', key: 'hosea' },
  { file: '/tmp/joel.json', name: 'Joel', hebrew: 'יואל', key: 'joel' },
  { file: '/tmp/amos.json', name: 'Amos', hebrew: 'עמוס', key: 'amos' },
  { file: '/tmp/obadiah.json', name: 'Obadiah', hebrew: 'עובדיה', key: 'obadiah' },
  { file: '/tmp/jonah.json', name: 'Jonah', hebrew: 'יונה', key: 'jonah' },
  { file: '/tmp/micah.json', name: 'Micah', hebrew: 'מיכה', key: 'micah' },
  { file: '/tmp/nahum.json', name: 'Nahum', hebrew: 'נחום', key: 'nahum' },
  { file: '/tmp/habakkuk.json', name: 'Habakkuk', hebrew: 'חבקוק', key: 'habakkuk' },
  { file: '/tmp/zephaniah.json', name: 'Zephaniah', hebrew: 'צפניה', key: 'zephaniah' },
  { file: '/tmp/haggai.json', name: 'Haggai', hebrew: 'חגי', key: 'haggai' },
  { file: '/tmp/zechariah.json', name: 'Zechariah', hebrew: 'זכריה', key: 'zechariah' },
  { file: '/tmp/malachi.json', name: 'Malachi', hebrew: 'מלאכי', key: 'malachi' },

  { file: '/tmp/psalms.json', name: 'Psalms', hebrew: 'תהלים', key: 'psalms' },
  { file: '/tmp/proverbs.json', name: 'Proverbs', hebrew: 'משלי', key: 'proverbs' },
  { file: '/tmp/job.json', name: 'Job', hebrew: 'איוב', key: 'job' },
  { file: '/tmp/song_of_songs.json', name: 'Song of Songs', hebrew: 'שיר השירים', key: 'song_of_songs' },
  { file: '/tmp/ruth.json', name: 'Ruth', hebrew: 'רות', key: 'ruth' },
  { file: '/tmp/lamentations.json', name: 'Lamentations', hebrew: 'איכה', key: 'lamentations' },
  { file: '/tmp/ecclesiastes.json', name: 'Ecclesiastes', hebrew: 'קהלת', key: 'ecclesiastes' },
  { file: '/tmp/esther.json', name: 'Esther', hebrew: 'אסתר', key: 'esther' },
  { file: '/tmp/daniel.json', name: 'Daniel', hebrew: 'דניאל', key: 'daniel' },
  { file: '/tmp/ezra.json', name: 'Ezra', hebrew: 'עזרא', key: 'ezra' },
  { file: '/tmp/nehemiah.json', name: 'Nehemiah', hebrew: 'נחמיה', key: 'nehemiah' },
  { file: '/tmp/i_chronicles.json', name: 'I Chronicles', hebrew: 'דברי הימים א', key: 'i_chronicles' },
  { file: '/tmp/ii_chronicles.json', name: 'II Chronicles', hebrew: 'דברי הימים ב', key: 'ii_chronicles' }
];

const dataDir = path.join(__dirname, '../public/data');

console.log('Processing Bible books...\n');

books.forEach(book => {
  try {
    if (!fs.existsSync(book.file)) {
      console.log(`✗ ${book.name}: File not found`);
      return;
    }

    const data = JSON.parse(fs.readFileSync(book.file, 'utf-8'));

    if (!data || !data.text || !Array.isArray(data.text)) {
      console.log(`✗ ${book.name}: Invalid data structure`);
      return;
    }

    // Create book directory
    const bookDir = path.join(dataDir, book.key);
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

    console.log(`✓ ${book.name} (${data.text.length} chapters)`);

  } catch (error) {
    console.log(`✗ ${book.name}: ${error.message}`);
  }
});

console.log('\n✅ Processing complete!');
console.log(`Total books processed: ${books.length}`);
