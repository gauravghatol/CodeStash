import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, signup as apiSignup } from '../services/apiService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Restore auth state from localStorage
    const storedToken = localStorage.getItem('codestash_token');
    const storedUser = localStorage.getItem('codestash_user');
    if (storedToken) setToken(storedToken);
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch {}
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    setIsLoading(true); setError(null);
    try {
      const { token: jwt, user: u } = await apiLogin(credentials);
      localStorage.setItem('codestash_token', jwt);
      localStorage.setItem('codestash_user', JSON.stringify(u));
      setToken(jwt); setUser(u);
  const next = localStorage.getItem('redirect_after_login') || '/';
  try { localStorage.removeItem('redirect_after_login'); } catch {}
  navigate(next);
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || 'Login failed';
      setError(msg);
      throw e;
    } finally { setIsLoading(false); }
  };

  const signup = async (data) => {
    setIsLoading(true); setError(null);
    try {
      // Backend returns message and may include devCode in development fallback
  const resp = await apiSignup(data);
      const devCode = resp?.devCode;
  // Redirect to OTP verification page and pass through devCode if present
  navigate('/verify-otp', { state: { email: data.email, devCode } });
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || 'Signup failed';
      setError(msg);
      throw e;
    } finally { setIsLoading(false); }
  };

  const logout = () => {
    localStorage.removeItem('codestash_token');
    localStorage.removeItem('codestash_user');
    setUser(null); setToken(null);
  navigate('/auth');
  };

  const value = useMemo(() => ({ user, token, isLoading, error, login, signup, logout }), [user, token, isLoading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { AuthContext };
