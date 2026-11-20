# CLAUDE.md - Agent Instructions

## What Is This Repo?

A **minimal public landing page** for [aryehlopian.com](https://aryehlopian.com).

Two pages:

- `/` — Landing: name, title, and social links
- `/notme` — NotMe app showcase

Every other path falls back to the landing page.

## Tech Stack

React 19 + TypeScript + Vite + Tailwind + Framer Motion

## Structure

```
src/
├── App.tsx                    # Routes (/notme → NotMe, everything else → Landing)
├── main.tsx                   # Entry point
├── index.css                  # Tailwind + CSS variables
├── components/
│   └── ErrorBoundary.tsx      # Error handling
├── pages/public/
│   ├── Landing.tsx            # Landing page
│   └── NotMe.tsx              # NotMe app showcase
├── hooks/
│   ├── useDarkMode.ts         # Theme toggle (has tests)
│   └── useDarkMode.test.ts
├── data/
│   ├── config.ts              # Site config & social links
│   └── notme.ts               # NotMe page content
└── types/
    └── index.ts               # TypeScript interfaces
```

**Total: ~14 files.** Keep it minimal.

## Commands

```bash
npm run dev       # Local development
npm run build     # Production build
npm run test      # Run tests
npm run lint      # Check code style
```

## Before Committing

```bash
npm run test && npm run lint && npm run build
```

All three must pass.

## Rules

1. **Keep it minimal** - This is just a landing page
2. **No secrets in code** - Use environment variables
3. **TypeScript strict** - No `any` types
4. **Test what has logic** - Currently only `useDarkMode` has tests
5. **No tracking** - The site has no analytics, visit counter, or third-party scripts (Google Fonts is the only external request). Don't add any without being asked

## Key Files

| File | Purpose | Notes |
|------|---------|-------|
| `src/pages/public/Landing.tsx` | The landing page | Main content |
| `src/pages/public/NotMe.tsx` | NotMe app showcase | Linked from the landing page |
| `src/data/config.ts` | Name, title, links | Edit to update info |
| `src/data/notme.ts` | NotMe page content | Features, privacy points, Play Store link |
| `src/hooks/useDarkMode.ts` | Light/dark theme | Has tests |
| `src/index.css` | Theme colors | CSS variables for theming |

## Adding a New Page

1. Create file in `src/pages/public/`
2. Add route in `src/App.tsx`
3. Use Tailwind for styles, `dark:` prefix for dark mode

## Future Plans

Additional public pages may be added here over time.
