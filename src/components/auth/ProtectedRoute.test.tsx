import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from './ProtectedRoute';

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows password form when not authenticated', () => {
    render(
      <ProtectedRoute>
        <div>Secret Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.queryByText('Secret Content')).not.toBeInTheDocument();
  });

  it('shows protected content when authenticated', () => {
    // Simulate authenticated state
    localStorage.setItem('site_auth', JSON.stringify({
      isAuthenticated: true,
      timestamp: Date.now(),
    }));

    render(
      <ProtectedRoute>
        <div>Secret Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Secret Content')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Password')).not.toBeInTheDocument();
  });
});
