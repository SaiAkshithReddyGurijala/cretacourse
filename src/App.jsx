import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import { GamificationProvider } from './features/gamification/GamificationContext';
import CourseSidebar from './features/course/CourseSidebar';
import CourseView from './features/course/CourseView';
import ProfilePage from './features/gamification/ProfilePage';
import NotesPage from './features/notes/NotesPage';
import LoginPage from './features/auth/LoginPage';
import SignupPage from './features/auth/SignupPage';
import CourseCreator from './features/creator/CourseCreator';
import AdminDashboard from './features/admin/AdminDashboard';
import HomePage from './features/home/HomePage';
import IntroAnimation from './components/IntroAnimation';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AppLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <CourseSidebar />
      <main style={{ flex: 1, padding: 'var(--spacing-md)', overflowY: 'auto' }}>
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const AppContent = () => {
  const { user } = useAuth();
  const [showIntro, setShowIntro] = useState(!user);
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);

  // Handle initial load intro
  useEffect(() => {
    // We can keep the session storage check if we want it only once per session,
    // but the user requested "every time he refreshes".
    // So we default to true.
  }, []);

  // Watch for logout to trigger animation again
  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
    } else if (isLoggedIn && !user) {
      // User just logged out
      setShowIntro(true);
      setIsLoggedIn(false);
    }
  }, [user, isLoggedIn]);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  if (showIntro) {
    return <IntroAnimation onComplete={handleIntroComplete} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<HomePage />} />
          <Route path="phase/:phaseId" element={<CourseView />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="create" element={<CourseCreator />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
};

import { CourseProvider } from './features/course/CourseContext';

function App() {
  return (
    <AuthProvider>
      <CourseProvider>
        <GamificationProvider>
          <AppContent />
        </GamificationProvider>
      </CourseProvider>
    </AuthProvider>
  );
}

export default App;
