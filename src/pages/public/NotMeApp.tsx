import { motion } from 'framer-motion';

/** Not Me App showcase page */
export function NotMeApp() {
  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >

        {/* App Info */}
        <div className="text-center py-12">
          <div className="text-6xl mb-6">🎭</div>
          <h1 className="text-4xl font-light mb-2">Not Me</h1>
          <p className="text-xl text-[var(--text-light)] dark:text-[var(--text-dark-light)] font-serif-he" dir="rtl">
            לא אני
          </p>
        </div>

        {/* Description */}
        <div className="space-y-4 text-[var(--text-light)] dark:text-[var(--text-dark-light)]">
          <p>
            A mobile application exploring identity, perception, and self-reflection.
          </p>
          <p>
            Coming soon to Google Play.
          </p>
        </div>

        {/* Placeholder for app screenshots/demo */}
        <div className="border-2 border-dashed border-[var(--border)] dark:border-[var(--border-dark)]
                        rounded-xl p-12 text-center">
          <p className="text-[var(--text-light)] dark:text-[var(--text-dark-light)] text-sm">
            App preview coming soon
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="w-2 h-2 bg-yellow-400 dark:bg-yellow-500 rounded-full animate-pulse" />
          <span className="text-[var(--text-light)] dark:text-[var(--text-dark-light)]">In Development</span>
        </div>
      </motion.div>
    </main>
  );
}
