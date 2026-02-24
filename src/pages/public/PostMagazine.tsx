import { motion } from 'framer-motion';
import { post12 } from '@/data/post12';
import { useDarkMode } from '@/hooks/useDarkMode';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.7, ease: 'easeOut' as const },
};

/**
 * Option 1: Magazine / Editorial Style
 * Clean, sophisticated layout with pull quotes, drop caps, elegant spacing.
 * Inspired by high-end print magazines and newspapers.
 */
export function PostMagazine() {
  const { isDark, toggleTheme } = useDarkMode();

  return (
    <article dir="rtl" lang="he" className="min-h-screen">
      {/* Theme Toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={toggleTheme}
        className="fixed top-6 left-6 z-50 w-10 h-10 rounded-full
                   flex items-center justify-center
                   bg-[var(--bg-primary)] dark:bg-[var(--bg-dark)]
                   shadow-sm border border-[var(--border)] dark:border-[var(--border-dark)]
                   hover:bg-[var(--bg-alt)] dark:hover:bg-[var(--bg-dark-alt)]
                   transition-colors text-lg"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? '\u2600' : '\u263D'}
      </motion.button>

      {/* Hero Header */}
      <header className="relative py-24 md:py-36 px-6 overflow-hidden">
        {/* Decorative accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="absolute top-0 right-0 left-0 h-1 bg-[var(--accent)] dark:bg-[var(--accent-dark)]"
        />

        <div className="max-w-[var(--max-width-narrow)] mx-auto">
          {/* Series badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="inline-block px-4 py-1.5 text-sm font-medium tracking-wider
                           border border-[var(--accent)] dark:border-[var(--accent-dark)]
                           text-[var(--accent)] dark:text-[var(--accent-dark)]">
              {post12.seriesTitle} &middot; {post12.partNumber}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-light leading-tight mb-8"
            style={{ fontFamily: "'Noto Serif Hebrew', Georgia, serif" }}
          >
            {post12.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl font-light leading-relaxed
                       text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)]"
          >
            {post12.subtitle}
          </motion.p>

          {/* Author & Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 pt-8 border-t border-[var(--border)] dark:border-[var(--border-dark)]
                       flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-[var(--accent)] dark:bg-[var(--accent-dark)]
                          flex items-center justify-center text-white text-sm font-medium">
              {post12.author.charAt(0)}
            </div>
            <div>
              <div className="font-medium">{post12.author}</div>
              <div className="text-sm text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
                מתוך הסדרה &ldquo;{post12.seriesTitle}&rdquo;
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[var(--max-width)] mx-auto px-6 pb-24">
        {post12.sections.map((section, i) => (
          <div key={i} className="mb-16">
            {/* Pull Quote - appears before odd sections */}
            {section.pullQuote && i % 2 === 0 && (
              <motion.aside
                {...fadeIn}
                className="mb-12 py-8 border-r-4 border-[var(--accent)] dark:border-[var(--accent-dark)]
                           pr-8 mr-0 md:mr-12"
              >
                <p
                  className="text-2xl md:text-3xl font-light leading-relaxed
                           text-[var(--accent)] dark:text-[var(--accent-dark)]"
                  style={{ fontFamily: "'Noto Serif Hebrew', Georgia, serif" }}
                >
                  {section.pullQuote}
                </p>
              </motion.aside>
            )}

            {/* Body text */}
            <motion.div {...fadeIn} className="max-w-[var(--max-width-narrow)] mx-auto">
              {section.content.split('\n\n').map((para, j) => (
                <p
                  key={j}
                  className="text-lg leading-[2] mb-6
                           text-[var(--text-primary)] dark:text-[var(--text-dark)]"
                  style={
                    i === 0 && j === 0
                      ? { fontFamily: "'Noto Serif Hebrew', Georgia, serif", fontSize: '1.25rem' }
                      : undefined
                  }
                >
                  {para}
                </p>
              ))}
            </motion.div>

            {/* Pull Quote - appears after even sections */}
            {section.pullQuote && i % 2 === 1 && (
              <motion.aside
                {...fadeIn}
                className="mt-12 py-8 border-l-4 border-[var(--accent)] dark:border-[var(--accent-dark)]
                           pl-8 ml-0 md:ml-12 text-left"
              >
                <p
                  className="text-2xl md:text-3xl font-light leading-relaxed
                           text-[var(--accent)] dark:text-[var(--accent-dark)]"
                  style={{ fontFamily: "'Noto Serif Hebrew', Georgia, serif" }}
                >
                  {section.pullQuote}
                </p>
              </motion.aside>
            )}

            {/* Section divider */}
            {i < post12.sections.length - 1 && (
              <motion.div
                {...fadeIn}
                className="flex justify-center items-center gap-3 my-16"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] dark:bg-[var(--accent-dark)]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] dark:bg-[var(--accent-dark)]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] dark:bg-[var(--accent-dark)]" />
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] dark:border-[var(--border-dark)] py-12 px-6">
        <div className="max-w-[var(--max-width-narrow)] mx-auto text-center">
          <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
            {post12.seriesTitle} &middot; {post12.author}
          </p>
        </div>
      </footer>
    </article>
  );
}
