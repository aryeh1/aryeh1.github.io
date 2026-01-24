import { useEffect, lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Landing } from '@/pages/public/Landing';
import { ProtectedRoute } from '@/components/auth';
import { Header } from '@/components/layout';
import './index.css';

// Lazy load non-critical routes
const Projects = lazy(() => import('@/pages/public/Projects').then(m => ({ default: m.Projects })));
const NotMeApp = lazy(() => import('@/pages/public/NotMeApp').then(m => ({ default: m.NotMeApp })));
const Lab = lazy(() => import('@/pages/public/Lab').then(m => ({ default: m.Lab })));
const Cholent = lazy(() => import('@/pages/public/Cholent').then(m => ({ default: m.Cholent })));
const Dashboard = lazy(() => import('@/pages/private/Dashboard').then(m => ({ default: m.Dashboard })));

/** Loading fallback */
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent
                        rounded-full animate-spin mx-auto" />
        <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">Loading...</p>
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

/** Layout wrapper with header for protected pages */
function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <>
        <Header />
        {children}
      </>
    </ProtectedRoute>
  );
}

/** App content with conditional header */
function AppContent() {

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Landing page - no header, no protection */}
        <Route path="/" element={<Landing />} />

        {/* All other routes - protected with header */}
        <Route
          path="/projects"
          element={
            <ProtectedLayout>
              <Projects />
            </ProtectedLayout>
          }
        />
        <Route
          path="/app/not-me"
          element={
            <ProtectedLayout>
              <NotMeApp />
            </ProtectedLayout>
          }
        />
        <Route
          path="/lab"
          element={
            <ProtectedLayout>
              <Lab />
            </ProtectedLayout>
          }
        />
        <Route
          path="/lab/cholent"
          element={
            <ProtectedLayout>
              <Cholent />
            </ProtectedLayout>
          }
        />
        <Route
          path="/private"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />
        <Route
          path="/private/*"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />

        {/* 404 - redirect to home */}
        <Route path="*" element={<Landing />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <RedirectHandler />
        <AppContent />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
