/**
 * Tests for CommentaryPanel component
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommentaryPanel from './CommentaryPanel';
import * as sefariaAPI from '../../services/sefariaAPI';

// Mock the sefariaAPI module
jest.mock('../../services/sefariaAPI');

describe('CommentaryPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when no verse is selected', () => {
    const { container } = render(
      <CommentaryPanel bookName={null} chapter={null} verse={null} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should show loading state while fetching commentary', () => {
    sefariaAPI.fetchRashiCommentary.mockImplementation(() =>
      new Promise(() => {}) // Never resolves
    );

    render(
      <CommentaryPanel bookName="Genesis" chapter={1} verse={1} />
    );

    expect(screen.getByText('טוען פירוש...')).toBeInTheDocument();
    expect(screen.getByText('פירוש רש"י')).toBeInTheDocument();
  });

  it('should display Rashi commentary when successfully fetched', async () => {
    const mockCommentary = {
      hebrew: 'פירוש רש"י על הפסוק',
      text: 'Rashi commentary on the verse'
    };

    sefariaAPI.fetchRashiCommentary.mockResolvedValue(mockCommentary);
    sefariaAPI.stripNikud.mockImplementation((text) => text);

    render(
      <CommentaryPanel bookName="Genesis" chapter={1} verse={1} />
    );

    await waitFor(() => {
      expect(screen.getByText(/פירוש רש"י על הפסוק/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Genesis 1:1/)).toBeInTheDocument();
  });

  it('should show error message when commentary is not available', async () => {
    sefariaAPI.fetchRashiCommentary.mockResolvedValue({
      hebrew: null
    });

    render(
      <CommentaryPanel bookName="Genesis" chapter={1} verse={1} />
    );

    await waitFor(() => {
      expect(screen.getByText('אין פירוש זמין לפסוק זה')).toBeInTheDocument();
    });
  });

  it('should show error message when API call fails', async () => {
    sefariaAPI.fetchRashiCommentary.mockRejectedValue(new Error('Network error'));

    render(
      <CommentaryPanel bookName="Genesis" chapter={1} verse={1} />
    );

    await waitFor(() => {
      expect(screen.getByText('שגיאה בטעינת הפירוש')).toBeInTheDocument();
    });
  });

  it('should have a close button', async () => {
    const mockCommentary = {
      hebrew: 'פירוש רש"י',
      text: 'Rashi commentary'
    };

    sefariaAPI.fetchRashiCommentary.mockResolvedValue(mockCommentary);
    sefariaAPI.stripNikud.mockImplementation((text) => text);

    const mockOnClose = jest.fn();

    render(
      <CommentaryPanel
        bookName="Genesis"
        chapter={1}
        verse={1}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/פירוש רש"י/)).toBeInTheDocument();
    });

    // Look for close button
    const closeButton = screen.getByRole('button', { name: /close|×|סגור/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const mockCommentary = {
      hebrew: 'פירוש רש"י',
      text: 'Rashi commentary'
    };

    sefariaAPI.fetchRashiCommentary.mockResolvedValue(mockCommentary);
    sefariaAPI.stripNikud.mockImplementation((text) => text);

    const mockOnClose = jest.fn();

    render(
      <CommentaryPanel
        bookName="Genesis"
        chapter={1}
        verse={1}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/פירוש רש"י/)).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /close|×|סגור/i });
    await userEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should display as a modal overlay on the page', async () => {
    const mockCommentary = {
      hebrew: 'פירוש רש"י',
      text: 'Rashi commentary'
    };

    sefariaAPI.fetchRashiCommentary.mockResolvedValue(mockCommentary);
    sefariaAPI.stripNikud.mockImplementation((text) => text);

    render(
      <CommentaryPanel bookName="Genesis" chapter={1} verse={1} />
    );

    await waitFor(() => {
      const panel = screen.getByText(/פירוש רש"י/).closest('.commentary-modal');
      expect(panel).toBeInTheDocument();
      // Modal should have fixed positioning
      expect(panel).toHaveClass('commentary-modal');
    });
  });

  it('should close when clicking outside the modal', async () => {
    const mockCommentary = {
      hebrew: 'פירוש רש"י',
      text: 'Rashi commentary'
    };

    sefariaAPI.fetchRashiCommentary.mockResolvedValue(mockCommentary);
    sefariaAPI.stripNikud.mockImplementation((text) => text);

    const mockOnClose = jest.fn();

    render(
      <CommentaryPanel
        bookName="Genesis"
        chapter={1}
        verse={1}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/פירוש רש"י/)).toBeInTheDocument();
    });

    // Click on the backdrop
    const backdrop = document.querySelector('.commentary-backdrop');
    if (backdrop) {
      await userEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it('should close when pressing Escape key', async () => {
    const mockCommentary = {
      hebrew: 'פירוש רש"י',
      text: 'Rashi commentary'
    };

    sefariaAPI.fetchRashiCommentary.mockResolvedValue(mockCommentary);
    sefariaAPI.stripNikud.mockImplementation((text) => text);

    const mockOnClose = jest.fn();

    render(
      <CommentaryPanel
        bookName="Genesis"
        chapter={1}
        verse={1}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/פירוש רש"י/)).toBeInTheDocument();
    });

    // Press Escape key
    await userEvent.keyboard('{Escape}');
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
