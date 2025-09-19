import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPassword, resendOtp } from '../services/apiService';

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location?.state?.email || '');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage(''); setBusy(true);
    try {
      await resetPassword({ email, code, newPassword });
      setMessage('Password reset successful. You can log in now.');
      setTimeout(() => navigate('/login'), 800);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Reset failed');
    } finally { setBusy(false); }
  };

  const onResend = async () => {
    setError(''); setMessage(''); setBusy(true);
    try {
      await resendOtp({ email, purpose: 'password_reset' });
      setMessage('A new code was sent to your email.');
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Could not resend code');
    } finally { setBusy(false); }
  };

  return (
    <div className="container flush" style={{ maxWidth: 420, marginTop: 40 }}>
      <h2>Reset password</h2>
      <form onSubmit={onSubmit} className="card" style={{ padding: 20 }}>
        <label className="form-label">Email</label>
        <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label className="form-label" style={{ marginTop: 12 }}>Verification code</label>
        <input className="form-input" placeholder="6-digit code" value={code} onChange={e => setCode(e.target.value)} required />
        <label className="form-label" style={{ marginTop: 12 }}>New password</label>
        <input className="form-input" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
        {error && <div className="error" style={{ marginTop: 8 }}>{error}</div>}
        {message && <div className="success" style={{ marginTop: 8 }}>{message}</div>}
        <button className="btn" type="submit" disabled={busy} style={{ marginTop: 16 }}>Reset password</button>
      </form>
      <div style={{ marginTop: 10 }}>
        <button className="btn btn-secondary" onClick={onResend} disabled={busy || !email}>Resend code</button>
      </div>
    </div>
  );
}
