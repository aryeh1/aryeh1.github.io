import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';

// SHA-256 hash of "testpassword"
const TEST_PASSWORD_HASH = '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';
const TEST_PASSWORD = 'test';

// Helper to compute SHA-256 hash (same as in useAuth)
async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should start unauthenticated', () => {
    const { result } = renderHook(() => useAuth(TEST_PASSWORD_HASH));
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should authenticate with correct password', async () => {
    // First compute the actual hash
    const actualHash = await hashString(TEST_PASSWORD);

    const { result } = renderHook(() => useAuth(actualHash));

    let loginResult: boolean = false;
    await act(async () => {
      loginResult = await result.current.login(TEST_PASSWORD);
    });

    expect(loginResult).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should reject incorrect password', async () => {
    const { result } = renderHook(() => useAuth(TEST_PASSWORD_HASH));

    let loginResult: boolean = false;
    await act(async () => {
      loginResult = await result.current.login('wrongpassword');
    });

    expect(loginResult).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should persist auth state to localStorage', async () => {
    const actualHash = await hashString(TEST_PASSWORD);
    const { result } = renderHook(() => useAuth(actualHash));

    await act(async () => {
      await result.current.login(TEST_PASSWORD);
    });

    const stored = localStorage.getItem('site_auth');
    expect(stored).not.toBeNull();

    const parsed = JSON.parse(stored!);
    expect(parsed.isAuthenticated).toBe(true);
    expect(parsed.timestamp).toBeDefined();
  });

  it('should load auth state from localStorage', async () => {
    const authState = {
      isAuthenticated: true,
      timestamp: Date.now(),
    };
    localStorage.setItem('site_auth', JSON.stringify(authState));

    const { result } = renderHook(() => useAuth(TEST_PASSWORD_HASH));
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should logout and clear localStorage', async () => {
    const actualHash = await hashString(TEST_PASSWORD);
    const { result } = renderHook(() => useAuth(actualHash));

    await act(async () => {
      await result.current.login(TEST_PASSWORD);
    });

    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('site_auth')).toBeNull();
  });

  it('should expire session after 24 hours', async () => {
    // Set auth state from 25 hours ago
    const expiredState = {
      isAuthenticated: true,
      timestamp: Date.now() - (25 * 60 * 60 * 1000),
    };
    localStorage.setItem('site_auth', JSON.stringify(expiredState));

    const { result } = renderHook(() => useAuth(TEST_PASSWORD_HASH));

    // Should not be authenticated due to expiration
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should keep session valid within 24 hours', () => {
    // Set auth state from 23 hours ago
    const validState = {
      isAuthenticated: true,
      timestamp: Date.now() - (23 * 60 * 60 * 1000),
    };
    localStorage.setItem('site_auth', JSON.stringify(validState));

    const { result } = renderHook(() => useAuth(TEST_PASSWORD_HASH));

    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle corrupted localStorage gracefully', () => {
    localStorage.setItem('site_auth', 'not-valid-json');

    const { result } = renderHook(() => useAuth(TEST_PASSWORD_HASH));
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should setup and cleanup expiration check interval', () => {
    const validState = {
      isAuthenticated: true,
      timestamp: Date.now(),
    };
    localStorage.setItem('site_auth', JSON.stringify(validState));

    const { result, unmount } = renderHook(() => useAuth(TEST_PASSWORD_HASH));
    expect(result.current.isAuthenticated).toBe(true);

    // Verify hook sets up correctly and cleans up without errors
    unmount();
  });
});
