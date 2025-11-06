/**
 * ResultCard component - displays a single search result
 */

import React from 'react';
import { Link } from 'react-router-dom';

function ResultCard({ result }) {
  const { bookNameHebrew, chapter, verse, highlightedText, bookKey } = result;

  return (
    <div className="result-card">
      <div className="result-header">
        <span className="result-reference hebrew-text">
          {bookNameHebrew} {chapter}:{verse}
        </span>
      </div>
      <div
        className="result-verse hebrew-text"
        dangerouslySetInnerHTML={{ __html: highlightedText }}
      />
      <div className="result-actions">
        <Link
          to={`/${bookKey}/${chapter}#verse-${verse}`}
          className="result-link"
        >
          עבור לפסוק
        </Link>
      </div>
    </div>
  );
}

export default ResultCard;
