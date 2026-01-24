# Site Architecture

## Overview

Personal website for Aryeh Lopian - Software Engineer.
Minimalist Japanese-inspired design. React + TypeScript + Vite.

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
│   ├── ui/              # Basic UI (Button, Card, Input)
│   ├── layout/          # Layout components (Header, Footer)
│   └── features/        # Feature-specific components
├── pages/               # Page components
│   ├── public/          # Public pages (anyone can see)
│   └── private/         # Password-protected pages
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── services/            # API services, external integrations
├── types/               # TypeScript type definitions
├── styles/              # Global styles, Tailwind config
└── data/                # Static data, JSON files

public/
├── assets/              # Static assets (images, fonts)
└── projects/            # Archived project demos

docs/
├── ARCHITECTURE.md      # This file
├── AGENT_GUIDE.md       # Guide for AI agents
├── CHANGELOG.md         # Version history
└── RUN_LOG.md           # CI/CD run results
```

## Key Features

### 1. Password Protection System
- Client-side gate (cosmetic, not secure)
- Environment variable for password hash
- Protected routes via React Router

### 2. Agent-Friendly Code Structure
- Clear file naming conventions
- JSDoc comments on all exports
- `AGENT_GUIDE.md` with code placement instructions
- Modular components easy to extend

### 3. CI/CD Pipeline
- GitHub Actions for build/test/deploy
- Results logged to `docs/RUN_LOG.md`
- Automatic deployment to GitHub Pages

### 4. Feature Modules (Upgradable)
Each feature is self-contained:
```
src/features/[feature-name]/
├── index.ts             # Public exports
├── [Feature].tsx        # Main component
├── [Feature].test.tsx   # Tests
├── hooks/               # Feature-specific hooks
└── utils/               # Feature-specific utils
```

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **Testing**: Vitest + React Testing Library
- **Deployment**: GitHub Pages
- **CI/CD**: GitHub Actions

## Routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Landing page |
| `/projects` | Public | Project showcase |
| `/app/not-me` | Public | Not Me app preview |
| `/private` | Protected | Personal dashboard |
| `/private/lab` | Protected | Experimental features |

## For Future Agents

See `AGENT_GUIDE.md` for:
- Where to add new components
- How to add new routes
- Testing conventions
- Deployment process
