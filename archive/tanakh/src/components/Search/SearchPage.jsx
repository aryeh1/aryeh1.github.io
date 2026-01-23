/**
 * SearchPage component - main search page
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadBookIndex } from '../../services/textLoader';
import { searchAllBooks } from '../../services/searchService';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import BookFilter from './BookFilter';
import '../../styles/search.css';

function getAllBooks(bookIndex) {
  if (!bookIndex || !bookIndex.sections) return [];

  const allBooks = [];
  Object.values(bookIndex.sections).forEach(section => {
    if (section.books) {
      allBooks.push(...section.books);
    }
  });
  return allBooks;
}

function SearchPage() {
  const [bookIndex, setBookIndex] = useState(null);
  const [allBooks, setAllBooks] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [searchParams, setSearchParams] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [resultCounts, setResultCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load book index on mount
  useEffect(() => {
    loadBookIndex()
      .then(index => {
        setBookIndex(index);
        const books = getAllBooks(index);
        setAllBooks(books);
        setSelectedBooks(books.map(b => b.key));
      })
      .catch(err => {
        console.error('Failed to load book index:', err);
        setError('שגיאה בטעינת רשימת הספרים');
      });
  }, []);

  const handleSearch = async ({ searchTerm, searchMode, stripPrefixes }) => {
    if (!bookIndex || !searchTerm.trim()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSearchParams({ searchTerm, searchMode, stripPrefixes });

    try {
      // First, search all books to get counts
      const allResults = await searchAllBooks(
        searchTerm,
        searchMode,
        stripPrefixes,
        null // No filter
      );

      // Calculate result counts per book
      const counts = {};
      allBooks.forEach(book => {
        counts[book.key] = allResults.filter(r => r.bookKey === book.key).length;
      });
      setResultCounts(counts);

      // Filter results by selected books
      const filteredResults = allResults.filter(r =>
        selectedBooks.includes(r.bookKey)
      );

      setSearchResults(filteredResults);
    } catch (err) {
      console.error('Search error:', err);
      setError('שגיאה בביצוע החיפוש');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newSelectedBooks) => {
    setSelectedBooks(newSelectedBooks);

    // Re-filter results if we have search results
    if (searchResults !== null && searchParams) {
      // We need to re-search because we only have filtered results
      handleSearch(searchParams);
    }
  };

  const filteredResults = searchResults
    ? searchResults.filter(r => selectedBooks.includes(r.bookKey))
    : null;

  return (
    <div className="search-page">
      <header className="search-header">
        <h1 className="hebrew-text">חיפוש בתנ"ך</h1>
        <Link to="/" className="home-link">
          ← חזור לעמוד הראשי
        </Link>
      </header>

      <div className="search-container">
        <div className="search-main">
          <SearchForm onSearch={handleSearch} />

          {loading && (
            <div className="loading-message">מחפש...</div>
          )}

          {error && (
            <div className="error-message">{error}</div>
          )}

          {!loading && searchResults !== null && searchParams && (
            <SearchResults
              results={filteredResults}
              searchTerm={searchParams.searchTerm}
              searchMode={searchParams.searchMode}
              stripPrefixes={searchParams.stripPrefixes}
            />
          )}

          {!loading && searchResults === null && (
            <div className="welcome-message">
              <h2>ברוכים הבאים לחיפוש בתנ"ך</h2>
              <p>הקלד מילה או ביטוי בעברית לחיפוש בכל 24 ספרי התנ"ך</p>
              <ul className="search-tips">
                <li>התאמה מדויקת - מחפש מילים שלמות בלבד</li>
                <li>התאמה חלקית - מחפש את הטקסט גם בתוך מילים</li>
                <li>התעלם מקידומות - מתעלם מאותיות ו, ה, ב, כ, ל, מ, י בתחילת מילים</li>
              </ul>
            </div>
          )}
        </div>

        {searchResults !== null && Object.keys(resultCounts).length > 0 && (
          <aside className="search-sidebar">
            <BookFilter
              allBooks={allBooks}
              selectedBooks={selectedBooks}
              onFilterChange={handleFilterChange}
              resultCounts={resultCounts}
            />
          </aside>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
