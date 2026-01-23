import React from 'react';

function ChapterSelector({ maxChapters, selectedChapter, onSelectChapter, disabled }) {
  const handleChange = (e) => {
    const chapter = parseInt(e.target.value, 10);
    if (chapter && onSelectChapter) {
      onSelectChapter(chapter);
    }
  };

  if (!maxChapters) {
    return null;
  }

  return (
    <div className="chapter-selector">
      <select
        className="select-control"
        value={selectedChapter || ''}
        onChange={handleChange}
        disabled={disabled}
      >
        <option value="">בחר פרק</option>
        {Array.from({ length: maxChapters }, (_, i) => i + 1).map(chapter => (
          <option key={chapter} value={chapter}>
            פרק {chapter}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ChapterSelector;
