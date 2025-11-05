#!/bin/bash

BASE_URL="https://raw.githubusercontent.com/TorahBibleCodes/Sefaria-Export/master/json/Tanakh"

# Torah
curl -s "$BASE_URL/Torah/Genesis/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/genesis.json &
curl -s "$BASE_URL/Torah/Exodus/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/exodus.json &
curl -s "$BASE_URL/Torah/Leviticus/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/leviticus.json &
curl -s "$BASE_URL/Torah/Numbers/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/numbers.json &
curl -s "$BASE_URL/Torah/Deuteronomy/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/deuteronomy.json &

# Prophets
curl -s "$BASE_URL/Prophets/Joshua/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/joshua.json &
curl -s "$BASE_URL/Prophets/Judges/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/judges.json &
curl -s "$BASE_URL/Prophets/I%20Samuel/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/i_samuel.json &
curl -s "$BASE_URL/Prophets/II%20Samuel/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/ii_samuel.json &
curl -s "$BASE_URL/Prophets/I%20Kings/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/i_kings.json &
curl -s "$BASE_URL/Prophets/II%20Kings/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/ii_kings.json &
curl -s "$BASE_URL/Prophets/Isaiah/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/isaiah.json &
curl -s "$BASE_URL/Prophets/Jeremiah/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/jeremiah.json &
curl -s "$BASE_URL/Prophets/Ezekiel/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/ezekiel.json &
curl -s "$BASE_URL/Prophets/Hosea/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/hosea.json &
curl -s "$BASE_URL/Prophets/Joel/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/joel.json &
curl -s "$BASE_URL/Prophets/Amos/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/amos.json &
curl -s "$BASE_URL/Prophets/Obadiah/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/obadiah.json &
curl -s "$BASE_URL/Prophets/Jonah/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/jonah.json &
curl -s "$BASE_URL/Prophets/Micah/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/micah.json &
curl -s "$BASE_URL/Prophets/Nahum/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/nahum.json &
curl -s "$BASE_URL/Prophets/Habakkuk/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/habakkuk.json &
curl -s "$BASE_URL/Prophets/Zephaniah/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/zephaniah.json &
curl -s "$BASE_URL/Prophets/Haggai/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/haggai.json &
curl -s "$BASE_URL/Prophets/Zechariah/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/zechariah.json &
curl -s "$BASE_URL/Prophets/Malachi/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/malachi.json &

# Writings
curl -s "$BASE_URL/Writings/Psalms/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/psalms.json &
curl -s "$BASE_URL/Writings/Proverbs/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/proverbs.json &
curl -s "$BASE_URL/Writings/Job/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/job.json &
curl -s "$BASE_URL/Writings/Song%20of%20Songs/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/song_of_songs.json &
curl -s "$BASE_URL/Writings/Ruth/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/ruth.json &
curl -s "$BASE_URL/Writings/Lamentations/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/lamentations.json &
curl -s "$BASE_URL/Writings/Ecclesiastes/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/ecclesiastes.json &
curl -s "$BASE_URL/Writings/Esther/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/esther.json &
curl -s "$BASE_URL/Writings/Daniel/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/daniel.json &
curl -s "$BASE_URL/Writings/Ezra/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/ezra.json &
curl -s "$BASE_URL/Writings/Nehemiah/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/nehemiah.json &
curl -s "$BASE_URL/Writings/I%20Chronicles/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/i_chronicles.json &
curl -s "$BASE_URL/Writings/II%20Chronicles/Hebrew/Tanach%20with%20Text%20Only.json" > /tmp/ii_chronicles.json &

wait

echo "All downloads complete!"
ls -lh /tmp/*.json | wc -l
