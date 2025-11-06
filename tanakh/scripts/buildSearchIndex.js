#!/usr/bin/env node

/**
 * Build Search Index
 *
 * This script reads all 929 chapter JSON files from the Tanakh
 * and consolidates them into a single search index file for
 * faster full-text search performance.
 */

const fs = require('fs');
const path = require('path');

// Paths
const DATA_DIR = path.join(__dirname, '../public/data');
const INDEX_FILE = path.join(DATA_DIR, 'index.json');
const OUTPUT_FILE = path.join(DATA_DIR, 'search-index.json');

/**
 * Read and parse a JSON file
 */
function readJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Get all books from the index
 */
function getAllBooks(bookIndex) {
  const allBooks = [];

  if (!bookIndex || !bookIndex.sections) {
    throw new Error('Invalid book index structure');
  }

  Object.values(bookIndex.sections).forEach(section => {
    if (section.books) {
      allBooks.push(...section.books);
    }
  });

  return allBooks;
}

/**
 * Build the search index
 */
function buildSearchIndex() {
  console.log('Building search index...\n');

  // Read the book index
  const bookIndex = readJSON(INDEX_FILE);
  if (!bookIndex) {
    throw new Error('Failed to read book index');
  }

  const allBooks = getAllBooks(bookIndex);
  console.log(`Found ${allBooks.length} books to process`);

  const searchIndex = [];
  let totalChapters = 0;
  let totalVerses = 0;
  let errors = 0;

  // Process each book
  for (const book of allBooks) {
    console.log(`Processing ${book.english} (${book.key})...`);

    // Process each chapter in the book
    for (let chapterNum = 1; chapterNum <= book.chapters; chapterNum++) {
      const chapterFile = path.join(DATA_DIR, book.key, `${chapterNum}.json`);
      const chapterData = readJSON(chapterFile);

      if (!chapterData || !chapterData.verses) {
        console.error(`  ✗ Failed to load chapter ${chapterNum}`);
        errors++;
        continue;
      }

      totalChapters++;

      // Add each verse to the search index
      for (const verse of chapterData.verses) {
        searchIndex.push({
          book: book.english,
          bookKey: book.key,
          bookHebrew: book.hebrew,
          chapter: chapterNum,
          verse: verse.number,
          text: verse.hebrew
        });
        totalVerses++;
      }
    }

    console.log(`  ✓ Completed ${book.chapters} chapters`);
  }

  // Write the search index to file
  console.log(`\nWriting search index to ${OUTPUT_FILE}...`);

  try {
    fs.writeFileSync(
      OUTPUT_FILE,
      JSON.stringify(searchIndex, null, 2),
      'utf8'
    );
    console.log('✓ Search index created successfully!\n');
  } catch (error) {
    console.error('✗ Failed to write search index:', error.message);
    process.exit(1);
  }

  // Print summary
  console.log('Summary:');
  console.log(`  Books: ${allBooks.length}`);
  console.log(`  Chapters: ${totalChapters}`);
  console.log(`  Verses: ${totalVerses}`);
  if (errors > 0) {
    console.log(`  Errors: ${errors}`);
  }
  console.log(`  Output: ${OUTPUT_FILE}`);

  // Calculate file size
  const stats = fs.statSync(OUTPUT_FILE);
  const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`  File size: ${fileSizeMB} MB`);

  console.log('\n✓ Build complete!');
}

// Run the script
try {
  buildSearchIndex();
} catch (error) {
  console.error('\n✗ Build failed:', error.message);
  process.exit(1);
}
