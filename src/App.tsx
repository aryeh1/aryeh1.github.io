import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Landing } from '@/pages/public/Landing';
import { NotMe } from '@/pages/public/NotMe';
import { PostMagazine } from '@/pages/public/PostMagazine';
import { PostInvestigative } from '@/pages/public/PostInvestigative';
import { PostMinimal } from '@/pages/public/PostMinimal';
import './index.css';

// Lazy-loaded — keeps the landing page bundle small. The graph code
// (React Flow, dagre, fuse, html-to-image) only loads on /litvish.
const LitvishNetwork = lazy(() =>
  import('@/pages/public/LitvishNetwork').then((m) => ({ default: m.LitvishNetwork })),
);

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/notme" element={<NotMe />} />
          <Route path="/post/magazine" element={<PostMagazine />} />
          <Route path="/post/investigative" element={<PostInvestigative />} />
          <Route path="/post/minimal" element={<PostMinimal />} />
          {/* Unlinked Hebrew RTL family-and-power network. */}
          <Route
            path="/litvish"
            element={
              <Suspense fallback={null}>
                <LitvishNetwork />
              </Suspense>
            }
          />
          <Route
            path="/network"
            element={
              <Suspense fallback={null}>
                <LitvishNetwork />
              </Suspense>
            }
          />
          {/* Landing page - all other routes redirect here */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
