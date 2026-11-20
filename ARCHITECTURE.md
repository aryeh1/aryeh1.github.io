# Architecture

## Overview

Minimal site for [aryehlopian.com](https://aryehlopian.com): a landing page and a NotMe app showcase (`/notme`).

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Testing | Vitest |
| Deployment | GitHub Pages |

## Structure

```
src/
├── App.tsx              # Router (/notme → NotMe, everything else → Landing)
├── main.tsx             # Entry point
├── index.css            # Tailwind + theme variables
├── components/
│   └── ErrorBoundary    # Error handling
├── pages/public/
│   ├── Landing          # Landing page
│   └── NotMe            # NotMe app showcase
├── hooks/
│   └── useDarkMode      # Theme toggle
├── data/
│   ├── config           # Site configuration
│   └── notme            # NotMe page content
└── types/               # TypeScript interfaces
```

## Color Palette

```css
--bg-primary: #FAF9F6      /* Warm ivory */
--text-primary: #1C1C1C    /* Charcoal */
--accent: #2D4A3E          /* Deep tea green */
--bg-dark: #0D1117         /* Dark mode bg */
--text-dark: #E6EDF3       /* Dark mode text */
```

## Features

1. **Dark Mode** - System preference detection + manual toggle
2. **Error Boundary** - Graceful error handling
3. **SPA Routing** - GitHub Pages compatible with 404.html fallback

No analytics or visit tracking of any kind.

## Deployment

GitHub Pages via GitHub Actions. Deploys on push to main.
