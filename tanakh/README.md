# Tanakh Hebrew Bible Reader - Complete Documentation

A clean, functional Hebrew Bible website built with React 19. Read, navigate, and search through all 24 books of the Tanakh with access to Rashi commentary via Sefaria API.

## Project Status

**✅ FULLY FUNCTIONAL** - Production-ready Hebrew Bible implementation with all core features working.

**Live URL**: https://aryeh1.github.io/tanakh-deploy/

**Last Updated**: 2025-11-06

---

## 🤖 Agent Guidelines

**CRITICAL: All AI agents MUST follow these guidelines. Read this section FIRST before making any changes.**

### BEFORE YOU START (MANDATORY)
**⚠️ STEP 0: READ THE ENTIRE README FIRST**
- Read this README completely before making any changes
- Understand the project structure, features, and constraints
- Review the Development Workflow and Critical Rules below
- Understand why TDD is mandatory for this project

### Development Workflow (MANDATORY - TDD REQUIRED)
1. **READ README FIRST**: Ensure you've read the entire README before proceeding
2. **TEST-DRIVEN DEVELOPMENT (TDD)**: Write tests FIRST, then implement features
   - Write failing tests
   - Implement feature to make tests pass
   - Refactor if needed
   - NO feature implementation without tests first
3. **Run Tests**: Execute `npm test` to verify all tests pass
4. **Build Search Index** (if chapter data changed): Run `npm run build-search-index`
5. **Build**: Run `npm run build` to create production build
6. **DEPLOY TO TANAKH-DEPLOY (CRITICAL)**: Must copy build to deployment directory:
   ```bash
   cd /home/user/aryeh1.github.io
   rm -rf tanakh-deploy/*
   cp -r tanakh/build/* tanakh-deploy/
   ```
   **⚠️ THIS STEP IS MANDATORY - NEVER SKIP IT**
7. **Update README**: Document ALL new features and changes
8. **Commit & Push**: Stage ALL changes (both tanakh/ and tanakh-deploy/), commit with descriptive message, and push

### Critical Rules (MUST FOLLOW)
- ✅ **ALWAYS** read the README completely before starting work
- ✅ **ALWAYS** follow TDD: Write tests FIRST, then implement
- ✅ **ALWAYS** build and deploy to `tanakh-deploy/` after code changes
- ✅ **ALWAYS** run full test suite before committing
- ✅ **ALWAYS** update README with new features
- ✅ **ALWAYS** commit both `tanakh/` and `tanakh-deploy/` directories together
- ✅ **ALWAYS** verify zero regression (all existing tests pass)
- ❌ **NEVER** skip the deployment step to `tanakh-deploy/`
- ❌ **NEVER** commit without deploying to `tanakh-deploy/`
- ❌ **NEVER** commit without updating README
- ❌ **NEVER** break existing functionality
- ❌ **NEVER** skip writing tests before implementing features

### Deployment Checklist (CHECK EVERY ITEM)
- [ ] Read README completely before starting
- [ ] Wrote tests FIRST before implementing features
- [ ] Tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] **DEPLOYED to `tanakh-deploy/`** (DO NOT SKIP!)
- [ ] Verified `tanakh-deploy/` contains updated files
- [ ] README updated with all changes
- [ ] Both `tanakh/` and `tanakh-deploy/` directories staged for commit
- [ ] All changes committed with descriptive message
- [ ] Changes pushed to remote
- [ ] Zero regression verified

---

## Overview

Complete Hebrew Bible (Torah, Prophets, Writings) with 929 chapters across 24 books. Features include hierarchical navigation, free-text search, Rashi commentary integration via Sefaria API, and clean Hebrew text display without nikud.

---

## Core Features

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
- Direct URLs work on page refresh

### 3. Text Display
- **RTL Support**: Proper right-to-left Hebrew display
- **Typography**: David Libre and Alef fonts from Google Fonts
- **Styling**: Zero letter-spacing (critical for Hebrew readability)
- **Verse Format**: Each verse numbered and displayed clearly
- **Parsha Markers**: Displayed inline where present
- **Visual Hierarchy**: Clear book titles and chapter numbers

