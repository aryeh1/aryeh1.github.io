#!/bin/bash

# Fetch Bible text from Sefaria API using curl and process with Node.js

# Create a simple Node.js processor script
cat > /tmp/process_parsha.js << 'EOF'
const fs = require('fs');

// Function to extract parsha marker from verse text
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

// Function to strip nikud
function stripNikud(text) {
  if (!text) return text;
  return text.replace(/[\u0591-\u05C7]/g, '');
}

// Read from stdin
const input = process.argv[2];
const bookName = process.argv[3];
const bookHebrew = process.argv[4];
const chapterNum = parseInt(process.argv[5]);

const data = JSON.parse(input);

const verses = [];
if (data.he && Array.isArray(data.he)) {
  data.he.forEach((verseText, index) => {
    const { text: cleanedText, parsha } = extractParsha(verseText);
    const hebrewText = stripNikud(cleanedText);

    const verse = {
      number: index + 1,
      hebrew: hebrewText
    };

    if (parsha) {
      verse.parsha = parsha;
    }

    verses.push(verse);
  });
}

const chapterData = {
  book: bookName,
  bookHebrew: bookHebrew,
  chapter: chapterNum,
  verses: verses
};

console.log(JSON.stringify(chapterData, null, 2));
EOF

# Books array (name, hebrew, sefaria_name, chapters)
declare -a BOOKS=(
  "Genesis:בראשית:Genesis:50"
  "Exodus:שמות:Exodus:40"
  "Leviticus:ויקרא:Leviticus:27"
  "Numbers:במדבר:Numbers:36"
  "Deuteronomy:דברים:Deuteronomy:34"
)

DATA_DIR="../public/data"
mkdir -p "$DATA_DIR"

echo "Fetching Torah books with parsha markers..."

for book_info in "${BOOKS[@]}"; do
  IFS=':' read -r book_name book_hebrew sefaria_name chapters <<< "$book_info"

  echo "Fetching $book_name ($book_hebrew)..."

  book_dir="$DATA_DIR/${sefaria_name,,}"
  mkdir -p "$book_dir"

  for ((chapter=1; chapter<=chapters; chapter++)); do
    echo -n "  Chapter $chapter/$chapters... "

    # Fetch from Sefaria API
    json_response=$(curl -s "https://www.sefaria.org/api/texts/${sefaria_name}.${chapter}")

    if [ -z "$json_response" ]; then
      echo "ERROR: Empty response"
      continue
    fi

    # Process with Node.js
    processed=$(node /tmp/process_parsha.js "$json_response" "$book_name" "$book_hebrew" "$chapter")

    if [ -z "$processed" ]; then
      echo "ERROR: Processing failed"
      continue
    fi

    # Save to file
    echo "$processed" > "$book_dir/${chapter}.json"
    echo "✓"

    # Delay to avoid rate limiting
    sleep 0.3
  done

  echo "$book_name complete!"
  echo
done

echo "Done! Torah books fetched with parsha markers."
