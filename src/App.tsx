import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Landing } from '@/pages/public/Landing';
import { Projects } from '@/pages/public/Projects';
import { NotMeApp } from '@/pages/public/NotMeApp';
import { Dashboard } from '@/pages/private/Dashboard';
import { ProtectedRoute } from '@/components/auth';
import './index.css';

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
    <BrowserRouter>
      <RedirectHandler />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/app/not-me" element={<NotMeApp />} />

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
    </BrowserRouter>
  );
}

export default App;
