/**
 * Version tracking for aryeh1.github.io
 *
 * Increment rules:
 * - patch: Bug fixes, small changes, documentation
 * - minor: New features, new pages, new components
 * - major: Breaking changes, major redesigns (rare)
 */

export const VERSION = {
  major: 1,
  minor: 0,
  patch: 0,
  date: '2026-01-24',
  changelog: [
    '1.0.0 - Added agent infrastructure (CLAUDE.md, FAILURES.md, hooks, version tracking)',
  ],
} as const;

export const VERSION_STRING = `${VERSION.major}.${VERSION.minor}.${VERSION.patch}`;

export function getVersionInfo() {
  return {
    version: VERSION_STRING,
    date: VERSION.date,
    full: `v${VERSION_STRING} (${VERSION.date})`,
  };
}
