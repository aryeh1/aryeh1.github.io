import React, { useState } from 'react';
import { parseReference } from '../../services/textLoader';

function SearchBar({ bookIndex, onNavigate }) {
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');

    if (!searchText.trim()) {
      return;
    }

    const parsed = parseReference(searchText, bookIndex);

    if (parsed) {
      onNavigate(parsed.bookKey, parsed.chapter, parsed.verse);
      setSearchText('');
    } else {
      setError('לא נמצא. נסה: "Genesis 1:1" או "בראשית א"');
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input
          type="text"
          className="search-box"
          placeholder="חפש: Genesis 1:1 או בראשית א:א"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit" className="copy-button">
          🔍 חפש
        </button>
      </form>
      {error && <div className="error" style={{ marginTop: '0.5rem' }}>{error}</div>}
    </div>
  );
}

export default SearchBar;
