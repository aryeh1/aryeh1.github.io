import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Lazy load Kamea for better performance
const Kamea = lazy(() => import('@/components/kamea/Kamea').then(m => ({ default: m.Kamea })));

function LoadingSpinner() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full"
      />
    </div>
  );
}

export function Lab() {
  return (
    <main className="min-h-screen">

      {/* Kamea Section */}
      <section className="py-12">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Kamea />
          </Suspense>
        </ErrorBoundary>
      </section>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-xs text-gray-400">
          Experimental features and generative art
        </p>
      </footer>
    </main>
  );
}
