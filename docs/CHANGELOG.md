# Changelog

All notable changes to this project.

## [0.2.0] - 2026-01-24

### Added
- **Kamea** - Generative art component
  - 5 mathematical algorithms (rose, star, mandala, eye, complex)
  - Deterministic generation from text input
  - SVG rendering with Framer Motion animations
  - History persistence in localStorage
  - Download SVG functionality

- **Dark Mode** - System-aware theme
  - Detects system preference
  - Manual toggle with persistence
  - Smooth transitions

- **Lab Page** - Experimental features showcase
  - Lazy loaded for performance
  - Error boundary protection

- **CI/CD Pipeline**
  - `ci.yml` - Runs on every commit
  - `deploy.yml` - Production deploy from main only
  - Type check, lint, test, build verification

### Changed
- Landing page with dark mode toggle
- Lazy loading for all non-critical routes
- Code splitting (Kamea: 12KB, others: ~2KB each)

### Technical
- 28 tests passing (algorithms, hooks, components)
- ErrorBoundary at app root
- Performance optimizations via useMemo

---

## [0.1.0] - 2026-01-24

### Added
- Initial React + Vite + TypeScript setup
- Project architecture documentation
- Agent guide for AI assistants
- Archived all previous HTML projects

### Structure
- Minimalist Japanese-inspired design system (Sumi palette)
- Password protection system (client-side)
- Feature-based component organization
