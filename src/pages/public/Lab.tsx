import { lazy, Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const Kamea = lazy(() => import('@/components/kamea/Kamea').then(m => ({ default: m.Kamea })));

function LoadingSpinner() {
  return (
    <div className="min-h-[200px] flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

type Category = 'apps' | 'nonsense';

interface LabItem {
  id: string;
  title: string;
  titleHe?: string;
  description: string;
  category: Category;
  link?: string;
}

const labItems: LabItem[] = [
  {
    id: 'notme',
    title: 'NotMe',
    titleHe: 'לא אני',
    description: 'Privacy-focused notification logger for Android',
    category: 'apps',
    link: '/app/not-me',
  },
  {
    id: 'kamea',
    title: 'Kamea',
    titleHe: 'קמע',
    description: 'Generative amulet patterns from text',
    category: 'nonsense',
  },
];

const categories: { id: Category; label: string }[] = [
  { id: 'apps', label: 'Apps' },
  { id: 'nonsense', label: 'Nonsense' },
];

export function Lab() {
  const [activeCategory, setActiveCategory] = useState<Category>('apps');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const filteredItems = labItems.filter(item => item.category === activeCategory);

  return (
    <main className="min-h-screen max-w-2xl mx-auto px-6 py-16">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-16"
      >
        <h1 className="text-2xl font-light tracking-wide">Lab</h1>
      </motion.header>

      {/* Category Navigation - simple text links */}
      <nav className="flex justify-center gap-8 mb-16 text-sm">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              setExpandedItem(null);
            }}
            className={`pb-1 transition-colors ${
              activeCategory === cat.id
                ? 'text-[var(--text-primary)] dark:text-[var(--text-dark)] border-b border-[var(--accent)]'
                : 'text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] hover:text-[var(--text-primary)] dark:hover:text-[var(--text-dark)]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      {/* Items - simple list */}
      <div className="space-y-12">
        {filteredItems.map((item, index) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Title row */}
            <div className="flex items-baseline gap-3 mb-2">
              <h2 className="text-lg font-light">{item.title}</h2>
              {item.titleHe && (
                <span className="text-sm text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] font-serif-he">
                  {item.titleHe}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)] mb-4">
              {item.description}
            </p>

            {/* Action */}
            {item.link ? (
              <Link
                to={item.link}
                className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)]"
              >
                View →
              </Link>
            ) : (
              <button
                onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)]"
              >
                {expandedItem === item.id ? 'Close' : 'Open'} →
              </button>
            )}

            {/* Expanded content */}
            {expandedItem === item.id && item.id === 'kamea' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 pt-8 border-t border-[var(--border)] dark:border-[var(--border-dark)]"
              >
                <ErrorBoundary>
                  <Suspense fallback={<LoadingSpinner />}>
                    <Kamea />
                  </Suspense>
                </ErrorBoundary>
              </motion.div>
            )}
          </motion.article>
        ))}
      </div>

      {/* Divider */}
      <div className="my-16 flex justify-center">
        <div className="w-12 h-px bg-[var(--border)] dark:bg-[var(--border-dark)]" />
      </div>

      {/* Footer */}
      <footer className="text-center">
        <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
          More experiments coming
        </p>
      </footer>
    </main>
  );
}
