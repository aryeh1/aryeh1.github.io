# Tanakh Hebrew Bible Reader - Complete Documentation

**Live URL**: https://aryeh1.github.io/tanakh-deploy/

**Status**: ✅ Fully functional Hebrew Bible reader with all 24 books

---

## Overview

A clean, functional Hebrew Bible website built with React 19. Read, navigate, and search through all 24 books of the Tanakh with access to Rashi commentary via Sefaria API.

---

## Core Features

### Text Content
- **24 Books**: Complete Hebrew Bible (Torah, Prophets, Writings)
- **929 Chapters**: Full text coverage
- **Hebrew Text**: Without nikud (vowel points) for clean reading
- **Parsha Markers**: פ (פתוחה) and ס (סתומה) included
- **JSON Format**: Structured data for all books and chapters

### Navigation
1. **Dropdown Navigation**: Section → Book → Chapter selectors
2. **Search**: Supports "Genesis 1:1" and "בראשית 1" formats
3. **URL Deep-linking**: Direct URLs like `/tanakh-deploy/genesis/1`
4. **Previous/Next**: Chapter navigation buttons
5. **Breadcrumbs**: Home > Book > Chapter trail

### Text Display
- Right-to-left Hebrew with proper typography
- David Libre and Alef fonts from Google Fonts
- Zero letter-spacing (critical for Hebrew readability)
- Numbered verses with parsha markers

### Copy Functionality
- **Verse Copy**: Button next to each verse (Hebrew text only)
- **Chapter Copy**: Copies all verses at once (no verse numbers)
- **Visual Feedback**: Checkmark confirmation
- **Clean Text**: Pure Hebrew without HTML formatting

### Commentary Integration
- **Rashi Commentary**: Via Sefaria API
- **Floating Modal**: Prominent overlay display
- **Close Options**: × button, ESC key, or click outside
- **Hebrew Display**: Commentary without nikud (preserves maqaf)
- **Animations**: Smooth fade-in and slide-up effects
- **Mobile Responsive**: Adapts to all screen sizes

---

## Technology Stack

- **React 19**: Latest React with modern hooks
- **React Router 7**: Client-side routing with deep-linking
- **Sefaria API**: Commentary integration (no auth required)
- **GitHub Pages**: Static hosting
- **JSON Data**: Static files for all Bible text

---

## Project Structure

```
tanakh/
├── public/
│   ├── data/                    # JSON files with Bible text
│   │   ├── index.json           # Book index and metadata
│   │   └── {book}/              # Chapter files (1.json, 2.json, etc.)
│   ├── 404.html                 # SPA redirect for GitHub Pages
│   └── index.html               # Handles redirected query params
├── src/
│   ├── App.js                   # Main application with routing
│   ├── components/
│   │   ├── Navigation/          # BookSelector, ChapterSelector, SearchBar
│   │   ├── Display/             # ChapterView, VerseView, CopyButton
│   │   └── Commentary/          # CommentaryPanel (modal)
│   ├── services/
│   │   ├── textLoader.js        # Load JSON files, parse references
│   │   └── sefariaAPI.js        # Sefaria API integration
│   └── styles/
│       └── hebrew.css           # Hebrew-specific RTL styles
└── package.json
```

---

## Development Workflow

### Install Dependencies
```bash
cd tanakh
npm install
```

### Run Development Server
```bash
npm start
```
Open http://localhost:3000 to view in browser.

### Build for Production
```bash
npm run build
```
Creates optimized build in `build/` folder.

### Deploy to GitHub Pages
```bash
# Build the application
cd tanakh
npm run build

# Copy to deployment directory
rm -rf ../tanakh-deploy/*
cp -r build/* ../tanakh-deploy/

# Commit and push
cd ..
git add tanakh/ tanakh-deploy/
git commit -m "Deploy Tanakh site updates"
git push
```

---

## Critical Bug Fixes (Completed)

### Bug #1: Copy Function Included Verse Numbers ✅
**Problem**: Copied text included verse numbers like "1. בראשית ברא..."

**Solution**: Modified `/tanakh/src/components/Display/ChapterView.jsx` to copy only Hebrew text without numbers.

**Result**: Clean Hebrew-only copy with proper spacing between verses.

---

### Bug #2: URLs Broke on Page Refresh ✅
**Problem**: Navigating to `/tanakh-deploy/deuteronomy/8` and refreshing returned 404 error.

**Solution**: Implemented GitHub Pages SPA redirect pattern:
1. **404.html**: Converts path to query parameters
2. **index.html**: Restores original URL using `history.replaceState()`
3. **React Router**: Configured with `basename="/tanakh-deploy"`

**Technical Details**:
- Uses SPA pattern from https://github.com/rafgraph/spa-github-pages
- `pathSegmentsToKeep = 1` for `/tanakh-deploy/` subpath
- Works by redirecting 404s to index.html with path as query param

**Result**: All URLs work on refresh, deep-linking fully functional.

---

