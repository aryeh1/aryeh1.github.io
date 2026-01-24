import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '@/hooks/useDarkMode';
import { siteConfig } from '@/data/config';

interface NavLink {
  path: string;
  label: string;
  labelHe?: string;
  external?: boolean;
}

const navLinks: NavLink[] = [
  { path: '/', label: 'Home', labelHe: 'בית' },
  { path: '/projects', label: 'Projects', labelHe: 'פרויקטים' },
  { path: '/lab', label: 'Lab', labelHe: 'מעבדה' },
  { path: '/links', label: 'Links', labelHe: 'קישורים' },
  { path: '/archive', label: 'Archive', labelHe: 'ארכיון', external: true },
];

export function Header() {
  const { isDark, toggleTheme } = useDarkMode();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-primary)] dark:bg-[var(--bg-dark)] border-b border-[var(--border)] dark:border-[var(--border-dark)]">
      <div className="max-w-[var(--max-width)] mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            to="/"
            className="text-lg font-light tracking-wide hover:text-[var(--accent)] dark:hover:text-[var(--accent-dark)] transition-colors"
          >
            {siteConfig.name}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.path}>
                  {link.external ? (
                    <a
                      href={link.path}
                      className="text-sm font-normal relative py-1 transition-colors
                                 text-[var(--text-primary)] dark:text-[var(--text-dark)]
                                 hover:text-[var(--accent)] dark:hover:text-[var(--accent-dark)]"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className={`text-sm font-normal relative py-1 transition-colors
                        ${location.pathname === link.path
                          ? 'text-[var(--accent)] dark:text-[var(--accent-dark)]'
                          : 'text-[var(--text-primary)] dark:text-[var(--text-dark)] hover:text-[var(--accent)] dark:hover:text-[var(--accent-dark)]'
                        }`}
                    >
                      {link.label}
                      {location.pathname === link.path && (
                        <motion.div
                          layoutId="nav-underline"
                          className="absolute bottom-0 left-0 right-0 h-px bg-[var(--accent)] dark:bg-[var(--accent-dark)]"
                        />
                      )}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center
                         hover:bg-[var(--bg-alt)] dark:hover:bg-[var(--bg-dark-alt)]
                         transition-colors text-base"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? '☀' : '☽'}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center
                         hover:bg-[var(--bg-alt)] dark:hover:bg-[var(--bg-dark-alt)]
                         transition-colors"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? '☀' : '☽'}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-9 h-9 flex flex-col items-center justify-center gap-1.5"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="w-5 h-px bg-current block"
              />
              <motion.span
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-5 h-px bg-current block"
              />
              <motion.span
                animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="w-5 h-px bg-current block"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[var(--border)] dark:border-[var(--border-dark)]"
          >
            <ul className="py-4 px-6 space-y-2">
              {navLinks.map((link) => (
                <li key={link.path}>
                  {link.external ? (
                    <a
                      href={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-2 text-sm transition-colors
                                 text-[var(--text-primary)] dark:text-[var(--text-dark)]
                                 hover:text-[var(--accent)] dark:hover:text-[var(--accent-dark)]"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block py-2 text-sm transition-colors
                        ${location.pathname === link.path
                          ? 'text-[var(--accent)] dark:text-[var(--accent-dark)]'
                          : 'text-[var(--text-primary)] dark:text-[var(--text-dark)] hover:text-[var(--accent)] dark:hover:text-[var(--accent-dark)]'
                        }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
