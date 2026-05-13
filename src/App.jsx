import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import { GamificationProvider } from './features/gamification/GamificationContext';
import { CourseProvider } from './features/course/CourseContext';
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
import XPToast from './components/XPToast';
import AiBuddyPanel from './features/ai-buddy/AiBuddyPanel';
import { Bot } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AppLayout = () => {
  const [aiBuddyOpen, setAiBuddyOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <CourseSidebar />
      <main style={{
        flex: 1,
        padding: 'var(--spacing-md)',
        overflowY: 'auto',
        position: 'relative',
      }}>
        <div className="container">
          <Outlet />
        </div>

        {/* AI Buddy FAB */}
        <button
          onClick={() => setAiBuddyOpen(true)}
          className="animate-scale-in"
          style={{
            position: 'fixed',
            bottom: 'var(--spacing-xl)',
            right: 'var(--spacing-xl)',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow-lg)',
            transition: 'all var(--transition-smooth)',
            zIndex: 100,
            border: 'none',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 0 40px rgba(139, 92, 246, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'var(--shadow-glow-lg)';
          }}
          title="AI Study Buddy"
        >
          <Bot size={24} color="#fff" />
        </button>

        {/* AI Buddy Panel */}
        <AiBuddyPanel isOpen={aiBuddyOpen} onClose={() => setAiBuddyOpen(false)} />
      </main>

      {/* XP Toast notifications */}
      <XPToast />
    </div>
  );
};

const AppContent = () => {
  const { user } = useAuth();
  const [showIntro, setShowIntro] = useState(!user);
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
    } else if (isLoggedIn && !user) {
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