### Bug #3: Rashi Commentary Not Displaying ✅
**Problem**: Commentary fetched successfully but appeared as inline content, not visible to users.

**Solution**: Redesigned as floating modal overlay:
1. **Modal UI**: Backdrop, close button (×), ESC key handler
2. **Floating CSS**: Full-screen overlay with z-index 9999
3. **Animations**: Smooth fade-in and slide-up effects
4. **Mobile Responsive**: Adapts to all screen sizes
5. **Maqaf Preservation**: Fixed `stripNikud()` to preserve מקף (־)

**Features**:
- Click outside or ESC to close
- Scrollable for long commentaries
- Body scroll lock when modal open
- Professional animations

**Result**: Prominent, user-friendly commentary display.

---

### Bug #4: Rashi Commentary Blank Page ✅
**Problem**: Some verses showed blank commentary panel when Sefaria API returned array response.

**Solution**: Updated `/tanakh/src/services/sefariaAPI.js` to handle both object and array responses from Sefaria API.

**Technical Details**:
- Check if `data.he` is array, extract first element
- Check if `data.text` is array, extract first element
- Ensures proper text extraction regardless of API response format

**Result**: Commentary displays correctly for all verses.

---

## Configuration

### package.json
- `homepage`: Set to `https://aryeh1.github.io/tanakh-deploy`

### React Router (App.js)
- `basename="/tanakh-deploy"` on line 270
- Routes: `/` and `/:book/:chapter`

### GitHub Pages SPA Routing
- **404.html**: Located at `/tanakh/public/404.html` (gets built to `/tanakh-deploy/404.html`)
- **index.html**: Contains redirect handler script
- **pathSegmentsToKeep**: Set to `1` for subpath deployment

---

## Testing

### Run Tests
```bash
npm test
```

### Test Coverage
- ChapterView: Copy functionality without verse numbers
- CommentaryPanel: Modal display, close functionality, ESC key
- CopyButton: Copy success feedback
- sefariaAPI: stripNikud preserves maqaf

**Test Results**: 64 tests passing ✅

---

## Browser Support

Tested and working:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

---

## Known Limitations

1. **Hebrew Chapter Numbers**: Not yet supported in search (use numeric: 1, 2, 3)
2. **Single Commentary**: Only Rashi available (Ibn Ezra, Ramban can be added)
3. **Offline**: Requires internet for commentary features
4. **Full-text Search**: Not yet implemented (only reference-based navigation)

---

## Future Enhancements

- Hebrew chapter number parsing (א, ב, ג)
- Full-text Hebrew search across all books
- Additional commentaries (Ibn Ezra, Ramban)
- Bookmarking system
- Print-friendly view
- Dark mode
- Audio playback
- Study notes feature
- Parallel translation view

---

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
      "parsha": "פ"  // optional
    }
  ]
}
```

---

## Hebrew Text Guidelines

**CRITICAL for proper display**:
- Text must be without nikud (vowel points)
- No letter-spacing in CSS (breaks Hebrew rendering)
- Use RTL direction and right alignment
- Recommended fonts: David Libre, Frank Ruehl CLM, Alef
- Preserve maqaf (־) character in text

---

## Sefaria API Integration

**Endpoint**: `https://www.sefaria.org/api/texts/Rashi_on_{Book}.{Chapter}.{Verse}`

**Notes**:
- No authentication required
- CORS enabled for browser requests
- Returns Hebrew and English text
- Strip nikud from response for consistency
- Handle both object and array responses

---

## Acceptance Criteria (All Met) ✅

- ✅ Navigate to any book/chapter using dropdowns
- ✅ Search for text like "Genesis 1:1" and navigate there
- ✅ All Hebrew text displays correctly (RTL, proper spacing)
- ✅ Copy button pastes verse text without numbers
- ✅ View Rashi commentary on verses (via Sefaria API)
- ✅ Site deployed and working on GitHub Pages
- ✅ Responsive design works on mobile and desktop
- ✅ Complete dataset for all 24 books
- ✅ URLs work on direct access and reload (deep-linking)
- ✅ Commentary displays in prominent modal overlay

---

## Quick Reference

### Development Commands
```bash
npm install              # Install dependencies
npm start                # Run dev server (localhost:3000)
npm test                 # Run test suite
npm run build            # Build for production
```

### Deployment Steps
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

### Important Files
- `/tanakh/src/App.js` - Main application with routing
- `/tanakh/src/services/sefariaAPI.js` - API integration
- `/tanakh/src/styles/hebrew.css` - Hebrew typography
- `/tanakh/public/404.html` - SPA redirect script
- `/tanakh/public/data/index.json` - Book index

---

## Credits

- **Text Source**: Sefaria.org
- **Commentaries**: Sefaria API
- **Built with**: React 19, React Router 7
- **Fonts**: Google Fonts (David Libre, Alef)
- **Hosting**: GitHub Pages

---

**Last Updated**: 2025-11-06

**Status**: Production-ready, all core features functional ✅
