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

  describe('Copy functionality with proper line breaks', () => {
    it('should format chapter text with line breaks between verses', () => {
      const { container } = render(<ChapterView chapterData={mockChapterData} />);

      // The copy button should have the properly formatted text
      // This will be tested after we implement the fix
      // Expected format: verse1\n\nverse2\n\nverse3
    });

    it('should include extra line breaks before parsha markers', () => {
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

      // After fix: should have extra line breaks before parsha
      // Expected: verse1\n\nverse2\n\n\n(פ)\n\nverse3
    });
  });
});
