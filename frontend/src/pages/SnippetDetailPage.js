import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { deleteSnippet, fetchSnippetById, likeSnippet, updateSnippet } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

export default function SnippetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', code: '', language: '', tags: '' });

  const isAuthor = useMemo(() => !!(user && snippet && (user._id === snippet.author?._id || user.id === snippet.author?.id)), [user, snippet]);

  const load = async () => {
    try {
      setLoading(true); setError(null);
      const data = await fetchSnippetById(id);
      setSnippet(data);
      setForm({
        title: data.title || '',
        description: data.description || '',
        code: data.code || '',
        language: data.language || 'JavaScript',
        tags: (data.tags || []).join(', '),
      });
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); // eslint-disable-next-line
  }, [id]);

  const onLike = async () => {
    try { await likeSnippet(id); await load(); } catch {}
  };

  const onDelete = async () => {
    if (!window.confirm('Delete this snippet?')) return;
    try { await deleteSnippet(id); navigate('/'); } catch (e) { alert(e?.response?.data?.message || e.message); }
  };

  const onSave = async () => {
    try {
      const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
      const updated = await updateSnippet(id, payload);
      setSnippet(updated); setEditMode(false);
    } catch (e) { alert(e?.response?.data?.message || e.message); }
  };

  if (loading) return <div className="container" style={{ padding: 20 }}>Loading...</div>;
  if (error) return <div className="container" style={{ padding: 20 }}><div className="error">{error}</div></div>;
  if (!snippet) return null;

  return (
    <div className="container" style={{ padding: '16px 0 32px' }}>
      <div className="page-header">
        {!editMode ? (
          <div>
            <div className="page-title">{snippet.title}</div>
            <div className="subtitle">by {snippet.author?.username || 'anonymous'}</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input className="input" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} />
          </div>
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={onLike}>Like {snippet.likes ? `(${snippet.likes})` : ''}</button>
          {isAuthor && !editMode && <button className="btn ghost" onClick={() => setEditMode(true)}>Edit</button>}
          {isAuthor && editMode && <button className="btn primary" onClick={onSave}>Save</button>}
          {isAuthor && <button className="btn danger" onClick={onDelete}>Delete</button>}
        </div>
      </div>
      {!editMode ? (
        <>
          {snippet.tags?.length ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {snippet.tags.map(t => <span className="tag" key={t}>#{t}</span>)}
            </div>
          ) : null}
          {snippet.description && <p className="helper">{snippet.description}</p>}
          <div className="card" style={{ padding: 0 }}>
            <SyntaxHighlighter language={(snippet.language || 'javascript').toLowerCase()} style={atomOneDark} customStyle={{ margin: 0, padding: 16, background: 'transparent' }}>
              {snippet.code || ''}
            </SyntaxHighlighter>
          </div>
        </>
      ) : (
        <div className="card">
          <div className="form-row">
            <label>Description</label>
            <textarea className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="form-row">
            <label>Tags</label>
            <input className="input" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </div>
          <div className="form-row">
            <label>Code</label>
            <textarea className="textarea" style={{ minHeight: 320, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          </div>
        </div>
      )}
    </div>
  );
}
