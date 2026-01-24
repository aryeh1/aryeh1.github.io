import { motion } from 'framer-motion';
import { siteConfig } from '@/data/config';

/** Minimalist landing page - Japanese-inspired */
export function Landing() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center space-y-6"
      >
        {/* Name */}
        <h1 className="text-4xl md:text-5xl font-light tracking-wide">
          {siteConfig.name}
        </h1>

        {/* Title */}
        <p className="text-lg text-gray-500 font-light">
          {siteConfig.title}
        </p>

        {/* Divider - Japanese-inspired */}
        <div className="flex justify-center py-4">
          <div className="w-12 h-px bg-[var(--accent)]" />
        </div>

        {/* Social Links */}
        <nav className="flex justify-center gap-8 text-sm">
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
              href={siteConfig.social.email}
              className="hover:text-[var(--accent)] transition-colors"
            >
              Email
            </a>
          )}
        </nav>
      </motion.div>

      {/* Subtle footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 text-xs text-gray-400"
      >
        間 Ma
      </motion.footer>
    </main>
  );
}
