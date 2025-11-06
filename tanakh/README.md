# Hebrew Bible (Tanakh) Reader

A clean, functional Hebrew Bible website built with React 19. Read, navigate, and search through all 24 books of the Tanakh with access to Rashi commentary via Sefaria API.

## Project Status

**✅ FULLY FUNCTIONAL** - Complete Hebrew Bible implementation with all core features working.

**Live URL**: https://aryeh1.github.io/tanakh-deploy/

## Features

### 1. Complete Text Content
- **All 24 Books**: Complete Hebrew Bible (Torah, Prophets, Writings)
- **929 Chapters**: Full text coverage across all books
- **Hebrew Text**: Without nikud (vowel points) for clean reading
- **Parsha Markers**: פ (פתוחה) and ס (סתומה) included where applicable
- **Structured Data**: JSON format for all books and chapters

### 2. Navigation System
**A. Hierarchical Dropdown Navigation:**
- Section selector (Torah, Prophets, Writings)
- Book selector with Hebrew and English names
- Chapter selector (dynamic based on book)
- All 24 books indexed and accessible

**B. Free-Text Search Navigation:**
- Supports "Genesis 1:1" format
- Supports "בראשית 1" Hebrew format with numeric chapters
- Parses and validates references
- Error messages for invalid input

**C. Additional Navigation:**
- Previous/Next chapter buttons
- Breadcrumb trail (Home > Book > Chapter)
- URL deep-linking support (`/tanakh-deploy/genesis/1`)

### 3. Text Display
- **RTL Support**: Proper right-to-left Hebrew display
- **Typography**: David Libre and Alef fonts from Google Fonts
- **Styling**: Zero letter-spacing (critical for Hebrew readability)
- **Verse Format**: Each verse numbered and displayed clearly
- **Parsha Markers**: Displayed inline where present
- **Visual Hierarchy**: Clear book titles and chapter numbers

### 4. Copy Functionality
- **Verse Copy**: Button next to each verse
- **Chapter Copy**: Button at top of chapter (copies ALL verses at once)
- **Clean Hebrew-Only Text**: No verse numbers, just pure Hebrew
- **Proper Spacing**: Blank lines between verses, parsha markers preserved
- **Confirmation**: Visual feedback (checkmark ✓)
- **Clean Text**: Copies Hebrew without HTML formatting

### 5. Commentary Integration
- **Rashi Commentary**: Via Sefaria API
- **Click to View**: Button on each verse
- **Floating Modal Display**: Appears as overlay on current page
- **Close Options**: Close button (×), ESC key, or click outside
- **Hebrew Display**: Commentary shown without nikud (preserves maqaf)
- **Animations**: Smooth fade-in and slide-up effects
- **Error Handling**: Graceful fallback if unavailable
- **Mobile Responsive**: Adapts to all screen sizes

### 6. Responsive Design
- Mobile-friendly layout
- Flexible navigation controls
- Readable on all screen sizes
- Clean, minimalist interface

## Technology Stack

- **React 19**: Latest React with modern hooks and patterns
- **React Router 7**: Client-side routing with deep-linking
- **Sefaria API**: Commentary integration
- **GitHub Pages**: Static hosting
- **JSON Data**: Static files for all Bible text
- **CSS**: Custom RTL Hebrew typography

## Project Structure

```
tanakh/
├── public/
│   ├── data/                    # JSON files with Bible text
│   │   ├── index.json           # Book index and metadata
│   │   ├── genesis/             # Genesis chapters 1-50
│   │   ├── exodus/              # Exodus chapters 1-40
│   │   └── ...                  # All other books
│   └── index.html
├── src/
│   ├── App.js                   # Main application
│   ├── components/
│   │   ├── Navigation/          # BookSelector, ChapterSelector, SearchBar
│   │   ├── Display/             # ChapterView, VerseView, CopyButton
│   │   └── Commentary/          # CommentaryPanel
│   ├── services/
│   │   ├── textLoader.js        # Load JSON files, parse references
│   │   └── sefariaAPI.js        # Sefaria API integration
│   └── styles/
│       └── hebrew.css           # Hebrew-specific RTL styles
├── scripts/
│   ├── fetchBibleText.js        # Script to fetch Bible text from Sefaria
│   ├── processBibleData.js      # Data processing utilities
│   └── downloadFullBible.js     # Alternative fetch script
└── package.json
```

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
    },
    "prophets": { ... },
    "writings": { ... }
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
      "parsha": "פ"  // optional
    }
  ]
}
```

## Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Install Dependencies

```bash
cd tanakh
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

```bash
# Build the application
npm run build

# Copy to deployment directory
rm -rf ../tanakh-deploy/*
cp -r build/* ../tanakh-deploy/

# Commit and push
cd ..
git add tanakh-deploy/
git commit -m "Deploy updated Tanakh site"
git push
```

## Rebuilding After Changes

If you make changes to source code or data:

