import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSnippet } from '../services/apiService';
import { LANGUAGES, DEFAULT_LANGUAGE } from '../constants/languages';

export default function CreateSnippetPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [tags, setTags] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!title || !code) { setError('Title and Code are required'); return; }
    try {
      setSubmitting(true);
      const payload = {
        title,
        description,
        language,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        code,
      };
      const created = await createSnippet(payload);
      const id = created?._id || created?.id;
      if (id) navigate(`/snippets/${id}`);
      else navigate('/');
    } catch (e2) {
      setError(e2?.response?.data?.message || e2.message || 'Failed to create snippet');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="container" style={{ padding: '16px 0 32px' }}>
      <div className="page-header">
        <div className="page-title">New Snippet</div>
      </div>
      <div className="card">
        <form className="form" onSubmit={onSubmit}>
          <div className="form-row">
            <label>Title</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="form-row">
            <label>Description</label>
            <textarea className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 12 }}>
            <div className="form-row">
              <label>Language</label>
              <select className="select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label>Tags (comma separated)</label>
              <input className="input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="react, hooks, api" />
            </div>
          </div>
          <div className="form-row">
            <label>Code</label>
            <textarea className="textarea" style={{ minHeight: 260, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }} value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          {error && <div className="error">{error}</div>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn ghost" onClick={() => window.history.back()}>Cancel</button>
            <button className="btn primary" type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create Snippet'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
