import React, { useState, useEffect } from 'react';
import { fetchRashiCommentary, stripNikud } from '../../services/sefariaAPI';

function CommentaryPanel({ bookName, chapter, verse, onClose }) {
  const [commentary, setCommentary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookName || !chapter || !verse) {
      setCommentary(null);
      return;
    }

    async function loadCommentary() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchRashiCommentary(bookName, chapter, verse);
        if (data && data.hebrew) {
          setCommentary(data);
        } else {
          setError('אין פירוש זמין לפסוק זה');
        }
      } catch (err) {
        setError('שגיאה בטעינת הפירוש');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadCommentary();
  }, [bookName, chapter, verse]);

  // Handle ESC key to close modal and body scroll lock
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    if (bookName && chapter && verse) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);

      return () => {
        // Restore body scroll when modal closes
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [bookName, chapter, verse, onClose]);

  if (!bookName || !chapter || !verse) {
    return null;
  }

  const handleBackdropClick = (e) => {
    // Only close if clicking the backdrop itself, not the modal content
    if (e.target.classList.contains('commentary-backdrop') && onClose) {
      onClose();
    }
  };

  const handleModalClick = (e) => {
    // Prevent clicks inside modal from closing it
    e.stopPropagation();
  };

  return (
    <div className="commentary-backdrop" onClick={handleBackdropClick}>
      <div className="commentary-modal" onClick={handleModalClick}>
        {/* Close button */}
        <button
          className="commentary-close-button"
          onClick={(e) => {
            e.stopPropagation();
            if (onClose) onClose();
          }}
          aria-label="סגור"
          title="סגור (ESC)"
        >
          ×
        </button>

        {loading && (
          <>
            <div className="commentary-title">פירוש רש"י</div>
            <div className="loading">טוען פירוש...</div>
          </>
        )}

        {error && (
          <>
            <div className="commentary-title">פירוש רש"י</div>
            <div className="error">{error}</div>
          </>
        )}

        {commentary && !loading && !error && (
          <>
            <div className="commentary-title">
              פירוש רש"י על {bookName} {chapter}:{verse}
            </div>
            <div className="commentary-text hebrew-text">
              {stripNikud(commentary.hebrew)}
            </div>
          </>
        )}

        {!loading && !error && !commentary && (
          <>
            <div className="commentary-title">פירוש רש"י</div>
            <div className="error">לא נמצא פירוש לפסוק זה</div>
          </>
        )}
      </div>
    </div>
  );
}

export default CommentaryPanel;
