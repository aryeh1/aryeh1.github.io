import React from 'react';
import CopyButton from './CopyButton';

function VerseView({ verse, onCommentaryRequest }) {
  const { number, hebrew, parsha } = verse;

  return (
    <div className="verse-container">
      <div className="hebrew-text">
        <span className="verse-number">{number}</span>
        <span className="verse-text">{hebrew}</span>
        {parsha && <span className="parsha-marker">{parsha}</span>}
        <CopyButton text={hebrew} label="העתק" />
        {onCommentaryRequest && (
          <button
            className="copy-button"
            onClick={() => onCommentaryRequest(number)}
          >
            רש"י
          </button>
        )}
      </div>
    </div>
  );
}

export default VerseView;
