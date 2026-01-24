# CLAUDE.md - Agent Instructions

## Quick Start

```bash
# Verify you're in the right place
pwd  # Should be: .../aryeh1.github.io

# Before ANY work
npm run test        # Must pass
npm run lint        # Must pass
npm run build       # Must succeed

# After changes
npm run test        # Still passing?
```

## Project Overview

Personal website for Aryeh Lopian. React 19 + TypeScript + Vite + Tailwind.

**Live site:** https://aryehlopian.com

## Architecture

```
src/
├── components/     # Reusable UI components
│   ├── auth/       # Authentication (ProtectedRoute)
│   ├── kamea/      # Generative art component
│   └── layout/     # Header, navigation
├── hooks/          # Custom React hooks
│   ├── useAuth.ts      # Client-side auth with SHA-256
│   ├── useDarkMode.ts  # Theme management (light/dark/system)
│   └── useKamea.ts     # Generative pattern hooks
├── lib/            # Pure functions (no React)
│   └── kamea/      # Mathematical algorithms
├── pages/
│   ├── public/     # Landing, Projects, Lab, NotMeApp
│   └── private/    # Dashboard (requires auth)
├── data/           # Static data (config, projects)
└── types/          # TypeScript interfaces
```

## Critical Files

| File | Purpose | Touch Carefully |
|------|---------|-----------------|
| `src/data/config.ts` | Site configuration | Yes |
| `src/lib/kamea/algorithms.ts` | Math algorithms | Yes - has tests |
| `src/hooks/useAuth.ts` | Authentication | Yes - security |
| `src/hooks/useDarkMode.ts` | Theme system | Yes - has tests |

## Rules

### Rule 1: Test Before and After
```bash
# BEFORE starting work
npm run test

# AFTER every significant change
npm run test
```

### Rule 2: No Secrets in Code
- Never commit API keys, tokens, passwords
- Use environment variables or hashed values
- The auth system uses SHA-256 hashed passwords

### Rule 3: TypeScript Strict
- All files must be `.ts` or `.tsx`
- No `any` types without justification
- Run `npx tsc --noEmit` to verify

### Rule 4: Keep It Simple
- This is a personal website, not a SaaS
- Avoid over-engineering
- One file is better than ten

### Rule 5: Document Failures
When something fails, add to `FAILURES.md`:
```markdown
## FXXX - Short Title
- **Date:** YYYY-MM-DD
- **What:** What happened
- **Why:** Root cause
- **Fix:** How it was resolved
```

## Testing

```bash
npm run test              # Run once
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report
```

Test files: `*.test.ts` or `*.test.tsx` next to source files.

## Common Tasks

### Add a new page
1. Create file in `src/pages/public/` or `src/pages/private/`
2. Add route in `src/App.tsx`
3. Add nav link in `src/components/layout/Header.tsx` if needed

### Add a new component
1. Create in `src/components/<category>/`
2. Export from `index.ts` in that folder
3. Write test if it has logic

### Modify styles
- Use Tailwind classes
- Dark mode: use `dark:` prefix
- CSS variables defined in `src/index.css`

## Version

Check `src/data/version.ts` for current version.

Increment on:
- `patch`: Bug fixes, small changes
- `minor`: New features
- `major`: Breaking changes (rare for personal site)

## Pre-commit Checklist

Before committing, verify:

- [ ] `npm run test` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] No console.log statements left
- [ ] No hardcoded secrets
- [ ] TypeScript has no errors

## Session Verification

At the start of each session, run:
```bash
npm run test && npm run build && echo "✓ website ready"
```

If this fails, fix it before doing anything else.
