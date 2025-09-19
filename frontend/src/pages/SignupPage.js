import React from 'react';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const { signup } = useAuth();
  return (
    <>
      <AuthForm title="Create Account" onSubmit={signup} mode="signup" />
      <div className="container" style={{ textAlign: 'center', marginTop: -20 }}>
        <a href="/verify-otp" style={{ color: 'var(--accent)' }}>Already have a code? Verify here</a>
      </div>
    </>
  );
}