```bash
cd tanakh
npm run build
rm -rf ../tanakh-deploy/*
cp -r build/* ../tanakh-deploy/
cd ..
git add tanakh/ tanakh-deploy/
git commit -m "Update Tanakh site"
git push
```

## Fetching Bible Text

The complete Hebrew Bible text is already included. To re-fetch from Sefaria API:

```bash
cd tanakh
node scripts/fetchBibleText.js
```

This will:
- Fetch all 24 books from Sefaria API
- Strip nikud automatically
- Create 929 chapter JSON files
- Takes ~90 seconds with internet access

## Hebrew Text Guidelines

**CRITICAL for proper display:**
- Text must be without nikud (vowel points)
- No letter-spacing in CSS (breaks Hebrew rendering)
- Use RTL direction and right alignment
- Recommended fonts: David Libre, Frank Ruehl CLM, Alef
- Avoid hyphens/dashes in text (use naked Hebrew text)

## Sefaria API Integration

**Endpoints used:**
- Commentary: `https://www.sefaria.org/api/texts/Rashi_on_{Book}.{Chapter}.{Verse}`

**Notes:**
- No authentication required
- CORS enabled for browser requests
- Returns Hebrew and English text
- Strip nikud from response for consistency

## Configuration

**package.json:**
- `homepage`: Set to `https://aryeh1.github.io/tanakh-deploy`
- Adjust if deploying elsewhere

**React Router:**
- Set to `basename="/tanakh-deploy"` in `src/App.js`
- Modify if deploying to different path

## Browser Support

Tested and working on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Testing

Run the test suite:

```bash
npm test
```

Tests cover:
- Navigation components
- Search parsing
- Copy functionality
- Text display
- Commentary loading
- URL routing

## Known Limitations

1. **Search**: Hebrew chapter numbers (א, ב, ג) not yet supported in search (use numeric: 1, 2, 3)
2. **Commentary**: Only Rashi available (Ibn Ezra, Ramban can be added)
3. **Offline**: Requires internet for commentary features
4. **Full-text search**: Not yet implemented (only reference-based navigation)

## Bug Fixes

See [BUG_FIXES_SUMMARY.md](../BUG_FIXES_SUMMARY.md) for detailed information on recent critical bug fixes:
- Copy function (verse numbers excluded)
- URL routing (deep-linking working)
- Rashi commentary display (floating modal with close button)

## Future Enhancements

Potential improvements:
- [ ] Hebrew chapter number parsing in search (א, ב, ג)
- [ ] Full-text Hebrew search across all books
- [ ] Additional commentaries (Ibn Ezra, Ramban, etc.)
- [ ] Bookmarking system
- [ ] Print-friendly view
- [ ] Dark mode
- [ ] Audio playback
- [ ] Study notes feature
- [ ] Parallel translation view

## Recent Updates

### November 2025 - Critical Bug Fixes
- **Fixed:** Copy function now excludes verse numbers (copies only Hebrew text)
- **Fixed:** URL routing works on refresh (deep-linking fully functional)
- **Fixed:** Rashi commentary displays in prominent floating modal with close button
- **Fixed:** stripNikud preserves maqaf (־) character
- **Enhanced:** Commentary modal with animations, ESC key support, click-outside-to-close
- **Added:** Comprehensive test coverage (64 tests passing)
- **Added:** Mobile-responsive commentary modal

### November 2024 - Complete Bible Dataset
- Added all 39 books (929 chapters) of Hebrew Bible
- Created index.json with complete book metadata
- Verified all navigation and display features
- Deployed to GitHub Pages

### November 2024 - Initial Implementation
- Built React application structure
- Implemented navigation system
- Added Rashi commentary integration
- Created responsive design
- Set up GitHub Pages deployment

## Acceptance Criteria ✅

All core requirements met:
- ✅ User can navigate to any book/chapter using dropdowns
- ✅ User can search for text like "Genesis 1:1" and navigate there
- ✅ All Hebrew text displays correctly (right-to-left, proper spacing)
- ✅ User can click "copy" button and paste verse text elsewhere
- ✅ User can view Rashi commentary on verses (via Sefaria API)
- ✅ Site is deployed and working on GitHub Pages
- ✅ Responsive design works on mobile and desktop
- ✅ Complete dataset for all 24 books

## License

Text from Sefaria.org - see their licensing terms.
Code is free to use and modify.

## Credits

- **Text Source**: Sefaria.org
- **Commentaries**: Sefaria API
- **Built with**: React 19, React Router 7
- **Fonts**: Google Fonts (David Libre, Alef)
- **Hosting**: GitHub Pages

## Contact

For issues or questions about the implementation, refer to the main GitHub repository.

---

**Quick Start:**
1. `npm install` - Install dependencies
2. `npm start` - Run development server
3. `npm run build` - Build for production
4. Copy `build/*` to `../tanakh-deploy/` - Deploy

**Enjoy reading the Hebrew Bible!** 📖
