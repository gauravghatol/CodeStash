import React, { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('');

  const submit = (e) => {
    e.preventDefault();
    onSearch?.({ search: text.trim(), language });
  };

  return (
    <form className="form search-bar" onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 200px auto', gap: 10 }}>
      <input className="input" placeholder="Search by title, tag, or language" value={text} onChange={(e) => setText(e.target.value)} />
      <select className="select" value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="">All Languages</option>
        <option>JavaScript</option>
        <option>TypeScript</option>
        <option>Python</option>
        <option>Go</option>
        <option>CSS</option>
        <option>HTML</option>
        <option>JSX</option>
      </select>
      <button className="btn primary" type="submit">Search</button>
    </form>
  );
}
