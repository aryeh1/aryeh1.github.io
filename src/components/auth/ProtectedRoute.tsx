import { useState, type ReactNode, type FormEvent } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PROTECTED_HASH } from '@/data/config';

interface ProtectedRouteProps {
  children: ReactNode;
}

/** Wrapper component that requires password authentication */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, login } = useAuth(PROTECTED_HASH);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const success = await login(password);

    if (!success) {
      setError(true);
      setPassword('');
    }
    setLoading(false);
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="w-full max-w-sm p-8 animate-fade-in">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <div className="text-4xl mb-4">鍵</div>
            <p className="text-sm text-gray-500">Protected area</p>
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--accent)] bg-transparent text-center"
              autoFocus
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">
              Incorrect password
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? '...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  );
}
