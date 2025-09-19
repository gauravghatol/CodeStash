import React, { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import SnippetCard from '../components/SnippetCard';
import { fetchAllSnippets } from '../services/apiService';

export default function HomePage() {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async (params = {}) => {
    try {
      setLoading(true); setError(null);
      const data = await fetchAllSnippets(params);
      setSnippets(Array.isArray(data) ? data : data?.snippets || []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="container wide" style={{ padding: '16px 0 32px' }}>
      <div className="page-header">
        <div>
          <div className="page-title">Discover Snippets</div>
          <div className="subtitle">Explore and share bite-sized code wisdom.</div>
        </div>
      </div>
      <SearchBar onSearch={load} />
      <hr className="separator" />
      {loading && <div>Loading snippets...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !snippets.length && <div className="helper">No snippets found.</div>}
      <div className="grid cols-3" style={{ marginTop: 16 }}>
        {snippets.map(sn => (
          <SnippetCard key={sn._id || sn.id} snippet={sn} />
        ))}
      </div>
    </div>
  );
}
