# Hebrew Bible (Tanakh) Reader

A clean, functional Hebrew Bible website built with React 18. Read, navigate, and search through the 24 books of the Tanakh with access to Rashi commentary via Sefaria API.

## Features

✅ **Navigation System**
- Hierarchical dropdown navigation by section (Torah, Prophets, Writings), book, and chapter
- Free-text search navigation (e.g., "Genesis 1:1" or "בראשית א")
- Previous/Next chapter buttons
- URL deep-linking support

✅ **Text Display**
- All Hebrew text without nikud (vowel points)
- Proper right-to-left (RTL) display
- Parsha markers (פ/ס) where applicable
- Clean, readable spacing

✅ **Copy Functionality**
- Copy individual verses
- Copy entire chapters
- One-click clipboard copy with confirmation

✅ **Commentary Integration**
- Rashi commentary via Sefaria API
- Click any verse to view commentary
- Hebrew text display (without nikud)

✅ **Responsive Design**
- Works on desktop and mobile
- Clean, minimalist interface
- Optimized for reading

## Technology Stack

- React 19 (latest version)
- React Router for navigation
- Sefaria API for commentaries
- GitHub Pages deployment
- Static JSON data files

## Project Structure

```
tanakh/
├── public/
│   ├── data/               # JSON files with Bible text
│   │   ├── index.json      # Book index and metadata
│   │   └── genesis/        # Example book directory
│   │       ├── 1.json
│   │       └── 2.json
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navigation/     # Navigation components
│   │   ├── Display/        # Text display components
│   │   └── Commentary/     # Commentary panel
│   ├── services/
│   │   ├── textLoader.js   # Load JSON files
│   │   └── sefariaAPI.js   # Sefaria API integration
│   └── styles/
│       └── hebrew.css      # Hebrew-specific styles
└── scripts/
    └── fetchBibleText.js   # Script to fetch full Bible text
```

## Current Status

**Sample Data Included:**
- Genesis chapters 1-2 (as demonstration)
- Full book index with all 24 books

**To Add Full Dataset:**

The project currently includes sample data (Genesis 1-2) for demonstration. To add the complete Bible text:

### Option 1: Use Sefaria API (Recommended)

1. The included `scripts/fetchBibleText.js` script can fetch all 24 books from Sefaria API
2. It automatically strips nikud from the text
3. Run it when you have internet access:

```bash
cd tanakh
node scripts/fetchBibleText.js
```

This will create JSON files for all 929 chapters of the Tanakh.

### Option 2: Manual Data Entry

Create JSON files in the format:

```json
{
  "book": "BookName",
  "bookHebrew": "שם הספר",
  "chapter": 1,
  "verses": [
    {
      "number": 1,
      "hebrew": "טקסט עברי ללא ניקוד",
      "parsha": "פ"  // optional
    }
  ]
}
```

Place files in: `public/data/{bookkey}/{chapter}.json`

### Option 3: Download Pre-processed Data

Look for Hebrew Bible JSON repositories on GitHub:
- Search for "tanach json" or "hebrew bible json"
- Ensure text is without nikud
- Convert to the project's JSON format

## Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view in browser.

### Build for Production

```bash
npm run build
```

Creates optimized production build in `build/` folder.

### Deploy to GitHub Pages

The app is configured to deploy to `/tanakh` path:

```bash
npm run build:deploy
```

Then copy the build folder to your GitHub Pages root and commit.

## Configuration

**package.json:**
- `homepage`: Set to your GitHub Pages URL + `/tanakh`
- Adjust if deploying elsewhere

**React Router:**
- Currently set to `basename="/tanakh"`
- Modify in `src/App.js` if needed

## Data Format Specifications

### Book Index (public/data/index.json)

```json
{
  "sections": {
    "torah": {
      "name": "Torah",
      "hebrewName": "תורה",
      "books": [
        {
          "english": "Genesis",
          "hebrew": "בראשית",
          "key": "genesis",
          "chapters": 50
        }
      ]
    }
  }
}
```

### Chapter Data (public/data/{book}/{chapter}.json)

```json
{
  "book": "Genesis",
  "bookHebrew": "בראשית",
  "chapter": 1,
  "verses": [
    {
      "number": 1,
      "hebrew": "בראשית ברא אלהים את השמים ואת הארץ",
      "parsha": "פ"
    }
  ]
}
```

## Hebrew Text Guidelines

**CRITICAL for proper display:**
- Text must be without nikud (vowel points)
- No letter-spacing in CSS
- Use RTL direction and right alignment
- Recommended fonts: David Libre, Frank Ruehl CLM, Alef

## Sefaria API Integration

**Endpoints used:**
- Commentary: `https://www.sefaria.org/api/texts/Rashi_on_{Book}.{Chapter}.{Verse}`

**Notes:**
- No authentication required
- CORS: Works from browser
- Returns Hebrew and English text
- Strip nikud from response for consistency

## Browser Support

Tested on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Known Limitations

1. **Sample Data:** Only Genesis 1-2 included by default
2. **Search:** Full-text search not yet implemented (only reference search)
3. **Commentary:** Only Rashi available (can add Ibn Ezra, Ramban, etc.)
4. **Offline:** Requires internet for commentary

## Future Enhancements

Potential improvements:
- [ ] Full-text Hebrew search across all books
- [ ] Additional commentaries (Ibn Ezra, Ramban)
- [ ] Bookmarking system
- [ ] Print-friendly view
- [ ] Dark mode
- [ ] Audio playback
- [ ] Study notes feature

## License

Text from Sefaria.org - see their licensing terms.
Code is free to use and modify.

## Credits

- Text: Sefaria.org
- Commentaries: Sefaria API
- Built with: React, React Router
- Fonts: Google Fonts (David Libre, Alef)

## Contact

For issues or questions about the implementation, refer to the main GitHub repository.

---

**Getting Started:**
1. Install dependencies: `npm install`
2. Run development server: `npm start`
3. Build for production: `npm run build`
4. Add full Bible text using one of the methods above
5. Deploy to GitHub Pages

Enjoy reading the Hebrew Bible! 📖
