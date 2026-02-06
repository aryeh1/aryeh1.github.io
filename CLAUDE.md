# CLAUDE.md - Agent Instructions

## What Is This Repo?

A **minimal public landing page** for [aryehlopian.com](https://aryehlopian.com).

That's it. One page with name, title, and social links.

## Tech Stack

React 19 + TypeScript + Vite + Tailwind + Framer Motion

## Structure

```
src/
├── App.tsx                    # Routes (all paths → Landing)
├── main.tsx                   # Entry point
├── index.css                  # Tailwind + CSS variables
├── components/
│   └── ErrorBoundary.tsx      # Error handling
├── pages/public/
│   └── Landing.tsx            # The only page
├── hooks/
│   ├── useDarkMode.ts         # Theme toggle (has tests)
│   └── useDarkMode.test.ts
├── data/
│   └── config.ts              # Site config & social links
└── types/
    └── index.ts               # TypeScript interfaces
```

**Total: ~12 files.** Keep it minimal.

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

## Key Files

| File | Purpose | Notes |
|------|---------|-------|
| `src/pages/public/Landing.tsx` | The landing page | Main content |
| `src/data/config.ts` | Name, title, links | Edit to update info |
| `src/hooks/useDarkMode.ts` | Light/dark theme | Has tests |
| `src/index.css` | Theme colors | CSS variables for theming |

## Adding a New Page

1. Create file in `src/pages/public/`
2. Add route in `src/App.tsx`
3. Use Tailwind for styles, `dark:` prefix for dark mode

## Future Plans

Additional public pages may be added here over time.
