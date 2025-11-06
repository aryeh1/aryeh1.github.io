import React from 'react';
import VerseView from './VerseView';
import CopyButton from './CopyButton';

function ChapterView({ chapterData, onCommentaryRequest }) {
  if (!chapterData) {
    return <div className="loading">טוען...</div>;
  }

  const { bookHebrew, chapter, verses } = chapterData;

  // Combine all verses for chapter copy with proper formatting
  // ONLY Hebrew text - no verse numbers
  // - Blank line between verses
  // - Parsha markers on their own lines with blank lines around them
  const allText = verses.map((verse, index) => {
    let text = verse.hebrew;

    // Add parsha marker if present
    if (verse.parsha) {
      text += `\n\n(${verse.parsha})`;
    }

    // Add spacing after this verse (if not the last verse)
    if (index < verses.length - 1) {
      text += '\n\n'; // Blank line between verses
    }

    return text;
  }).join('');

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
