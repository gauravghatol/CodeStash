import React from 'react';
import { Link } from 'react-router-dom';

export default function SnippetCard({ snippet }) {
  const preview = (snippet?.code || '').split('\n').slice(0, 6).join('\n');
  return (
    <Link to={`/snippets/${snippet._id || snippet.id}`} className="card" style={{ display: 'block' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <h3 style={{ margin: 0 }}>{snippet.title}</h3>
        {snippet.language && <span className="tag">{snippet.language}</span>}
      </div>
      <div className="helper" style={{ marginTop: 6 }}>by {snippet.author?.username || 'anonymous'}</div>
      <div className="code-preview" style={{ marginTop: 12 }}>
        <pre style={{ margin: 0 }}>
{preview}
        </pre>
      </div>
      {snippet.tags?.length ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {snippet.tags.map((t) => <span className="tag" key={t}>#{t}</span>)}
        </div>
      ) : null}
    </Link>
  );
}
