import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Landing } from '@/pages/public/Landing';
import { ProtectedRoute } from '@/components/auth';
import './index.css';

// Lazy load non-critical routes
const Projects = lazy(() => import('@/pages/public/Projects').then(m => ({ default: m.Projects })));
const NotMeApp = lazy(() => import('@/pages/public/NotMeApp').then(m => ({ default: m.NotMeApp })));
const Lab = lazy(() => import('@/pages/public/Lab').then(m => ({ default: m.Lab })));
const Dashboard = lazy(() => import('@/pages/private/Dashboard').then(m => ({ default: m.Dashboard })));

/** Loading fallback */
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent
                        rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

/** Handle GitHub Pages SPA redirect */
function RedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = sessionStorage.getItem('redirect');
    if (redirect) {
      sessionStorage.removeItem('redirect');
      navigate(redirect, { replace: true });
    }
  }, [navigate]);

  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <RedirectHandler />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/app/not-me" element={<NotMeApp />} />
            <Route path="/lab" element={<Lab />} />

            {/* Protected routes */}
            <Route
              path="/private"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/private/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 - redirect to home */}
            <Route path="*" element={<Landing />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
