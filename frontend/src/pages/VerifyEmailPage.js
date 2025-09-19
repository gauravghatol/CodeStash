import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { verifyEmail } from '../services/apiService';

export default function VerifyEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const run = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
        setMessage('Email verified successfully. You can now log in.');
        setTimeout(() => navigate('/login'), 1500);
      } catch (e) {
        setStatus('error');
        setMessage(e?.response?.data?.message || e.message || 'Verification failed');
      }
    };
    if (token) run();
  }, [token, navigate]);

  return (
    <div className="container" style={{ display: 'grid', placeItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
      <div className="card" style={{ width: 480, maxWidth: '100%', textAlign: 'center' }}>
        <h2 style={{ marginTop: 0 }}>Verify Email</h2>
        <p className={status === 'error' ? 'error' : 'helper'}>{message}</p>
        {status === 'error' && (
          <div style={{ marginTop: 12 }}>
            <button className="btn" onClick={() => navigate('/login')}>Go to Login</button>
          </div>
        )}
      </div>
    </div>
  );
}
