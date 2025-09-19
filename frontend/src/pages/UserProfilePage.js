import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUserSnippets } from '../services/apiService';
import SnippetCard from '../components/SnippetCard';

export default function UserProfilePage() {
  const { user } = useAuth();
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true); setError(null);
        const data = await fetchUserSnippets(user?._id || user?.id);
        setSnippets(Array.isArray(data) ? data : data?.snippets || []);
      } catch (e) {
        setError(e?.response?.data?.message || e.message);
      } finally { setLoading(false); }
    };
    if (user) load();
  }, [user]);

  if (!user) return null;

  return (
    <div className="container" style={{ padding: '16px 0 32px' }}>
      <div className="page-header">
        <div>
          <div className="page-title">@{user.username || 'you'}</div>
          <div className="subtitle">Your snippets and profile</div>
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}

      <div className="grid cols-3" style={{ marginTop: 16 }}>
        {snippets.map(sn => (
          <SnippetCard key={sn._id || sn.id} snippet={sn} />
        ))}
      </div>
    </div>
  );
}
