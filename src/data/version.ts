/**
 * Version tracking for aryeh1.github.io
 *
 * Increment rules:
 * - patch: Bug fixes, small changes, documentation
 * - minor: New features, new pages, new components
 * - major: Breaking changes, major redesigns (rare)
 */

export const VERSION = {
  major: 0,
  minor: 2,
  patch: 0,
  date: '2026-01-24',
  changelog: [
    '0.2.0 - Centralized color theme system, fixed dark/light mode, removed email',
    '0.1.4 - Added agent infrastructure (CLAUDE.md, FAILURES.md, hooks, version tracking, +30 tests)',
    '0.1.3 - Simplified CI pipeline',
    '0.1.2 - Dark mode support',
    '0.1.1 - Kamea generative art',
    '0.1.0 - Initial release',
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
