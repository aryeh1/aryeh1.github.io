# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2026-02-06

### Changed
- **SEO Optimization**: Enabled Google indexing by removing robots noindex meta tag
- Added Hebrew name metadata (אריה לופיאן) for improved search discoverability
- Updated robots.txt to allow all search engines
- Simplified 404.html redirect logic
- Streamlined App.tsx routing (removed unnecessary RedirectHandler)

### Removed
- All references to lab URL and external links
- Unused theme.ts (colors managed via CSS variables only)
- Unused version.ts (version auto-generated from git at build time)
- Unused assets (vite.svg, react.svg)
- Dead code from App.tsx (RedirectHandler, AppContent wrapper)

## [0.3.0] - 2026-01-24

### Changed
- **Repository split**: This repo now contains only the public landing page
- Updated all documentation (CLAUDE.md, README.md, ARCHITECTURE.md) to reflect minimal scope

### Removed
- All pages except Landing (Lab, Projects, Dashboard, NotMeApp, Links)
- Authentication system (useAuth, ProtectedRoute)
- Kamea generative art engine
- Layout components (Header, navigation)

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
