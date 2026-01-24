# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-01-24

### Added
- Centralized color theme system (`src/data/theme.ts`)
- TypeScript helpers for theme colors: `getThemeColor()`, `cssVar()`
- Proper dark mode support in KameaCanvas component

### Changed
- All colors now managed from single source (`src/index.css` for CSS, `src/data/theme.ts` for JS)
- KameaCanvas now respects dark/light mode theme
- Improved CSS organization with clear sections

### Removed
- Email from public display (privacy)
- Old `docs/` folder (gh-pages deployment artifacts)

### Fixed
- White text on white background issues in light mode
- Hardcoded colors in KameaCanvas SVG

## [0.1.4] - 2026-01-24

### Added
- Agent infrastructure (CLAUDE.md, FAILURES.md)
- Git hooks for pre-commit validation
- Version tracking system
- 30+ unit tests

## [0.1.3] - 2026-01-24

### Changed
- Simplified CI/CD pipeline
- Reorganized Lab page with categories

## [0.1.2] - 2026-01-24

### Added
- Dark mode support with system preference detection
- Theme toggle button

## [0.1.1] - 2026-01-24

### Added
- Kamea generative art component
- Hebrew text support
- Download SVG functionality

## [0.1.0] - 2026-01-24

### Added
- Initial release
- Landing page with Japanese-inspired minimalism
- Projects page
- Lab page with experiments
- NotMe app showcase
- React 19 + TypeScript + Vite + Tailwind setup
