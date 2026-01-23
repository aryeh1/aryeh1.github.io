/**
 * Tests for VerseView component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import VerseView from './VerseView';

describe('VerseView', () => {
  it('should render verse number and Hebrew text', () => {
    const verse = {
      number: 1,
      hebrew: 'בראשית ברא אלהים את השמים ואת הארץ'
    };

    render(<VerseView verse={verse} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText(/בראשית ברא אלהים/)).toBeInTheDocument();
  });

  it('should render parsha marker פ when present', () => {
    const verse = {
      number: 5,
      hebrew: 'ויקרא אלהים לאור יום',
      parsha: 'פ'
    };

    render(<VerseView verse={verse} />);

    expect(screen.getByText('פ')).toBeInTheDocument();
  });

  it('should render parsha marker ס when present', () => {
    const verse = {
      number: 10,
      hebrew: 'ויקרא אלהים ליבשה ארץ',
      parsha: 'ס'
    };

    render(<VerseView verse={verse} />);

    expect(screen.getByText('ס')).toBeInTheDocument();
  });

  it('should not render parsha marker when not present', () => {
    const verse = {
      number: 1,
      hebrew: 'בראשית ברא אלהים'
    };

    render(<VerseView verse={verse} />);

    // Should not find פ or ס markers
    expect(screen.queryByText('פ')).not.toBeInTheDocument();
    expect(screen.queryByText('ס')).not.toBeInTheDocument();
  });

  it('should apply extra spacing for פ marker', () => {
    const verse = {
      number: 1,
      hebrew: 'בראשית ברא אלהים',
      parsha: 'פ'
    };

    const { container } = render(<VerseView verse={verse} />);
    const verseContainer = container.querySelector('.verse-container');

    // פ (petucha) should have 2rem margin-bottom
    expect(verseContainer).toHaveStyle({ marginBottom: '2rem' });
  });

  it('should apply extra spacing for ס marker', () => {
    const verse = {
      number: 1,
      hebrew: 'בראשית ברא אלהים',
      parsha: 'ס'
    };

    const { container } = render(<VerseView verse={verse} />);
    const verseContainer = container.querySelector('.verse-container');

    // ס (setuma) should have 1rem margin-bottom
    expect(verseContainer).toHaveStyle({ marginBottom: '1rem' });
  });

  it('should render Rashi button when commentary available', () => {
    const verse = {
      number: 1,
      hebrew: 'בראשית ברא אלהים'
    };

    const mockCommentaryRequest = jest.fn();

    render(
      <VerseView
        verse={verse}
        onCommentaryRequest={mockCommentaryRequest}
        hasRashi={true}
      />
    );

    expect(screen.getByText('רש"י')).toBeInTheDocument();
  });

  it('should not render Rashi button when commentary not available', () => {
    const verse = {
      number: 1,
      hebrew: 'בראשית ברא אלהים'
    };

    const mockCommentaryRequest = jest.fn();

    render(
      <VerseView
        verse={verse}
        onCommentaryRequest={mockCommentaryRequest}
        hasRashi={false}
      />
    );

    expect(screen.queryByText('רש"י')).not.toBeInTheDocument();
  });

  it('should render verse with both parsha marker and Rashi button', () => {
    const verse = {
      number: 5,
      hebrew: 'ויקרא אלהים לאור יום',
      parsha: 'פ'
    };

    const mockCommentaryRequest = jest.fn();

    render(
      <VerseView
        verse={verse}
        onCommentaryRequest={mockCommentaryRequest}
        hasRashi={true}
      />
    );

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText(/ויקרא אלהים לאור יום/)).toBeInTheDocument();
    expect(screen.getByText('פ')).toBeInTheDocument();
    expect(screen.getByText('רש"י')).toBeInTheDocument();
  });
});
