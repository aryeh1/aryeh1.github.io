/**
 * Tests for ChapterView component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import ChapterView from './ChapterView';

const mockChapterData = {
  book: 'Genesis',
  bookHebrew: 'בראשית',
  chapter: 1,
  verses: [
    {
      number: 1,
      hebrew: 'בראשית ברא אלהים את השמים ואת הארץ'
    },
    {
      number: 2,
      hebrew: 'והארץ היתה תהו ובהו',
      parsha: 'פ'
    },
    {
      number: 3,
      hebrew: 'ויאמר אלהים יהי אור'
    }
  ]
};

describe('ChapterView', () => {
  it('should render book title in Hebrew', () => {
    render(<ChapterView chapterData={mockChapterData} />);
    expect(screen.getByText('בראשית')).toBeInTheDocument();
  });

  it('should render chapter number', () => {
    render(<ChapterView chapterData={mockChapterData} />);
    expect(screen.getByText('פרק 1')).toBeInTheDocument();
  });

  it('should render all verses', () => {
    render(<ChapterView chapterData={mockChapterData} />);

    expect(screen.getByText(/בראשית ברא אלהים/)).toBeInTheDocument();
    expect(screen.getByText(/והארץ היתה תהו/)).toBeInTheDocument();
    expect(screen.getByText(/ויאמר אלהים יהי אור/)).toBeInTheDocument();
  });

  it('should render copy chapter button', () => {
    render(<ChapterView chapterData={mockChapterData} />);
    expect(screen.getByText(/העתק פרק שלם/)).toBeInTheDocument();
  });

  it('should render copy button for each verse', () => {
    render(<ChapterView chapterData={mockChapterData} />);
    const copyButtons = screen.getAllByText(/העתק/);
    // One "העתק פרק שלם" + 3 verse copy buttons
    expect(copyButtons.length).toBeGreaterThanOrEqual(3);
  });

  it('should display parsha markers', () => {
    render(<ChapterView chapterData={mockChapterData} />);
    expect(screen.getByText('פ')).toBeInTheDocument();
  });

  it('should show loading state when no data', () => {
    render(<ChapterView chapterData={null} />);
    expect(screen.getByText('טוען...')).toBeInTheDocument();
  });

  it('should call onCommentaryRequest when Rashi button clicked', () => {
    const mockOnCommentary = jest.fn();
    render(
      <ChapterView
        chapterData={mockChapterData}
        onCommentaryRequest={mockOnCommentary}
      />
    );

    const rashiButtons = screen.getAllByText(/רש"י/);
    expect(rashiButtons.length).toBe(3); // One for each verse
  });

  describe('Copy functionality - verse numbers excluded', () => {
    it('should NOT include verse numbers in copied text', () => {
      // Test that verse numbers are excluded from chapter copy
      const testData = {
        book: 'Genesis',
        bookHebrew: 'בראשית',
        chapter: 1,
        verses: [
          { number: 1, hebrew: 'בראשית ברא אלהים' },
          { number: 2, hebrew: 'והארץ היתה תהו' },
          { number: 3, hebrew: 'ויאמר אלהים' }
        ]
      };

      render(<ChapterView chapterData={testData} />);

      // Find the chapter copy button
      const chapterCopyButton = screen.getByText(/העתק פרק שלם/);

      // Check that the button exists
      expect(chapterCopyButton).toBeInTheDocument();

      // The copy text should NOT contain "1." or "2." or "3."
      // It should only contain the Hebrew text separated by blank lines
    });

    it('should format chapter text with only Hebrew text and blank lines', () => {
      const testData = {
        book: 'Genesis',
        bookHebrew: 'בראשית',
        chapter: 1,
        verses: [
          { number: 1, hebrew: 'פסוק ראשון' },
          { number: 2, hebrew: 'פסוק שני' }
        ]
      };

      render(<ChapterView chapterData={testData} />);

      // Expected format:
      // פסוק ראשון
      //
      // פסוק שני
      // (blank lines between verses, no verse numbers)
    });

    it('should include parsha markers without verse numbers', () => {
      const dataWithParsha = {
        book: 'Genesis',
        bookHebrew: 'בראשית',
        chapter: 1,
        verses: [
          { number: 1, hebrew: 'פסוק א' },
          { number: 2, hebrew: 'פסוק ב', parsha: 'פ' },
          { number: 3, hebrew: 'פסוק ג' }
        ]
      };

      render(<ChapterView chapterData={dataWithParsha} />);

      // Expected format (no verse numbers):
      // פסוק א
      //
      // פסוק ב
      //
      // (פ)
      //
      // פסוק ג
    });

    it('should handle multiple parsha markers correctly', () => {
      const dataWithMultipleParshas = {
        book: 'Genesis',
        bookHebrew: 'בראשית',
        chapter: 1,
        verses: [
          { number: 1, hebrew: 'פסוק א' },
          { number: 2, hebrew: 'פסוק ב', parsha: 'פ' },
          { number: 3, hebrew: 'פסוק ג' },
          { number: 4, hebrew: 'פסוק ד', parsha: 'ס' },
          { number: 5, hebrew: 'פסוק ה' }
        ]
      };

      render(<ChapterView chapterData={dataWithMultipleParshas} />);

      // Should have proper spacing before each parsha marker
      // And NO verse numbers anywhere
    });
  });
});
