import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Landing } from '@/pages/public/Landing';
import { SoliMarket } from '@/pages/public/SoliMarket';
import { PostMagazine } from '@/pages/public/PostMagazine';
import { PostInvestigative } from '@/pages/public/PostInvestigative';
import { PostMinimal } from '@/pages/public/PostMinimal';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/solimarket" element={<SoliMarket />} />
          <Route path="/post/magazine" element={<PostMagazine />} />
          <Route path="/post/investigative" element={<PostInvestigative />} />
          <Route path="/post/minimal" element={<PostMinimal />} />
          {/* Landing page - all other routes redirect here */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
