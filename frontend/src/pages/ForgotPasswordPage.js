import React, { useState } from 'react';
import { forgotPassword } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage(''); setBusy(true);
    try {
      await forgotPassword(email);
      setMessage('If an account exists, a code has been sent.');
      setTimeout(() => navigate('/reset-password', { state: { email } }), 800);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Request failed');
    } finally { setBusy(false); }
  };

  return (
    <div className="container flush" style={{ maxWidth: 420, marginTop: 40 }}>
      <h2>Forgot password</h2>
      <form onSubmit={onSubmit} className="card" style={{ padding: 20 }}>
        <label className="form-label">Email</label>
        <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        {error && <div className="error" style={{ marginTop: 8 }}>{error}</div>}
        {message && <div className="success" style={{ marginTop: 8 }}>{message}</div>}
        <button className="btn" type="submit" disabled={busy} style={{ marginTop: 16 }}>Send code</button>
      </form>
    </div>
  );
}