### 4. Copy Functionality
- **Verse Copy**: Button next to each verse (Hebrew text only)
- **Chapter Copy**: Button at top of chapter (copies ALL verses at once)
- **Clean Hebrew-Only Text**: No verse numbers, just pure Hebrew
- **Proper Spacing**: Blank lines between verses, parsha markers preserved
- **Visual Feedback**: Checkmark confirmation (✓)
- **Clean Text**: Copies Hebrew without HTML formatting

### 5. Commentary Integration
- **Rashi Commentary**: Via Sefaria API
- **Floating Modal Display**: Prominent overlay on current page
- **Close Options**: Close button (×), ESC key, or click outside
- **Hebrew Display**: Commentary shown without nikud (preserves maqaf)
- **Animations**: Smooth fade-in and slide-up effects
- **Error Handling**: Graceful fallback if commentary unavailable
- **Mobile Responsive**: Adapts to all screen sizes
- **Body Scroll Lock**: Prevents background scrolling when modal open

### 6. Full-Text Search
- **Dedicated Search Page**: Separate `/search` route for comprehensive search
- **Two Search Modes**:
  - **Exact Match**: Finds complete word matches only (e.g., "בראשית" finds "בראשית" but not "ובראשית")
  - **Fuzzy Match**: Finds partial matches within words (e.g., "ברא" finds "בראשית", "ברא", "יברא")
- **Prefix Letter Stripping**: Optional feature to ignore Hebrew prefix letters (ו, ה, ב, כ, ל, מ, י)
- **Search Across All Books**: Searches through all 929 chapters of the Tanakh
- **Highlighted Results**: Search term highlighted in yellow within verse text
- **Book Filtering**: Filter results by individual books with result counts
- **Direct Navigation**: Click result to jump to verse in context with temporary highlight
- **Results Display**: Shows book name, chapter:verse reference, and full verse text
- **Fast Performance**: Pre-built search index enables instant search (<1 second) across all 23,206 verses
- **Mobile Responsive**: Works seamlessly on all devices
- **Optimized Index**: 5.77 MB search index loaded once and cached in memory

**How to Use Search:**
1. Click "🔍 חיפוש בתנ"ך" in the header
2. Enter Hebrew text (e.g., "בראשית" or "אלהים")
3. Choose search mode (exact or fuzzy)
4. Optionally enable prefix stripping
5. View results and click to navigate to verse

### 7. Responsive Design
- Mobile-friendly layout
- Flexible navigation controls
- Readable on all screen sizes
- Clean, minimalist interface

---

## Technology Stack

- **React 19**: Latest React with modern hooks and patterns
- **React Router 7**: Client-side routing with deep-linking
- **Sefaria API**: Commentary integration (no authentication required)
- **GitHub Pages**: Static hosting with SPA redirect pattern
- **JSON Data**: Static files for all Bible text
- **CSS**: Custom RTL Hebrew typography

---

## Project Structure

```
tanakh/
├── public/
│   ├── data/                    # JSON files with Bible text
│   │   ├── index.json           # Book index and metadata
│   │   ├── genesis/             # Genesis chapters 1-50
│   │   ├── exodus/              # Exodus chapters 1-40
│   │   └── ...                  # All other books (929 chapters total)
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
├── scripts/
│   ├── buildSearchIndex.js      # Build search index from chapter files
│   ├── fetchBibleText.js        # Script to fetch Bible text from Sefaria
│   ├── processBibleData.js      # Data processing utilities
│   └── downloadFullBible.js     # Alternative fetch script
└── package.json
```

---

## Development Workflow

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
Open http://localhost:3000 to view in browser.

### Build Search Index
The search feature requires a pre-built index. This should be run after any changes to the chapter JSON files:
```bash
npm run build-search-index
```
This creates `public/data/search-index.json` with all 23,206 verses (5.77 MB).

### Build for Production
```bash
npm run build
```
Creates optimized build in `build/` folder.

