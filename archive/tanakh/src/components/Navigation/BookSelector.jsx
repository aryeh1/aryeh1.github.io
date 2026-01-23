import React from 'react';

function BookSelector({ bookIndex, selectedBook, onSelectBook }) {
  if (!bookIndex || !bookIndex.sections) {
    return <div>Loading books...</div>;
  }

  const handleChange = (e) => {
    const bookKey = e.target.value;
    if (bookKey && onSelectBook) {
      onSelectBook(bookKey);
    }
  };

  return (
    <div className="book-selector">
      <select
        className="select-control"
        value={selectedBook || ''}
        onChange={handleChange}
      >
        <option value="">בחר ספר</option>

        {Object.entries(bookIndex.sections).map(([sectionKey, section]) => (
          <optgroup key={sectionKey} label={`${section.hebrewName} - ${section.name}`}>
            {section.books.map(book => (
              <option key={book.key} value={book.key}>
                {book.hebrew} - {book.english}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

export default BookSelector;
