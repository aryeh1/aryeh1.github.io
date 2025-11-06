/**
 * BookFilter component - allows filtering search results by book
 */

import React from 'react';

function BookFilter({ allBooks, selectedBooks, onFilterChange, resultCounts }) {
  const handleBookToggle = (bookKey) => {
    const newSelection = selectedBooks.includes(bookKey)
      ? selectedBooks.filter(k => k !== bookKey)
      : [...selectedBooks, bookKey];
    onFilterChange(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedBooks.length === allBooks.length) {
      // Deselect all
      onFilterChange([]);
    } else {
      // Select all
      onFilterChange(allBooks.map(book => book.key));
    }
  };

  const allSelected = selectedBooks.length === allBooks.length;

  return (
    <div className="book-filter">
      <div className="filter-header">
        <h3>סנן לפי ספרים</h3>
        <button onClick={handleSelectAll} className="select-all-button">
          {allSelected ? 'בטל בחירה' : 'בחר הכל'}
        </button>
      </div>
      <div className="filter-books">
        {allBooks.map(book => {
          const count = resultCounts[book.key] || 0;
          const isSelected = selectedBooks.includes(book.key);
          const isDisabled = count === 0;

          return (
            <label
              key={book.key}
              className={`book-checkbox ${isDisabled ? 'disabled' : ''}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleBookToggle(book.key)}
                disabled={isDisabled}
              />
              <span className="hebrew-text">
                {book.hebrew} ({count})
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default BookFilter;
