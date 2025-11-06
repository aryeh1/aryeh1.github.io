/**
 * SearchForm component - search input with options
 */

import React, { useState } from 'react';

function SearchForm({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState('exact');
  const [stripPrefixes, setStripPrefixes] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      return;
    }

    onSearch({
      searchTerm: searchTerm.trim(),
      searchMode,
      stripPrefixes
    });
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-input-group">
        <input
          type="text"
          className="search-input hebrew-text"
          placeholder="הקלד טקסט לחיפוש (למשל: בראשית)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          dir="rtl"
        />
        <button type="submit" className="search-button">
          חפש
        </button>
      </div>

      <div className="search-options">
        <div className="search-mode-options">
          <label className="radio-label">
            <input
              type="radio"
              name="searchMode"
              value="exact"
              checked={searchMode === 'exact'}
              onChange={(e) => setSearchMode(e.target.value)}
            />
            <span>התאמה מדויקת</span>
            <span className="option-description">(מילה שלמה בלבד)</span>
          </label>

          <label className="radio-label">
            <input
              type="radio"
              name="searchMode"
              value="fuzzy"
              checked={searchMode === 'fuzzy'}
              onChange={(e) => setSearchMode(e.target.value)}
            />
            <span>התאמה חלקית</span>
            <span className="option-description">(חיפוש תת-מחרוזת)</span>
          </label>
        </div>

        <div className="prefix-option">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={stripPrefixes}
              onChange={(e) => setStripPrefixes(e.target.checked)}
            />
            <span>התעלם מאותיות קידומת (ו, ה, ב, כ, ל, מ, י)</span>
          </label>
        </div>
      </div>
    </form>
  );
}

export default SearchForm;
