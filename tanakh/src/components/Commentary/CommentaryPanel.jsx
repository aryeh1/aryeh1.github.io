import React, { useState, useEffect } from 'react';
import { fetchRashiCommentary, stripNikud } from '../../services/sefariaAPI';

function CommentaryPanel({ bookName, chapter, verse }) {
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

  if (!bookName || !chapter || !verse) {
    return null;
  }

  if (loading) {
    return (
      <div className="commentary-panel">
        <div className="commentary-title">פירוש רש"י</div>
        <div className="loading">טוען פירוש...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="commentary-panel">
        <div className="commentary-title">פירוש רש"י</div>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!commentary) {
    return null;
  }

  return (
    <div className="commentary-panel">
      <div className="commentary-title">
        פירוש רש"י על {bookName} {chapter}:{verse}
      </div>
      <div className="commentary-text hebrew-text">
        {stripNikud(commentary.hebrew)}
      </div>
    </div>
  );
}

export default CommentaryPanel;
