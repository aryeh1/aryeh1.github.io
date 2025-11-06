/**
 * Tests for CopyButton component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CopyButton from './CopyButton';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
  },
});

describe('CopyButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with default label', () => {
    render(<CopyButton text="test text" />);
    expect(screen.getByText(/העתק/)).toBeInTheDocument();
  });

  it('should render with custom label', () => {
    render(<CopyButton text="test text" label="העתק פרק" />);
    expect(screen.getByText(/העתק פרק/)).toBeInTheDocument();
  });

  it('should copy text to clipboard when clicked', async () => {
    const testText = 'בראשית ברא אלהים';
    render(<CopyButton text={testText} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(testText);
    });
  });

  it('should show success message after copying', async () => {
    render(<CopyButton text="test" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('✓')).toBeInTheDocument();
      expect(button).toHaveAttribute('title', 'הועתק!');
    });
  });

  it('should reset success message after timeout', async () => {
    jest.useFakeTimers();

    render(<CopyButton text="test" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('✓')).toBeInTheDocument();
    });

    // Fast-forward time
    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(screen.getByText(/העתק/)).toBeInTheDocument();
      expect(screen.queryByText(/הועתק!/)).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it('should handle copy failure gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    navigator.clipboard.writeText.mockRejectedValueOnce(new Error('Copy failed'));

    render(<CopyButton text="test" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('should have copy-success class when copied', async () => {
    render(<CopyButton text="test" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toHaveClass('copy-success');
    });
  });
});
