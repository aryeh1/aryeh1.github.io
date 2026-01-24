import { lazy, Suspense, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Lazy load Kamea
const Kamea = lazy(() => import('@/components/kamea/Kamea').then(m => ({ default: m.Kamea })));

function LoadingSpinner() {
  return (
    <div className="min-h-[300px] flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full"
      />
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

const categories: { id: Category; label: string; labelHe: string }[] = [
  { id: 'apps', label: 'Apps', labelHe: 'אפליקציות' },
  { id: 'nonsense', label: 'Nonsense', labelHe: 'שטויות' },
];

export function Lab() {
  const [activeCategory, setActiveCategory] = useState<Category>('apps');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const filteredItems = labItems.filter(item => item.category === activeCategory);

  return (
    <main className="min-h-screen max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl font-light mb-2">Lab</h1>
        <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)]">
          Experiments and side projects
        </p>
      </motion.header>

      {/* Category Tabs */}
      <div className="flex justify-center gap-1 mb-12 p-1 bg-[var(--bg-alt)] dark:bg-[var(--bg-dark-alt)] rounded-lg w-fit mx-auto">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              setExpandedItem(null);
            }}
            className={`px-6 py-2 rounded-md text-sm transition-all ${
              activeCategory === cat.id
                ? 'bg-[var(--bg-card)] dark:bg-[var(--bg-dark-card)] text-[var(--text-primary)] dark:text-[var(--text-dark)] shadow-sm'
                : 'text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)] hover:text-[var(--text-primary)] dark:hover:text-[var(--text-dark)]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {filteredItems.map(item => (
            <div key={item.id}>
              {/* Item Card */}
              <motion.div
                layout
                className={`p-6 rounded-xl border transition-colors cursor-pointer ${
                  expandedItem === item.id
                    ? 'bg-[var(--bg-card)] dark:bg-[var(--bg-dark-card)] border-[var(--accent)]'
                    : 'bg-[var(--bg-alt)] dark:bg-[var(--bg-dark-alt)] border-transparent hover:border-[var(--border)] dark:hover:border-[var(--border-dark)]'
                }`}
                onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-light">
                      {item.title}
                      {item.titleHe && (
                        <span className="ml-3 text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] font-serif-he">
                          {item.titleHe}
                        </span>
                      )}
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)] mt-1">
                      {item.description}
                    </p>
                  </div>
                  <motion.span
                    animate={{ rotate: expandedItem === item.id ? 45 : 0 }}
                    className="text-xl text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]"
                  >
                    +
                  </motion.span>
                </div>

                {/* Link if available */}
                {item.link && expandedItem !== item.id && (
                  <Link
                    to={item.link}
                    onClick={e => e.stopPropagation()}
                    className="inline-block mt-4 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)]"
                  >
                    View details →
                  </Link>
                )}
              </motion.div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedItem === item.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4">
                      {item.link ? (
                        <div className="text-center py-8">
                          <Link
                            to={item.link}
                            className="inline-block px-6 py-3 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
                          >
                            Open {item.title}
                          </Link>
                        </div>
                      ) : item.id === 'kamea' ? (
                        <ErrorBoundary>
                          <Suspense fallback={<LoadingSpinner />}>
                            <Kamea />
                          </Suspense>
                        </ErrorBoundary>
                      ) : null}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
              Nothing here yet
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-[var(--border)] dark:border-[var(--border-dark)] text-center">
        <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
          More experiments coming
        </p>
      </footer>
    </main>
  );
}
