/**
 * Tests for SearchBar component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

const mockBookIndex = {
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
};

describe('SearchBar', () => {
  let mockOnNavigate;

  beforeEach(() => {
    mockOnNavigate = jest.fn();
  });

  it('should render search input and button', () => {
    render(<SearchBar bookIndex={mockBookIndex} onNavigate={mockOnNavigate} />);

    expect(screen.getByPlaceholderText(/חפש:/)).toBeInTheDocument();
    expect(screen.getByText(/חפש/)).toBeInTheDocument();
  });

  it('should call onNavigate with parsed reference on valid input', () => {
    render(<SearchBar bookIndex={mockBookIndex} onNavigate={mockOnNavigate} />);

    const input = screen.getByPlaceholderText(/חפש:/);
    const button = screen.getByText(/🔍/);

    fireEvent.change(input, { target: { value: 'Genesis 1:1' } });
    fireEvent.click(button);

    expect(mockOnNavigate).toHaveBeenCalledWith('genesis', 1, 1);
  });

  it('should handle form submission with Enter key', () => {
    render(<SearchBar bookIndex={mockBookIndex} onNavigate={mockOnNavigate} />);

    const input = screen.getByPlaceholderText(/חפש:/);

    fireEvent.change(input, { target: { value: 'Genesis 1' } });
    fireEvent.submit(input.closest('form'));

    expect(mockOnNavigate).toHaveBeenCalledWith('genesis', 1, null);
  });

  it('should show error message for invalid reference', () => {
    render(<SearchBar bookIndex={mockBookIndex} onNavigate={mockOnNavigate} />);

    const input = screen.getByPlaceholderText(/חפש:/);
    const button = screen.getByText(/🔍/);

    fireEvent.change(input, { target: { value: 'InvalidBook 1' } });
    fireEvent.click(button);

    expect(screen.getByText(/לא נמצא/)).toBeInTheDocument();
    expect(mockOnNavigate).not.toHaveBeenCalled();
  });

  it('should not submit empty search', () => {
    render(<SearchBar bookIndex={mockBookIndex} onNavigate={mockOnNavigate} />);

    const button = screen.getByText(/🔍/);
    fireEvent.click(button);

    expect(mockOnNavigate).not.toHaveBeenCalled();
  });

  it('should clear input after successful search', () => {
    render(<SearchBar bookIndex={mockBookIndex} onNavigate={mockOnNavigate} />);

    const input = screen.getByPlaceholderText(/חפש:/);
    const button = screen.getByText(/🔍/);

    fireEvent.change(input, { target: { value: 'Genesis 1' } });
    fireEvent.click(button);

    expect(input.value).toBe('');
  });

  it('should clear error message when typing', () => {
    render(<SearchBar bookIndex={mockBookIndex} onNavigate={mockOnNavigate} />);

    const input = screen.getByPlaceholderText(/חפש:/);
    const button = screen.getByText(/🔍/);

    // First, trigger an error
    fireEvent.change(input, { target: { value: 'InvalidBook 1' } });
    fireEvent.click(button);
    expect(screen.getByText(/לא נמצא/)).toBeInTheDocument();

    // Then type again - error should be cleared by submitting new search
    fireEvent.change(input, { target: { value: 'Genesis 1' } });
    fireEvent.click(button);
    expect(screen.queryByText(/לא נמצא/)).not.toBeInTheDocument();
  });

  it('should handle Hebrew references', () => {
    render(<SearchBar bookIndex={mockBookIndex} onNavigate={mockOnNavigate} />);

    const input = screen.getByPlaceholderText(/חפש:/);
    const button = screen.getByText(/🔍/);

    fireEvent.change(input, { target: { value: 'בראשית 1' } });
    fireEvent.click(button);

    expect(mockOnNavigate).toHaveBeenCalledWith('genesis', 1, null);
  });
});
