import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

export default function AuthPage() {
  const location = useLocation();
  const initialMode = (location.state?.mode === 'signup' || location.hash === '#signup') ? 'signup' : 'login';
  const [mode, setMode] = useState(initialMode);
  const { login, signup } = useAuth();

  const toggle = () => setMode(m => (m === 'login' ? 'signup' : 'login'));

  return (
  <div className="container flush auth-wrap">
      <div className="card" style={{ width: 480, maxWidth: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ marginTop: 0 }}>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <button className="btn ghost" onClick={toggle}>
            {mode === 'login' ? 'New here? Sign up' : 'Have an account? Log in'}
          </button>
        </div>
        <AuthForm title={mode === 'login' ? 'Login' : 'Create Account'} onSubmit={mode === 'login' ? login : signup} mode={mode} />
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          {mode === 'signup' ? (
            <a href="#login" onClick={(e) => { e.preventDefault(); setMode('login'); }} style={{ color: 'var(--accent)' }}>
              Already have an account? Log in
            </a>
          ) : (
            <Link to="/forgot-password" style={{ color: 'var(--accent)' }}>Forgot password?</Link>
          )}
        </div>
      </div>
    </div>
  );
}