### Deploy to GitHub Pages
```bash
# Build the search index (if chapter data changed)
cd tanakh
npm run build-search-index

# Build the application
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
- Adjust if deploying elsewhere

### React Router (App.js)
- `basename="/tanakh-deploy"` on line 270
- Routes: `/` and `/:book/:chapter`
- Modify if deploying to different path

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
- Navigation components
- Search parsing
- Text display
- URL routing

**Test Results**: 64 tests passing ✅

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

---

## Hebrew Text Guidelines

**CRITICAL for proper display**:
- Text must be without nikud (vowel points)
- No letter-spacing in CSS (breaks Hebrew rendering)
- Use RTL direction and right alignment
- Recommended fonts: David Libre, Frank Ruehl CLM, Alef
- Preserve maqaf (־) character in text
- Avoid hyphens/dashes in text (use naked Hebrew text)

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

---

## Browser Support

Tested and working on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

---

## Known Limitations

1. **Hebrew Chapter Numbers**: Not yet supported in reference search (use numeric: 1, 2, 3)
2. **Single Commentary**: Only Rashi available (Ibn Ezra, Ramban can be added)
3. **Offline**: Requires internet for commentary features

---

## Future Enhancements

Potential improvements:
- Hebrew chapter number parsing (א, ב, ג) for reference search
- Additional commentaries (Ibn Ezra, Ramban)
- Bookmarking system
- Print-friendly view
- Dark mode
- Audio playback
- Study notes feature
- Parallel translation view

---

## Recent Updates

### November 2025 - Search Performance Optimization
- **Optimized:** Search now uses pre-built index for instant results (<1 second)
- **Added:** `buildSearchIndex.js` script consolidates all 929 chapters into single search index
- **Added:** `npm run build-search-index` command for rebuilding search index
- **Improved:** Search index cached in memory after first load (5.77 MB, 23,206 verses)
- **Removed:** Individual chapter file loading during search (major performance boost)
- **Updated:** All tests passing (38 searchService tests)

### November 2025 - Critical Bug Fixes
- **Fixed:** Copy function now excludes verse numbers (copies only Hebrew text)
- **Fixed:** URL routing works on refresh (deep-linking fully functional)
- **Fixed:** Rashi commentary displays in prominent floating modal with close button
- **Fixed:** Rashi commentary blank page issue (handle array responses from API)
- **Fixed:** stripNikud preserves maqaf (־) character
- **Enhanced:** Commentary modal with animations, ESC key support, click-outside-to-close
- **Added:** Comprehensive test coverage (64 tests passing)
- **Added:** Mobile-responsive commentary modal
- **Added:** Body scroll lock when modal open

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
npm run build-search-index  # Build search index (run after chapter data changes)
npm run build            # Build for production
```

### Deployment Steps
```bash
cd tanakh
npm run build-search-index  # Only needed if chapter data changed
npm run build
rm -rf ../tanakh-deploy/*
cp -r build/* ../tanakh-deploy/
cd ..
git add tanakh/ tanakh-deploy/
git commit -m "Update Tanakh site"
git push
```

### Important Files
- `/tanakh/src/App.js` - Main application with routing (line 270: basename)
- `/tanakh/src/services/sefariaAPI.js` - API integration
- `/tanakh/src/components/Display/ChapterView.jsx` - Copy functionality
- `/tanakh/src/components/Commentary/CommentaryPanel.jsx` - Modal display
- `/tanakh/src/styles/hebrew.css` - Hebrew typography
- `/tanakh/public/404.html` - SPA redirect script
- `/tanakh/public/data/index.json` - Book index

---

## License

Text from Sefaria.org - see their licensing terms.
Code is free to use and modify.

---

## Credits

- **Text Source**: Sefaria.org
- **Commentaries**: Sefaria API
- **Built with**: React 19, React Router 7
- **Fonts**: Google Fonts (David Libre, Alef)
- **Hosting**: GitHub Pages

---

## Contact

For issues or questions about the implementation, refer to the main GitHub repository.

---

**Quick Start:**
1. `npm install` - Install dependencies
2. `npm start` - Run development server
3. `npm run build-search-index` - Build search index (if needed)
4. `npm run build` - Build for production
5. Copy `build/*` to `../tanakh-deploy/` - Deploy

**Enjoy reading the Hebrew Bible!** 📖
