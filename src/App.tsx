import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import TimelinePage from '@/pages/TimelinePage';
import NewDiaryPage from '@/pages/NewDiaryPage';
import DiaryDetailPage from '@/pages/DiaryDetailPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

export default function App() {
  const basename = import.meta.env.DEV ? '/' : '/sunny-diary';

  return (
    <Router basename={basename}>
      <ThemeProvider>
        <AuthProvider>
          <ProfileProvider>
            <ScrollToTop />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<ProtectedRoute><TimelinePage /></ProtectedRoute>} />
              <Route path="/new" element={<ProtectedRoute><NewDiaryPage /></ProtectedRoute>} />
              <Route path="/diary/:id" element={<ProtectedRoute><DiaryDetailPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            </Routes>
          </ProfileProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}