import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDarkMode } from './useDarkMode';

describe('useDarkMode', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();

    // Reset document classes
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)' ? false : false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('should default to system theme', () => {
    const { result } = renderHook(() => useDarkMode());
    expect(result.current.theme).toBe('system');
  });

  it('should toggle between light and dark', () => {
    const { result } = renderHook(() => useDarkMode());

    // Start with light (system default mocked to light)
    expect(result.current.isDark).toBe(false);

    // Toggle to dark
    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.isDark).toBe(true);
  });

  it('should persist theme to localStorage', () => {
    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(localStorage.getItem('theme-preference')).toBe('dark');
  });

  it('should load theme from localStorage', () => {
    localStorage.setItem('theme-preference', 'dark');

    const { result } = renderHook(() => useDarkMode());

    expect(result.current.theme).toBe('dark');
    expect(result.current.isDark).toBe(true);
  });

  it('should add dark class to body when dark mode', () => {
    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(document.body.classList.contains('dark')).toBe(true);
  });

  it('should remove dark class when switching to light', () => {
    document.body.classList.add('dark');

    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current.setTheme('light');
    });

    expect(document.body.classList.contains('dark')).toBe(false);
  });
});
