import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import { loadBookIndex, loadChapter, findBookByKey } from './services/textLoader';
import BookSelector from './components/Navigation/BookSelector';
import ChapterSelector from './components/Navigation/ChapterSelector';
import SearchBar from './components/Navigation/SearchBar';
import ChapterView from './components/Display/ChapterView';
import CommentaryPanel from './components/Commentary/CommentaryPanel';
import SearchPage from './components/Search/SearchPage';
import './styles/hebrew.css';

function TanakhApp() {
  const [bookIndex, setBookIndex] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapterData, setChapterData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commentaryVerse, setCommentaryVerse] = useState(null);

  const navigate = useNavigate();
  const params = useParams();

  // Load book index on mount (only once)
  useEffect(() => {
    loadBookIndex()
      .then(index => {
        setBookIndex(index);
      })
      .catch(err => {
        console.error('Failed to load book index:', err);
        setError('Failed to load book index');
      });
  }, []);

  // Load chapter from URL params when bookIndex is ready
  useEffect(() => {
    if (!bookIndex) return;

    if (params.book) {
      const book = findBookByKey(bookIndex, params.book);
      if (book) {
        setSelectedBook(params.book);
        if (params.chapter) {
          const chapterNum = parseInt(params.chapter, 10);
          if (chapterNum > 0 && chapterNum <= book.chapters) {
            setSelectedChapter(chapterNum);
          } else {
            setError(`Invalid chapter number: ${params.chapter}. ${book.english} has ${book.chapters} chapters.`);
          }
        }
      } else {
        setError(`Book not found: ${params.book}`);
      }
    }
  }, [bookIndex, params.book, params.chapter]);

  // Load chapter when book/chapter selection changes
  useEffect(() => {
    if (!selectedBook || !selectedChapter) {
      setChapterData(null);
      return;
    }

    setLoading(true);
    setError(null);
    setCommentaryVerse(null);

    loadChapter(selectedBook, selectedChapter)
      .then(data => {
        setChapterData(data);
        setLoading(false);
        // Update URL
        navigate(`/${selectedBook}/${selectedChapter}`, { replace: true });
      })
      .catch(err => {
        console.error('Failed to load chapter:', err);
        setError(`Failed to load ${selectedBook} chapter ${selectedChapter}. This chapter may not be available yet.`);
        setLoading(false);
      });
  }, [selectedBook, selectedChapter, navigate]);

  const handleBookSelect = (bookKey) => {
    setSelectedBook(bookKey);
    setSelectedChapter(null);
    setChapterData(null);
  };

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
  };

  const handleNavigate = (bookKey, chapter, verse) => {
    setSelectedBook(bookKey);
    setSelectedChapter(chapter);
    if (verse) {
      setCommentaryVerse(verse);
    }
  };

  const handlePrevChapter = () => {
    if (selectedChapter && selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
    } else if (selectedBook && selectedChapter === 1) {
      // Could implement going to previous book's last chapter
      // For now, just stay at chapter 1
    }
  };

  const handleNextChapter = () => {
    const book = findBookByKey(bookIndex, selectedBook);
    if (book && selectedChapter && selectedChapter < book.chapters) {
      setSelectedChapter(selectedChapter + 1);
    }
  };

  const handleCommentaryRequest = (verseNumber) => {
    setCommentaryVerse(verseNumber);
  };

  const handleCloseCommentary = () => {
    setCommentaryVerse(null);
  };

  const currentBook = selectedBook ? findBookByKey(bookIndex, selectedBook) : null;

  return (
    <div className="app">
      <header style={{
        background: '#4a90e2',
        color: 'white',
        padding: '1.5rem',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem' }}>תנ"ך - Hebrew Bible</h1>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', opacity: 0.9 }}>
              כל עשרים וארבעה ספרי התנ"ך
            </p>
          </div>
          <Link
            to="/search"
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '4px',
              fontSize: '1.1rem'
            }}
          >
            🔍 חיפוש בתנ"ך
          </Link>
        </div>
      </header>

      <main style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        {/* Breadcrumb */}
        {currentBook && (
          <div className="breadcrumb">
            <a href="/" onClick={(e) => { e.preventDefault(); setSelectedBook(null); setSelectedChapter(null); }}>
              ראשי
            </a>
            <span className="breadcrumb-separator">›</span>
            <span>{currentBook.hebrew}</span>
            {selectedChapter && (
              <>
                <span className="breadcrumb-separator">›</span>
                <span>פרק {selectedChapter}</span>
              </>
            )}
          </div>
        )}

        {/* Search Bar */}
        <div style={{ marginBottom: '1.5rem' }}>
          <SearchBar bookIndex={bookIndex} onNavigate={handleNavigate} />
        </div>

        {/* Navigation Controls */}
        <div className="nav-controls">
          <BookSelector
            bookIndex={bookIndex}
            selectedBook={selectedBook}
            onSelectBook={handleBookSelect}
          />

          {currentBook && (
            <ChapterSelector
              maxChapters={currentBook.chapters}
              selectedChapter={selectedChapter}
              onSelectChapter={handleChapterSelect}
              disabled={!selectedBook}
            />
          )}
        </div>

        {/* Loading/Error States */}
        {loading && <div className="loading">טוען...</div>}
        {error && <div className="error">{error}</div>}

        {/* Chapter Display */}
        {chapterData && !loading && (
          <>
            <ChapterView
              chapterData={chapterData}
              onCommentaryRequest={handleCommentaryRequest}
            />

            {/* Navigation Buttons */}
            <div className="nav-buttons">
              <button
                className="nav-button"
                onClick={handlePrevChapter}
                disabled={!selectedChapter || selectedChapter === 1}
              >
                ← פרק קודם
              </button>
              <button
                className="nav-button"
                onClick={handleNextChapter}
                disabled={!currentBook || !selectedChapter || selectedChapter >= currentBook.chapters}
              >
                פרק הבא →
              </button>
            </div>

            {/* Commentary Panel */}
            {commentaryVerse && chapterData && (
              <CommentaryPanel
                bookName={chapterData.book}
                chapter={chapterData.chapter}
                verse={commentaryVerse}
                onClose={handleCloseCommentary}
              />
            )}
          </>
        )}

        {/* Welcome Message */}
        {!selectedBook && !loading && (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            background: '#f9f9f9',
            borderRadius: '8px',
            marginTop: '2rem'
          }}>
            <h2 className="hebrew-text" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              ברוכים הבאים
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
              בחר ספר מהרשימה למעלה כדי להתחיל לקרוא
            </p>
            <p style={{ fontSize: '0.9rem', color: '#999' }}>
              Welcome! Select a book from the dropdown above to begin reading the Hebrew Bible.
            </p>
          </div>
        )}
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        background: '#f5f5f5',
        marginTop: '4rem',
        borderTop: '1px solid #ddd'
      }}>
        <p style={{ margin: 0, color: '#666' }}>
          תנ"ך - Hebrew Bible Reader | Built with React
        </p>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#999' }}>
          Text from Sefaria.org | Commentaries via Sefaria API
        </p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router basename="/tanakh-deploy">
      <Routes>
        <Route path="/" element={<TanakhApp />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/:book/:chapter" element={<TanakhApp />} />
      </Routes>
    </Router>
  );
}

export default App;
