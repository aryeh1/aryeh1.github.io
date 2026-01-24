# Agent Guide

Guide for AI agents working on this codebase.

## Quick Start

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:5173)
npm run test         # Run tests
npm run build        # Build for production
```

## Adding New Components

### 1. UI Component (reusable)
Location: `src/components/ui/`

```tsx
// src/components/ui/MyComponent.tsx
interface MyComponentProps {
  /** Description of prop */
  label: string;
}

/** Brief description of component */
export function MyComponent({ label }: MyComponentProps) {
  return <div>{label}</div>;
}
```

### 2. Feature Component (self-contained feature)
Location: `src/features/[feature-name]/`

```
src/features/my-feature/
├── index.ts              # export { MyFeature } from './MyFeature'
├── MyFeature.tsx         # Main component
├── MyFeature.test.tsx    # Tests
└── useMyFeature.ts       # Custom hook (if needed)
```

### 3. Page Component
Location: `src/pages/public/` or `src/pages/private/`

```tsx
// src/pages/public/MyPage.tsx
export function MyPage() {
  return (
    <main className="min-h-screen">
      {/* Page content */}
    </main>
  );
}
```

Then add route in `src/App.tsx`.

## Adding New Routes

Edit `src/App.tsx`:

```tsx
// Public route
<Route path="/my-page" element={<MyPage />} />

// Protected route
<Route path="/private/my-page" element={
  <ProtectedRoute>
    <MyPrivatePage />
  </ProtectedRoute>
} />
```

## Password Protection

Protected pages require password. The system uses:
- SHA-256 hash comparison (client-side)
- LocalStorage for session persistence
- NOT secure for sensitive data (GitHub Pages is static)

To add protected content:
```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

<ProtectedRoute>
  <SensitiveContent />
</ProtectedRoute>
```

## Testing

Every component should have tests:

```tsx
// MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders label', () => {
    render(<MyComponent label="Hello" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

Run tests: `npm run test`

## Styling

Use Tailwind CSS classes. Color variables:

```tsx
// Primary colors
className="bg-[#FAF9F6] text-[#1C1C1C]"

// Accent
className="text-[#2D4A3E]"

// Dark mode
className="dark:bg-[#0D1117] dark:text-[#E6EDF3]"
```

## Deployment

Automatic via GitHub Actions on push to main.

Manual: `npm run build` then deploy `dist/` folder.

## File Naming Conventions

- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utils: `camelCase.ts`
- Tests: `*.test.tsx`
- Types: `types.ts` or `*.types.ts`

## Common Tasks

### Add a project to showcase
1. Add project data to `src/data/projects.ts`
2. If interactive, create feature in `src/features/`
3. Add route if needed

### Add external bot-generated code
1. Review code for security issues
2. Create feature folder in `src/features/`
3. Adapt to TypeScript and project conventions
4. Add tests
5. Import in relevant page

### Debug production issues
1. Check `docs/RUN_LOG.md` for recent CI results
2. Run `npm run build` locally
3. Check browser console on production site
