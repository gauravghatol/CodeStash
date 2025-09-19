import React, { useEffect, useState } from 'react';

export default function AuthForm({ title = 'Login', onSubmit, mode = 'login' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { setError(null); }, [email, password, username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email || !password || (mode === 'signup' && !username)) {
      setError('Please fill in all required fields.');
      return;
    }
    try {
      setSubmitting(true);
      if (mode === 'signup') {
        await onSubmit?.({ email, password, username });
      } else {
        await onSubmit?.({ email, password });
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Something went wrong');
    } finally { setSubmitting(false); }
  };

  return (
    <div>
      <div>
        <h2 style={{ marginTop: 0 }}>{title}</h2>
        <form className="form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="form-row">
              <label>Username</label>
              <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="octocat" />
            </div>
          )}
          <div className="form-row">
            <label>Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="form-row">
            <label>Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <div className="error">{error}</div>}
          <button className="btn primary" type="submit" disabled={submitting} style={{ marginTop: 4 }}>{submitting ? 'Submitting...' : title}</button>
        </form>
      </div>
    </div>
  );
}
