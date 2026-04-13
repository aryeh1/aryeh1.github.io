import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { notmeConfig } from '@/data/notme';
import { useDarkMode } from '@/hooks/useDarkMode';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6, ease: 'easeOut' as const },
};

/** NotMe app showcase page */
export function NotMe() {
  const { isDark, toggleTheme } = useDarkMode();

  return (
    <div className="min-h-screen">
      {/* Nav bar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="sticky top-0 z-50 px-6 py-3
                   bg-[var(--bg-primary)]/90 dark:bg-[var(--bg-dark)]/90
                   backdrop-blur-sm
                   border-b border-[var(--border)]/50 dark:border-[var(--border-dark)]/50"
      >
        <div className="max-w-[var(--max-width-narrow)] mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="text-sm text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]
                       hover:text-[var(--accent)] dark:hover:text-[var(--accent-dark)]
                       transition-colors"
          >
            &larr; Back
          </Link>
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full flex items-center justify-center
                       hover:bg-[var(--bg-alt)] dark:hover:bg-[var(--bg-dark-alt)]
                       transition-colors text-base"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? '☀' : '☽'}
          </button>
        </div>
      </motion.nav>

      {/* Header */}
      <motion.header
        variants={stagger}
        initial="initial"
        animate="animate"
        className="max-w-[var(--max-width-narrow)] mx-auto px-6 pt-16 md:pt-24 pb-8 text-center"
      >
        <motion.h1
          variants={fadeInUp}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-4xl md:text-5xl font-light tracking-wide"
        >
          {notmeConfig.name}
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          className="text-lg text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)] font-light mt-4"
        >
          {notmeConfig.tagline}
        </motion.p>

        <motion.span
          variants={fadeInUp}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-block mt-4 text-xs px-3 py-1 rounded-full
                     border border-[var(--accent)] dark:border-[var(--accent-dark)]
                     text-[var(--accent)] dark:text-[var(--accent-dark)]"
        >
          v{notmeConfig.version} on Google Play
        </motion.span>

        {/* Red accent divider */}
        <motion.div
          variants={fadeInUp}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center py-8"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-16 h-px bg-[var(--accent)] dark:bg-[var(--accent-dark)]"
          />
        </motion.div>
      </motion.header>

      {/* Features */}
      <section className="max-w-[var(--max-width-narrow)] mx-auto px-6 pb-16">
        <motion.div
          {...fadeUp}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {notmeConfig.features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-5 rounded-xl
                         bg-[var(--bg-card)] dark:bg-[var(--bg-dark-card)]
                         border border-[var(--border)] dark:border-[var(--border-dark)]"
            >
              <div className="text-xl mb-2 text-[var(--accent)] dark:text-[var(--accent-dark)]">
                {feature.icon}
              </div>
              <h3 className="text-base font-medium mb-1">{feature.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Privacy */}
      <motion.section
        {...fadeUp}
        className="max-w-[var(--max-width-narrow)] mx-auto px-6 pb-16"
      >
        <div className="p-6 md:p-8 rounded-xl bg-[var(--bg-alt)] dark:bg-[var(--bg-dark-alt)]">
          <h2 className="text-xl font-light mb-4">Privacy by design</h2>
          <ul className="space-y-2">
            {notmeConfig.privacy.map((point) => (
              <li
                key={point}
                className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)] flex items-start gap-2"
              >
                <span className="text-[var(--accent)] dark:text-[var(--accent-dark)] mt-0.5 shrink-0">
                  ✓
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* Tech */}
      <motion.p
        {...fadeUp}
        className="max-w-[var(--max-width-narrow)] mx-auto px-6 pb-12
                   text-center text-sm text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]"
      >
        Built with {notmeConfig.tech}
      </motion.p>

      {/* Links */}
      <motion.nav
        {...fadeUp}
        className="max-w-[var(--max-width-narrow)] mx-auto px-6 pb-16
                   flex justify-center gap-8 text-sm"
      >
        <a
          href={notmeConfig.playStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pb-1 border-b border-[var(--border)] dark:border-[var(--border-dark)]
                     hover:border-[var(--accent)] dark:hover:border-[var(--accent-dark)]
                     hover:text-[var(--accent)] dark:hover:text-[var(--accent-dark)]
                     transition-colors"
        >
          Google Play
        </a>
      </motion.nav>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="pb-8 text-center"
      >
        <div className="text-xs text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
          {notmeConfig.name}
        </div>
      </motion.footer>
    </div>
  );
}
