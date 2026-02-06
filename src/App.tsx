import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Landing } from '@/pages/public/Landing';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Landing page - all routes redirect here */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
