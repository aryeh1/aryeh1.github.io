import React, { useState, useEffect, useRef } from 'react';
import VerseView from './VerseView';
import CopyButton from './CopyButton';
import { checkRashiAvailability } from '../../services/sefariaAPI';

function ChapterView({ chapterData, onCommentaryRequest }) {
  const [rashiAvailability, setRashiAvailability] = useState(new Set());
  const [highlightedVerse, setHighlightedVerse] = useState(null);
  const verseRefs = useRef({});

  // Extract data safely
  const bookHebrew = chapterData?.bookHebrew;
  const chapter = chapterData?.chapter;
  const verses = chapterData?.verses || [];

  // Check Rashi availability for all verses when chapter loads
  useEffect(() => {
    if (!chapterData?.book || !chapterData?.chapter || !chapterData?.verses) return;

    const verseNumbers = chapterData.verses.map(v => v.number);

    checkRashiAvailability(chapterData.book, chapterData.chapter, verseNumbers)
      .then(availability => {
        setRashiAvailability(availability);
      })
      .catch(err => {
        console.error('Failed to check Rashi availability:', err);
      });
  }, [chapterData]);

  // Handle URL anchors for verse navigation from search results
  useEffect(() => {
    if (!chapterData) return;

    // Check for anchor in URL (e.g., #verse-5)
    const hash = window.location.hash;
    if (hash && hash.startsWith('#verse-')) {
      const verseNumber = parseInt(hash.replace('#verse-', ''), 10);

      // Wait for component to render, then scroll to verse
      setTimeout(() => {
        const verseElement = verseRefs.current[verseNumber];
        if (verseElement) {
          verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

          // Highlight the verse temporarily
          setHighlightedVerse(verseNumber);

          // Remove highlight after 3 seconds
          setTimeout(() => {
            setHighlightedVerse(null);
          }, 3000);
        }
      }, 100);
    }
  }, [chapterData]);

  if (!chapterData) {
    return <div className="loading">טוען...</div>;
  }

  // Combine all verses for chapter copy with proper formatting
  // ONLY Hebrew text - no verse numbers
  // - Blank line between verses
  // - Additional spacing for parsha markers (ס = 1 extra line, פ = 2 extra lines)
  const allText = verses.map((verse, index) => {
    let text = verse.hebrew;

    // Add spacing after this verse (if not the last verse)
    if (index < verses.length - 1) {
      // Base spacing: one blank line between verses
      text += '\n\n';

      // Add extra spacing for parsha markers
      if (verse.parsha === 'ס') {
        // Setuma: add 1 extra blank line (total 2 newlines = 1 extra blank line)
        text += '\n';
      } else if (verse.parsha === 'פ') {
        // Petucha: add 2 extra blank lines (total 3 newlines = 2 extra blank lines)
        text += '\n\n';
      }
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
          <div
            key={verse.number}
            id={`verse-${verse.number}`}
            ref={el => verseRefs.current[verse.number] = el}
            className={highlightedVerse === verse.number ? 'verse-highlighted' : ''}
          >
            <VerseView
              verse={verse}
              onCommentaryRequest={onCommentaryRequest}
              hasRashi={rashiAvailability.has(verse.number)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChapterView;
