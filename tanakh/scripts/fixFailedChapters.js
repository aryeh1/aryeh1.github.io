const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

const failedChapters = [
  { book: 'Genesis', key: 'genesis', sefaria: 'Genesis', chapter: 7 },
  { book: 'Genesis', key: 'genesis', sefaria: 'Genesis', chapter: 13 },
  { book: 'Genesis', key: 'genesis', sefaria: 'Genesis', chapter: 20 }
];

async function fetchSefaria(bookName, chapter) {
  await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
  const url = `https://www.sefaria.org/api/texts/${encodeURIComponent(bookName)}.${chapter}`;
  const { stdout } = await execPromise(`curl -s "${url}"`);
  return JSON.parse(stdout);
}

function extractParshaMarkers(sefariaData) {
  const markers = [];
  if (!sefariaData.he || !Array.isArray(sefariaData.he)) {
    return markers;
  }
  sefariaData.he.forEach((hebrewText, index) => {
    const verseNum = index + 1;
    if (hebrewText.includes('mam-spi-pe')) {
      markers.push({ verse: verseNum, marker: 'פ' });
    } else if (hebrewText.includes('mam-spi-samekh')) {
      markers.push({ verse: verseNum, marker: 'ס' });
    }
  });
  return markers;
}

async function updateChapterWithMarkers(bookKey, chapter, markers) {
  const filePath = path.join(__dirname, '../public/data', bookKey, `${chapter}.json`);
  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠ File not found: ${filePath}`);
    return;
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  for (const marker of markers) {
    const verse = data.verses.find(v => v.number === marker.verse);
    if (verse) {
      verse.parsha = marker.marker;
    }
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function fixFailedChapters() {
  console.log('Fixing failed chapters...\n');
  for (const chapter of failedChapters) {
    try {
      const data = await fetchSefaria(chapter.sefaria, chapter.chapter);
      const markers = extractParshaMarkers(data);
      if (markers.length > 0) {
        await updateChapterWithMarkers(chapter.key, chapter.chapter, markers);
        console.log(`  ✓ ${chapter.book} ${chapter.chapter}: ${markers.length} markers`);
      } else {
        console.log(`  ⚠ ${chapter.book} ${chapter.chapter}: No markers found`);
      }
    } catch (error) {
      console.error(`  ✗ Error in ${chapter.book} ${chapter.chapter}:`, error.message);
    }
  }
  console.log('\n✅ Done!');
}

fixFailedChapters().catch(console.error);
