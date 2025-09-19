import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resendOtp, verifyOtp } from '../services/apiService';

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location?.state?.email || '');
  const [code, setCode] = useState(location?.state?.devCode || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage(''); setBusy(true);
    try {
      await verifyOtp({ email, code, purpose: 'signup' });
      setMessage('Email verified! You can now log in.');
      setTimeout(() => navigate('/login'), 800);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Verification failed');
    } finally { setBusy(false); }
  };

  const onResend = async () => {
    setError(''); setMessage(''); setBusy(true);
    try {
      await resendOtp({ email, purpose: 'signup' });
      setMessage('A new code was sent to your email.');
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Could not resend code');
    } finally { setBusy(false); }
  };

  return (
    <div className="container flush" style={{ maxWidth: 420, marginTop: 40 }}>
      <h2>Verify your email</h2>
      <form onSubmit={onSubmit} className="card" style={{ padding: 20 }}>
        <label className="form-label">Email</label>
        <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label className="form-label" style={{ marginTop: 12 }}>Verification code</label>
        <input className="form-input" placeholder="6-digit code" value={code} onChange={e => setCode(e.target.value)} required />
        {error && <div className="error" style={{ marginTop: 8 }}>{error}</div>}
        {message && <div className="success" style={{ marginTop: 8 }}>{message}</div>}
        <button className="btn" type="submit" disabled={busy} style={{ marginTop: 16 }}>Verify</button>
      </form>
      <div style={{ marginTop: 10 }}>
        <button className="btn btn-secondary" onClick={onResend} disabled={busy || !email}>Resend code</button>
      </div>
    </div>
  );
}
