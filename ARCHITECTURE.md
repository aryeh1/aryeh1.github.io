# Site Architecture

## Overview

Personal website for Aryeh Lopian - Software Engineer.
Minimalist Japanese-inspired design. React 19 + TypeScript + Vite.

## Color Palette (Sumi - 墨)

```
--bg-primary: #FAF9F6      /* Warm ivory */
--text-primary: #1C1C1C    /* Charcoal */
--accent: #2D4A3E          /* Deep tea green */
--bg-dark: #0D1117         /* Dark mode bg */
--text-dark: #E6EDF3       /* Dark mode text */
```

## Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication (ProtectedRoute)
│   ├── kamea/           # Generative art component
│   └── ErrorBoundary    # Error handling
├── pages/               # Page components
│   ├── public/          # Public pages
│   │   ├── Landing      # Home page
│   │   ├── Lab          # Experimental features
│   │   ├── Projects     # Project showcase
│   │   └── NotMeApp     # App preview
│   └── private/         # Protected pages
│       └── Dashboard    # Admin dashboard
├── hooks/               # Custom React hooks
│   ├── useAuth          # Authentication
│   ├── useDarkMode      # Theme management
│   └── useKamea         # Kamea generator
├── lib/                 # Library code
│   └── kamea/           # Kamea algorithms
│       ├── algorithms   # Mathematical generators
│       └── types        # TypeScript types
├── data/                # Static data, config
└── types/               # Global TypeScript types

public/
├── 404.html             # SPA fallback
└── robots.txt           # Search engine rules

docs/
├── AGENT_GUIDE.md       # Guide for AI agents
├── CHANGELOG.md         # Version history
└── RUN_LOG.md           # CI/CD results
```

## Key Features

### 1. Kamea - Generative Art Engine
- Mathematical algorithms (rose curves, mandalas, stars)
- Deterministic generation from text input (hash-based)
- SVG rendering with Framer Motion animations
- History persistence via localStorage

### 2. Dark Mode System
- System preference detection
- Manual toggle with persistence
- CSS variables for theming
- Tailwind dark: classes

### 3. Password Protection
- Client-side gate (cosmetic only)
- SHA-256 hash verification
- Protected routes via React Router

### 4. Performance Optimizations
- Code splitting via lazy loading
- React.lazy for non-critical routes
- Tree-shaking via Vite
- Efficient re-renders via useMemo

### 5. Error Handling
- ErrorBoundary at app root
- Graceful fallback UI
- Error logging

### 6. CI/CD Pipeline
```
ci.yml:
  - Runs on every commit (all branches)
  - Type check → Lint → Test → Build
  - Staging deploy for non-main branches

deploy.yml:
  - Runs only on main branch
  - Full verification + production deploy
  - GitHub Pages deployment
```

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion 12 |
| Testing | Vitest + Testing Library |
| Deployment | GitHub Pages |
| CI/CD | GitHub Actions |

## Routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Landing page |
| `/projects` | Public | Project showcase |
| `/app/not-me` | Public | Not Me app preview |
| `/lab` | Public | Experimental features (Kamea) |
| `/private` | Protected | Personal dashboard |

## Bundle Analysis

```
dist/
├── index.html           ~1 KB
├── index.css           ~70 KB (Tailwind)
├── index.js           ~354 KB (React + router + motion)
├── Kamea.js            ~12 KB (lazy loaded)
├── Lab.js               ~1 KB (lazy loaded)
├── Projects.js          ~2 KB (lazy loaded)
├── Dashboard.js         ~2 KB (lazy loaded)
└── NotMeApp.js          ~1 KB (lazy loaded)
```

## For Future Agents

See `AGENT_GUIDE.md` for:
- Where to add new components
- How to add new routes
- Testing conventions
- Deployment process
