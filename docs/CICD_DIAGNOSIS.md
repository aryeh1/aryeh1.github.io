# CI/CD Deployment Issue - Diagnosis & Fix

## Issue Summary
The site is not deploying with the correct version number. The version displayed shows `v1.0.1-xxxxx` instead of the expected `v1.0.146-xxxxx`.

## Root Cause
**Problem:** GitHub Actions `actions/checkout@v4` performs a shallow clone by default (`fetch-depth: 1`).

This causes the `vite.config.ts` version generation to fail:
```typescript
const commitCount = execSync('git rev-list --count HEAD', { encoding: 'utf-8' }).trim()
```

With shallow clone:
- Expected: `146` (full history commit count)
- Actual: `1` (only the latest commit is cloned)

## Affected Files
1. `.github/workflows/deploy.yml` - Production deployment
2. `.github/workflows/ci.yml` - CI pipeline (build job)

## Fix Applied
Added `fetch-depth: 0` to checkout steps to fetch full git history.

### deploy.yml
```yaml
- name: Checkout
  uses: actions/checkout@v4
  with:
    fetch-depth: 0  # Full history for version generation
```

### ci.yml
```yaml
# In build job - needs full history for version
- name: Checkout
  uses: actions/checkout@v4
  with:
    fetch-depth: 0
```

## Version System
- Format: `v1.0.{commit_count}-{short_hash}`
- Source: `vite.config.ts` lines 8-20
- Display: `src/pages/public/Landing.tsx` footer

## Verification
After merge to main:
1. Check GitHub Actions deploy workflow completes
2. Visit https://aryehlopian.com
3. Verify footer shows correct version (e.g., `v1.0.147-xxxxxxx`)

## Status
- [x] Fix committed to main (e4f740c)
- [x] Trigger deploy workflow

## Date
2026-01-24
