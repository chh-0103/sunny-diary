import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import TimelinePage from '@/pages/TimelinePage';
import NewDiaryPage from '@/pages/NewDiaryPage';
import DiaryDetailPage from '@/pages/DiaryDetailPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

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
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<ProtectedRoute><TimelinePage /></ProtectedRoute>} />
          <Route path="/new" element={<ProtectedRoute><NewDiaryPage /></ProtectedRoute>} />
          <Route path="/diary/:id" element={<ProtectedRoute><DiaryDetailPage /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}