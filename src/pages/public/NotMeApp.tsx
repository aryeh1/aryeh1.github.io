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
          <p className="text-xl text-gray-400 font-serif-he" dir="rtl">לא אני</p>
        </div>

        {/* Description */}
        <div className="space-y-4 text-gray-600">
          <p>
            A mobile application exploring identity, perception, and self-reflection.
          </p>
          <p>
            Coming soon to Google Play.
          </p>
        </div>

        {/* Placeholder for app screenshots/demo */}
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-sm">
            App preview coming soon
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          <span className="text-gray-500">In Development</span>
        </div>
      </motion.div>
    </main>
  );
}
