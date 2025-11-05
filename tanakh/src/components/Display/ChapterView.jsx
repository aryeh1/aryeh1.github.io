import React from 'react';
import VerseView from './VerseView';
import CopyButton from './CopyButton';

function ChapterView({ chapterData, onCommentaryRequest }) {
  if (!chapterData) {
    return <div className="loading">טוען...</div>;
  }

  const { bookHebrew, chapter, verses } = chapterData;

  // Combine all verses for chapter copy
  const allText = verses.map(v => v.hebrew).join(' ');

  return (
    <div className="chapter-view">
      <div className="book-title">{bookHebrew}</div>
      <div className="chapter-title">פרק {chapter}</div>

      <div style={{ textAlign: 'center', margin: '1rem 0' }}>
        <CopyButton text={allText} label="העתק פרק שלם" />
      </div>

      <div className="verses-container">
        {verses.map(verse => (
          <VerseView
            key={verse.number}
            verse={verse}
            onCommentaryRequest={onCommentaryRequest}
          />
        ))}
      </div>
    </div>
  );
}

export default ChapterView;
