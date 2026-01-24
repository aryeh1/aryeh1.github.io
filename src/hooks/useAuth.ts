import { useState, useCallback, useEffect } from 'react';
import type { AuthState } from '@/types';

const AUTH_KEY = 'site_auth';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/** Hash a string using SHA-256 */
async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Custom hook for client-side authentication */
export function useAuth(expectedHash: string) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (stored) {
        const parsed: AuthState = JSON.parse(stored);
        const isExpired = parsed.timestamp && Date.now() - parsed.timestamp > SESSION_DURATION;
        if (!isExpired && parsed.isAuthenticated) {
          return parsed;
        }
      }
    } catch {
      // Invalid stored data
    }
    return { isAuthenticated: false };
  });

  const login = useCallback(async (password: string): Promise<boolean> => {
    const hash = await hashString(password);
    const isValid = hash === expectedHash;

    if (isValid) {
      const newState: AuthState = {
        isAuthenticated: true,
        timestamp: Date.now(),
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(newState));
      setAuthState(newState);
    }

    return isValid;
  }, [expectedHash]);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setAuthState({ isAuthenticated: false });
  }, []);

  useEffect(() => {
    // Check expiration on mount and periodically
    const checkExpiration = () => {
      if (authState.timestamp && Date.now() - authState.timestamp > SESSION_DURATION) {
        logout();
      }
    };

    checkExpiration();
    const interval = setInterval(checkExpiration, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [authState.timestamp, logout]);

  return {
    isAuthenticated: authState.isAuthenticated,
    login,
    logout,
  };
}
