import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import SnippetDetailPage from './pages/SnippetDetailPage';
import CreateSnippetPage from './pages/CreateSnippetPage';
import UserProfilePage from './pages/UserProfilePage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { token, isLoading } = useAuth();
  if (isLoading) return <div className="container" style={{ padding: 20 }}>Loading...</div>;
  if (!token) {
    try { localStorage.setItem('redirect_after_login', location.pathname + location.search); } catch {}
    return <Navigate to="/auth" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <div className="app-shell">
        <Navbar />
        <main className="app-main">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
    <Route path="/verify-otp" element={<VerifyOtpPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/snippets/new" element={
          <ProtectedRoute>
            <CreateSnippetPage />
          </ProtectedRoute>
        } />
        <Route path="/snippets/:id" element={
          <ProtectedRoute>
            <SnippetDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
