import React from 'react';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  return (
    <>
      <AuthForm title="Login" onSubmit={login} mode="login" />
      <div className="container" style={{ textAlign: 'center', marginTop: -20 }}>
        <a href="/forgot-password" style={{ color: 'var(--accent)' }}>Forgot password?</a>
      </div>
    </>
  );
}
