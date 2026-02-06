# Architecture

## Overview

Minimal landing page for [aryehlopian.com](https://aryehlopian.com).

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
├── App.tsx              # Router (all paths → Landing)
├── main.tsx             # Entry point
├── index.css            # Tailwind + theme variables
├── components/
│   └── ErrorBoundary    # Error handling
├── pages/public/
│   └── Landing          # The only page
├── hooks/
│   └── useDarkMode      # Theme toggle
├── data/
│   └── config           # Site configuration
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

## Deployment

GitHub Pages via GitHub Actions. Deploys on push to main.
