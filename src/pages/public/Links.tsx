import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Link {
  id: string;
  title: string;
  titleHe?: string;
  url: string;
  description: string;
  category: Category;
  icon: string;
  shortcut?: string; // keyboard shortcut
}

type Category = 'ai' | 'dev' | 'tools' | 'learn';

const links: Link[] = [
  // AI Tools
  {
    id: 'claude-code',
    title: 'Claude Code',
    titleHe: 'קלוד קוד',
    url: 'https://console.anthropic.com',
    description: 'AI coding assistant in the cloud',
    category: 'ai',
    icon: '🤖',
    shortcut: 'c',
  },
  {
    id: 'claude-chat',
    title: 'Claude Chat',
    titleHe: 'קלוד צ\'אט',
    url: 'https://claude.ai',
    description: 'Chat with Claude',
    category: 'ai',
    icon: '💬',
    shortcut: 'a',
  },
  {
    id: 'chatgpt',
    title: 'ChatGPT',
    url: 'https://chat.openai.com',
    description: 'OpenAI ChatGPT',
    category: 'ai',
    icon: '🧠',
  },
  {
    id: 'perplexity',
    title: 'Perplexity',
    url: 'https://perplexity.ai',
    description: 'AI-powered search',
    category: 'ai',
    icon: '🔍',
    shortcut: 'p',
  },
  // Development
  {
    id: 'github',
    title: 'GitHub',
    titleHe: 'גיטהאב',
    url: 'https://github.com',
    description: 'Code repositories',
    category: 'dev',
    icon: '🐙',
    shortcut: 'g',
  },
  {
    id: 'github-claude',
    title: 'Claude Code GitHub',
    url: 'https://github.com/anthropics/claude-code',
    description: 'Claude Code repository',
    category: 'dev',
    icon: '📦',
  },
  {
    id: 'npm',
    title: 'npm',
    url: 'https://npmjs.com',
    description: 'Node package manager',
    category: 'dev',
    icon: '📦',
  },
  {
    id: 'vercel',
    title: 'Vercel',
    url: 'https://vercel.com',
    description: 'Deployment platform',
    category: 'dev',
    icon: '▲',
  },
  // Tools
  {
    id: 'excalidraw',
    title: 'Excalidraw',
    url: 'https://excalidraw.com',
    description: 'Quick whiteboard sketches',
    category: 'tools',
    icon: '✏️',
    shortcut: 'e',
  },
  {
    id: 'regex101',
    title: 'Regex101',
    url: 'https://regex101.com',
    description: 'Test regular expressions',
    category: 'tools',
    icon: '🔣',
  },
  {
    id: 'jsoncrack',
    title: 'JSON Crack',
    url: 'https://jsoncrack.com',
    description: 'Visualize JSON data',
    category: 'tools',
    icon: '🌳',
  },
  {
    id: 'caniuse',
    title: 'Can I Use',
    url: 'https://caniuse.com',
    description: 'Browser compatibility tables',
    category: 'tools',
    icon: '🌐',
  },
  // Learn
  {
    id: 'mdn',
    title: 'MDN Docs',
    url: 'https://developer.mozilla.org',
    description: 'Web documentation',
    category: 'learn',
    icon: '📚',
    shortcut: 'm',
  },
  {
    id: 'typescript',
    title: 'TypeScript Docs',
    url: 'https://www.typescriptlang.org/docs/',
    description: 'TypeScript documentation',
    category: 'learn',
    icon: '🔷',
  },
  {
    id: 'react',
    title: 'React Docs',
    url: 'https://react.dev',
    description: 'React documentation',
    category: 'learn',
    icon: '⚛️',
  },
  {
    id: 'tailwind',
    title: 'Tailwind CSS',
    url: 'https://tailwindcss.com/docs',
    description: 'Tailwind documentation',
    category: 'learn',
    icon: '🎨',
  },
];

const categories: { id: Category; label: string; labelHe: string }[] = [
  { id: 'ai', label: 'AI', labelHe: 'בינה מלאכותית' },
  { id: 'dev', label: 'Development', labelHe: 'פיתוח' },
  { id: 'tools', label: 'Tools', labelHe: 'כלים' },
  { id: 'learn', label: 'Learn', labelHe: 'למידה' },
];

const FAVORITES_KEY = 'links-favorites';

