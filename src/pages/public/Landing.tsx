import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { siteConfig } from '@/data/config';
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

/** Minimalist landing page - Japanese-inspired */
export function Landing() {
  const { isDark, toggleTheme } = useDarkMode();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 relative">
      {/* Theme Toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        onClick={toggleTheme}
        className="absolute top-6 right-6 w-10 h-10 rounded-full
                   flex items-center justify-center
                   hover:bg-gray-100 dark:hover:bg-gray-800
                   transition-colors text-lg"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? '☀' : '☽'}
      </motion.button>

      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="text-center space-y-6"
      >
        {/* Name */}
        <motion.h1
          variants={fadeInUp}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-4xl md:text-5xl font-light tracking-wide"
        >
          {siteConfig.name}
        </motion.h1>

        {/* Title */}
        <motion.p
          variants={fadeInUp}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          className="text-lg text-gray-500 dark:text-gray-400 font-light"
        >
          {siteConfig.title}
        </motion.p>

        {/* Divider - Japanese-inspired */}
        <motion.div
          variants={fadeInUp}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center py-4"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-16 h-px bg-[var(--accent)]"
          />
        </motion.div>

        {/* Social Links */}
        <motion.nav
          variants={fadeInUp}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-8 text-sm"
        >
          {siteConfig.social.linkedin && (
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] transition-colors"
            >
              LinkedIn
            </a>
          )}
          {siteConfig.social.github && (
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] transition-colors"
            >
              GitHub
            </a>
          )}
          {siteConfig.social.email && (
            <a
              href={`mailto:${siteConfig.social.email}`}
              className="hover:text-[var(--accent)] transition-colors"
            >
              Email
            </a>
          )}
        </motion.nav>

        {/* Lab Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Link
            to="/lab"
            className="inline-block mt-8 text-xs text-gray-400 hover:text-[var(--accent)]
                       transition-colors border-b border-transparent hover:border-[var(--accent)]"
          >
            Enter Lab →
          </Link>
        </motion.div>
      </motion.div>

      {/* Footer with version info */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 text-center"
      >
        <div className="text-xs text-gray-400 dark:text-gray-500">
          <span className="font-serif-he">間</span>
          <span className="ml-2">Ma</span>
        </div>
        <div className="text-[10px] text-gray-300 dark:text-gray-600 mt-2">
          v{__BUILD_VERSION__} · {new Date(__BUILD_TIME__).toLocaleString('en-GB', {
            timeZone: 'UTC',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })} UTC
        </div>
      </motion.footer>
    </main>
  );
}
