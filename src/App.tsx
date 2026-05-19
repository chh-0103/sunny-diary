import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import TimelinePage from '@/pages/TimelinePage';
import NewDiaryPage from '@/pages/NewDiaryPage';
import DiaryDetailPage from '@/pages/DiaryDetailPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <Router basename="/sunny-diary">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<TimelinePage />} />
        <Route path="/new" element={<NewDiaryPage />} />
        <Route path="/diary/:id" element={<DiaryDetailPage />} />
      </Routes>
    </Router>
  );
}