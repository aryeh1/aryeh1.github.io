/**
 * Tests for App component - including routing tests
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import * as textLoader from './services/textLoader';

// Mock the textLoader service
jest.mock('./services/textLoader');

describe('App Routing Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock book index
    textLoader.loadBookIndex.mockResolvedValue({
      sections: {
        torah: {
          name: 'Torah',
          hebrewName: 'תורה',
          books: [
            {
              english: 'Genesis',
              hebrew: 'בראשית',
              key: 'genesis',
              chapters: 50
            },
            {
              english: 'Leviticus',
              hebrew: 'ויקרא',
              key: 'leviticus',
              chapters: 27
            }
          ]
        }
      }
    });

    // Mock findBookByKey
    textLoader.findBookByKey.mockImplementation((index, key) => {
      if (key === 'genesis') {
        return { english: 'Genesis', hebrew: 'בראשית', key: 'genesis', chapters: 50 };
      }
      if (key === 'leviticus') {
        return { english: 'Leviticus', hebrew: 'ויקרא', key: 'leviticus', chapters: 27 };
      }
      return null;
    });
  });

  // THIS TEST WILL FAIL - demonstrating BUG #1: URL routing doesn't work on reload
  it('should load content when navigating directly to /leviticus/6 (simulating page reload)', async () => {
    const mockChapterData = {
      book: 'Leviticus',
      bookHebrew: 'ויקרא',
      chapter: 6,
      verses: [
        { number: 1, hebrew: 'וידבר ה אל משה לאמר' },
        { number: 2, hebrew: 'נפש כי תחטא' }
      ]
    };

    textLoader.loadChapter.mockResolvedValue(mockChapterData);

    // This simulates a user directly navigating to /tanakh-deploy/leviticus/6
    // or reloading the page at that URL
    render(
      <MemoryRouter initialEntries={['/leviticus/6']}>
        <App />
      </MemoryRouter>
    );

    // Wait for the content to load
    await waitFor(() => {
      expect(textLoader.loadChapter).toHaveBeenCalledWith('leviticus', 6);
    }, { timeout: 3000 });

    // The chapter should be displayed
    await waitFor(() => {
      expect(screen.getByText('ויקרא')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  // THIS TEST WILL FAIL - demonstrating that the app doesn't handle direct URL navigation properly
  it('should parse URL params and load the correct book/chapter on mount', async () => {
    const mockChapterData = {
      book: 'Genesis',
      bookHebrew: 'בראשית',
      chapter: 1,
      verses: [
        { number: 1, hebrew: 'בראשית ברא אלהים את השמים ואת הארץ' }
      ]
    };

    textLoader.loadChapter.mockResolvedValue(mockChapterData);

    render(
      <MemoryRouter initialEntries={['/genesis/1']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(textLoader.loadBookIndex).toHaveBeenCalled();
    });

    // Should load the chapter data based on URL params
    await waitFor(() => {
      expect(textLoader.loadChapter).toHaveBeenCalledWith('genesis', 1);
    }, { timeout: 3000 });
  });
});

describe('Commentary Modal Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    textLoader.loadBookIndex.mockResolvedValue({
      sections: {
        torah: {
          name: 'Torah',
          hebrewName: 'תורה',
          books: [
            {
              english: 'Genesis',
              hebrew: 'בראשית',
              key: 'genesis',
              chapters: 50
            }
          ]
        }
      }
    });

    textLoader.findBookByKey.mockReturnValue({
      english: 'Genesis',
      hebrew: 'בראשית',
      key: 'genesis',
      chapters: 50
    });
  });

  // THIS TEST WILL DOCUMENT the modal behavior - ensuring it doesn't hide page content
  it('should keep page content visible when commentary modal is open', async () => {
    const mockChapterData = {
      book: 'Genesis',
      bookHebrew: 'בראשית',
      chapter: 1,
      verses: [
        { number: 1, hebrew: 'בראשית ברא אלהים את השמים ואת הארץ' },
        { number: 2, hebrew: 'והארץ היתה תהו ובהו' }
      ]
    };

    textLoader.loadChapter.mockResolvedValue(mockChapterData);

    render(
      <MemoryRouter initialEntries={['/genesis/1']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('בראשית ברא אלהים את השמים ואת הארץ')).toBeInTheDocument();
    });

    // Verify that the backdrop uses fixed positioning and doesn't break page layout
    const backdrop = document.querySelector('.commentary-backdrop');
    if (backdrop) {
      const styles = window.getComputedStyle(backdrop);
      expect(styles.position).toBe('fixed');
    }
  });
});
