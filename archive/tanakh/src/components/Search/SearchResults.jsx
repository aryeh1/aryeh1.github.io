/**
 * SearchResults component - displays list of search results
 */

import React from 'react';
import ResultCard from './ResultCard';

function SearchResults({ results, searchTerm, searchMode, stripPrefixes }) {
  if (!results || results.length === 0) {
    return (
      <div className="search-results">
        <div className="no-results">
          <p>לא נמצאו תוצאות עבור "{searchTerm}"</p>
          <p className="suggestion">נסה לשנות את מצב החיפוש או הגדרות הסינון</p>
        </div>
      </div>
    );
  }

  const resultCount = results.length;
  const displayedCount = Math.min(resultCount, 200);
  const hasMore = resultCount > 200;

  return (
    <div className="search-results">
      <div className="results-header">
        <h2 className="hebrew-text">
          נמצאו {resultCount} תוצאות עבור "{searchTerm}"
        </h2>
        {hasMore && (
          <p className="results-limit-message">מוצגים 200 תוצאות ראשונות</p>
        )}
        <div className="active-filters">
          {searchMode === 'fuzzy' && (
            <span className="filter-badge">התאמה חלקית</span>
          )}
          {searchMode === 'exact' && (
            <span className="filter-badge">התאמה מדויקת</span>
          )}
          {stripPrefixes && (
            <span className="filter-badge">התעלם מאותיות קידומת</span>
          )}
        </div>
      </div>

      <div className="results-list">
        {results.slice(0, displayedCount).map((result, index) => (
          <ResultCard key={`${result.bookKey}-${result.chapter}-${result.verse}-${index}`} result={result} />
        ))}
      </div>
    </div>
  );
}

export default SearchResults;
