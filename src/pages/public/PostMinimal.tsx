import { motion } from 'framer-motion';
import { post12 } from '@/data/post12';
import { useDarkMode } from '@/hooks/useDarkMode';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6, ease: 'easeOut' as const },
};

/**
 * Option 3: Minimal / Modern Blog Style
 * Clean, Substack-like reading experience. Maximum readability,
 * generous whitespace, subtle typography hierarchy. Like a well-set book.
 */
export function PostMinimal() {
  const { isDark, toggleTheme } = useDarkMode();

  return (
    <article dir="rtl" lang="he" className="min-h-screen">
      {/* Floating top bar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="sticky top-0 z-50 px-6 py-3
                   bg-[var(--bg-primary)]/90 dark:bg-[var(--bg-dark)]/90
                   backdrop-blur-sm
                   border-b border-[var(--border)]/50 dark:border-[var(--border-dark)]/50"
      >
        <div className="max-w-[var(--max-width-narrow)] mx-auto flex items-center justify-between">
          <span className="text-sm text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
            {post12.author} &middot; {post12.seriesTitle}
          </span>
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full flex items-center justify-center
                       hover:bg-[var(--bg-alt)] dark:hover:bg-[var(--bg-dark-alt)]
                       transition-colors text-base"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? '\u2600' : '\u263D'}
          </button>
        </div>
      </motion.nav>

      {/* Header */}
      <header className="max-w-[var(--max-width-narrow)] mx-auto px-6 pt-16 md:pt-24 pb-12">
        {/* Series tag */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <span className="text-sm text-[var(--accent)] dark:text-[var(--accent-dark)] font-medium">
            {post12.seriesTitle}, {post12.partNumber}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold leading-tight mb-6"
        >
          {post12.title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-lg md:text-xl leading-relaxed
                     text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)]"
        >
          {post12.subtitle}
        </motion.p>

        {/* Author line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 pt-6 border-t border-[var(--border)] dark:border-[var(--border-dark)]
                     text-sm text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]"
        >
          {post12.author}
        </motion.div>
      </header>

      {/* Content */}
      <div className="max-w-[var(--max-width-narrow)] mx-auto px-6 pb-24">
        {post12.sections.map((section, i) => (
          <motion.section key={i} {...fadeUp} className="mb-12">
            {/* Body paragraphs */}
            {section.content.split('\n\n').map((para, j) => {
              // Check if paragraph contains a direct quote (starts with ")
              const isQuote = para.startsWith('"') || para.startsWith('\u201C');

              return isQuote ? (
                <blockquote
                  key={j}
                  className="my-8 pr-6 border-r-2
                           border-[var(--accent)] dark:border-[var(--accent-dark)]
                           text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)]
                           italic text-lg leading-[2]"
                >
                  {para}
                </blockquote>
              ) : (
                <p
                  key={j}
                  className="text-[1.125rem] leading-[2] mb-5
                           text-[var(--text-primary)] dark:text-[var(--text-dark)]"
                >
                  {para}
                </p>
              );
            })}

            {/* Highlighted quote card */}
            {section.pullQuote && (
              <div className="my-10 p-6 rounded-lg
                            bg-[var(--bg-alt)] dark:bg-[var(--bg-dark-alt)]">
                <p
                  className="text-lg md:text-xl font-medium leading-relaxed
                           text-[var(--text-primary)] dark:text-[var(--text-dark)]"
                  style={{ fontFamily: "'Noto Serif Hebrew', Georgia, serif" }}
                >
                  {section.pullQuote}
                </p>
              </div>
            )}

            {/* Simple divider */}
            {i < post12.sections.length - 1 && (
              <div className="my-12 flex justify-center">
                <div className="w-16 h-px bg-[var(--border)] dark:bg-[var(--border-dark)]" />
              </div>
            )}
          </motion.section>
        ))}
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] dark:border-[var(--border-dark)]
                        py-12 px-6">
        <div className="max-w-[var(--max-width-narrow)] mx-auto text-center
                       text-sm text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
          <p>{post12.seriesTitle} &middot; {post12.author}</p>
        </div>
      </footer>
    </article>
  );
}
