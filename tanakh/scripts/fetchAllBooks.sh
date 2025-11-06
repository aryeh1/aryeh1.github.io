#!/bin/bash

# Fetch all 24 books of Tanakh with parsha markers

# Books array (name:hebrew:sefaria_name:chapters)
declare -a BOOKS=(
  # Prophets
  "Joshua:יהושע:Joshua:24"
  "Judges:שופטים:Judges:21"
  "I Samuel:שמואל א:I_Samuel:31"
  "II Samuel:שמואל ב:II_Samuel:24"
  "I Kings:מלכים א:I_Kings:22"
  "II Kings:מלכים ב:II_Kings:25"
  "Isaiah:ישעיהו:Isaiah:66"
  "Jeremiah:ירמיהו:Jeremiah:52"
  "Ezekiel:יחזקאל:Ezekiel:48"
  "Hosea:הושע:Hosea:14"
  "Joel:יואל:Joel:4"
  "Amos:עמוס:Amos:9"
  "Obadiah:עובדיה:Obadiah:1"
  "Jonah:יונה:Jonah:4"
  "Micah:מיכה:Micah:7"
  "Nahum:נחום:Nahum:3"
  "Habakkuk:חבקוק:Habakkuk:3"
  "Zephaniah:צפניה:Zephaniah:3"
  "Haggai:חגי:Haggai:2"
  "Zechariah:זכריה:Zechariah:14"
  "Malachi:מלאכי:Malachi:3"
  # Writings
  "Psalms:תהלים:Psalms:150"
  "Proverbs:משלי:Proverbs:31"
  "Job:איוב:Job:42"
  "Song of Songs:שיר השירים:Song_of_Songs:8"
  "Ruth:רות:Ruth:4"
  "Lamentations:איכה:Lamentations:5"
  "Ecclesiastes:קהלת:Ecclesiastes:12"
  "Esther:אסתר:Esther:10"
  "Daniel:דניאל:Daniel:12"
  "Ezra:עזרא:Ezra:10"
  "Nehemiah:נחמיה:Nehemiah:13"
  "I Chronicles:דברי הימים א:I_Chronicles:29"
  "II Chronicles:דברי הימים ב:II_Chronicles:36"
)

DATA_DIR="../public/data"

echo "Fetching all remaining Tanakh books..."
echo

for book_info in "${BOOKS[@]}"; do
  IFS=':' read -r book_name book_hebrew sefaria_name chapters <<< "$book_info"

  echo "Fetching $book_name ($book_hebrew) - $chapters chapters..."

  book_dir="$DATA_DIR/${sefaria_name,,}"
  mkdir -p "$book_dir"

  for ((chapter=1; chapter<=chapters; chapter++)); do
    # Skip if file already exists and is not empty
    if [ -s "$book_dir/${chapter}.json" ]; then
      echo -n ""
    else
      json_response=$(curl -s --max-time 10 "https://www.sefaria.org/api/texts/${sefaria_name}.${chapter}")

      if [ ! -z "$json_response" ] && [ "$json_response" != "upstream connect error"* ]; then
        node /tmp/process_parsha.js "$json_response" "$book_name" "$book_hebrew" "$chapter" > "$book_dir/${chapter}.json" 2>/dev/null
      fi

      sleep 0.2
    fi
  done

  # Count successful chapters
  count=$(ls -1 "$book_dir"/*.json 2>/dev/null | wc -l)
  echo "  ✓ $count/$chapters chapters"
done

echo
echo "Done! All Tanakh books processed."
echo
echo "Summary:"
echo "  Torah (187 chapters): $(find $DATA_DIR/{genesis,exodus,leviticus,numbers,deuteronomy} -name '*.json' 2>/dev/null | wc -l) files"
echo "  All books: $(find $DATA_DIR -name '*.json' -not -name 'index.json' 2>/dev/null | wc -l) chapter files"
echo "  Parsha markers in Torah: $(grep -r '"parsha"' $DATA_DIR/{genesis,exodus,leviticus,numbers,deuteronomy} 2>/dev/null | wc -l)"