export function Links() {
  const [activeCategory, setActiveCategory] = useState<Category | 'favorites'>('ai');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
  }, [favorites]);

  // Toggle favorite
  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement) return;

      // Show shortcuts on ? or /
      if (e.key === '?' || (e.key === '/' && !e.metaKey && !e.ctrlKey)) {
        e.preventDefault();
        if (e.key === '/') {
          document.getElementById('link-search')?.focus();
        } else {
          setShowShortcuts(prev => !prev);
        }
        return;
      }

      // Check for link shortcuts
      const link = links.find(l => l.shortcut === e.key.toLowerCase());
      if (link && !e.metaKey && !e.ctrlKey && !e.altKey) {
        window.open(link.url, '_blank', 'noopener,noreferrer');
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter links
  const filteredLinks = useMemo(() => {
    let result = links;

    // Category filter
    if (activeCategory === 'favorites') {
      result = result.filter(l => favorites.has(l.id));
    } else {
      result = result.filter(l => l.category === activeCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(l =>
        l.title.toLowerCase().includes(query) ||
        l.description.toLowerCase().includes(query) ||
        l.titleHe?.includes(query)
      );
    }

    return result;
  }, [activeCategory, searchQuery, favorites]);

  return (
    <main className="min-h-screen max-w-2xl mx-auto px-6 py-16">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-12"
      >
        <h1 className="text-2xl font-light tracking-wide mb-2">Links</h1>
        <p className="text-sm opacity-60">קיצורי דרך מהירים</p>
      </motion.header>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <input
            id="link-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search links... (press / to focus)"
            className="w-full px-4 py-3 rounded-lg
                       bg-[var(--input-bg)] dark:bg-[var(--input-bg-dark)]
                       border border-[var(--border)] dark:border-[var(--border-dark)]
                       focus:outline-none focus:border-[var(--accent)]
                       text-sm placeholder:opacity-50"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-40 hidden sm:block">
            /
          </kbd>
        </div>
      </div>

      {/* Category Navigation */}
      <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-12 text-sm">
        <button
          onClick={() => setActiveCategory('favorites')}
          className={`pb-1 transition-colors flex items-center gap-1 ${
            activeCategory === 'favorites'
              ? 'border-b border-[var(--accent)]'
              : 'opacity-50 hover:opacity-100'
          }`}
        >
          ★ Favorites
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`pb-1 transition-colors ${
              activeCategory === cat.id
                ? 'border-b border-[var(--accent)]'
                : 'opacity-50 hover:opacity-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      {/* Links Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filteredLinks.map((link, index) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="group relative p-4 rounded-lg
                         bg-[var(--bg-card)] dark:bg-[var(--bg-dark-card)]
                         border border-[var(--border)] dark:border-[var(--border-dark)]
                         hover:border-[var(--accent)] transition-all
                         hover:shadow-sm"
            >
              {/* Favorite button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite(link.id);
                }}
                className="absolute top-3 right-3 opacity-30 hover:opacity-100 transition-opacity"
                aria-label={favorites.has(link.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                {favorites.has(link.id) ? '★' : '☆'}
              </button>

              {/* Icon and title */}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{link.icon}</span>
                <div>
                  <h3 className="font-medium text-sm group-hover:text-[var(--accent)] transition-colors">
                    {link.title}
                  </h3>
                  {link.titleHe && (
                    <span className="text-xs opacity-50 font-serif-he">
                      {link.titleHe}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs opacity-60 ml-9">
                {link.description}
              </p>

              {/* Keyboard shortcut */}
              {link.shortcut && (
                <kbd className="absolute bottom-3 right-3 text-[10px] px-1.5 py-0.5
                                bg-[var(--bg-alt)] dark:bg-[var(--bg-dark-alt)]
                                rounded opacity-40 group-hover:opacity-70 uppercase">
                  {link.shortcut}
                </kbd>
              )}
            </motion.a>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {filteredLinks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 opacity-50"
        >
          <p className="text-sm">
            {activeCategory === 'favorites'
              ? 'No favorites yet. Click ☆ to add links.'
              : 'No links found.'}
          </p>
        </motion.div>
      )}

      {/* Keyboard shortcuts modal */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--overlay)] dark:bg-[var(--overlay-dark)]"
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[var(--bg-primary)] dark:bg-[var(--bg-dark)]
                         rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-lg font-light mb-4">Keyboard Shortcuts</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="opacity-60">Search</span>
                  <kbd className="px-2 py-0.5 bg-[var(--bg-alt)] dark:bg-[var(--bg-dark-alt)] rounded text-xs">/</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Show shortcuts</span>
                  <kbd className="px-2 py-0.5 bg-[var(--bg-alt)] dark:bg-[var(--bg-dark-alt)] rounded text-xs">?</kbd>
                </div>
                <div className="border-t border-[var(--border)] dark:border-[var(--border-dark)] my-3" />
                {links.filter(l => l.shortcut).map(link => (
                  <div key={link.id} className="flex justify-between">
                    <span className="opacity-60">{link.title}</span>
                    <kbd className="px-2 py-0.5 bg-[var(--bg-alt)] dark:bg-[var(--bg-dark-alt)] rounded text-xs uppercase">
                      {link.shortcut}
                    </kbd>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowShortcuts(false)}
                className="mt-6 w-full py-2 text-sm text-[var(--accent)] hover:opacity-70"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer hint */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center"
      >
        <p className="text-xs opacity-40">
          Press <kbd className="px-1.5 py-0.5 bg-[var(--bg-alt)] dark:bg-[var(--bg-dark-alt)] rounded">?</kbd> for keyboard shortcuts
        </p>
      </motion.footer>
    </main>
  );
}
