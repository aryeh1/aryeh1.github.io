import React from 'react';

function VerseView({ verse, onCommentaryRequest, hasRashi }) {
  const { number, hebrew, parsha } = verse;

  // Determine extra spacing based on parsha type
  // ס (setuma) = 1 extra line space
  // פ (petucha) = 2 extra line spaces
  let extraSpacing = 0;
  if (parsha === 'ס') {
    extraSpacing = 1;
  } else if (parsha === 'פ') {
    extraSpacing = 2;
  }

  const containerStyle = extraSpacing > 0 ? {
    marginBottom: `${extraSpacing}rem`
  } : {};

  return (
    <div className="verse-container" style={containerStyle}>
      <div className="hebrew-text">
        <span className="verse-number">{number}</span>
        <span className="verse-text">{hebrew}</span>
        {onCommentaryRequest && hasRashi && (
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
