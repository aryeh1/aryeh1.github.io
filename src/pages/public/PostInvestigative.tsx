import { motion } from 'framer-motion';
import { post12 } from '@/data/post12';
import { useDarkMode } from '@/hooks/useDarkMode';

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, ease: 'easeOut' as const },
};

/**
 * Option 2: Investigative / Documentary Style
 * Dark, bold, high-contrast design. Evidence boxes, sidebar callouts,
 * redacted-document aesthetic. Always dark mode for dramatic effect.
 */
export function PostInvestigative() {
  const { toggleTheme } = useDarkMode();

  // This design always uses a dark palette regardless of system theme
  const bg = '#0a0a0a';
  const bgCard = '#141414';
  const bgEvidence = '#1a1510';
  const textPrimary = '#e8e4dc';
  const textSecondary = '#9a9590';
  const accent = '#c4424f';
  const accentGold = '#c9a84c';

  return (
    <article
      dir="rtl"
      lang="he"
      className="min-h-screen"
      style={{ backgroundColor: bg, color: textPrimary }}
    >
      {/* Hidden theme toggle to maintain hook state */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 left-6 z-50 w-10 h-10 rounded-full
                   flex items-center justify-center text-lg opacity-30 hover:opacity-100 transition-opacity"
        style={{ backgroundColor: bgCard, color: textSecondary, border: `1px solid ${textSecondary}33` }}
        aria-label="Toggle theme"
      >
        &#x263D;
      </button>

      {/* Dramatic Hero */}
      <header className="relative min-h-[80vh] flex items-center justify-center px-6 overflow-hidden">
        {/* Background texture overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${textPrimary}08 2px, ${textPrimary}08 3px)`,
          }}
        />

        {/* Top red stripe */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute top-0 right-0 left-0 h-1"
          style={{ backgroundColor: accent }}
        />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Classified badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-10 px-6 py-2 text-xs tracking-[0.3em] font-bold uppercase"
            style={{
              border: `2px solid ${accent}`,
              color: accent,
              letterSpacing: '0.3em',
            }}
          >
            {post12.seriesTitle} // {post12.partNumber}
          </motion.div>

          {/* Title - large, dramatic */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-none mb-8"
            style={{ fontFamily: "'Noto Serif Hebrew', Georgia, serif" }}
          >
            <span style={{ color: accent }}>הסוס</span>
            <br />
            <span>הטרויאני</span>
          </motion.h1>

          {/* Subject name */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-2xl md:text-3xl font-light mb-12"
            style={{ color: textSecondary }}
          >
            ד&quot;ר חיים זיכרמן
          </motion.div>

          {/* Author credit */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-sm tracking-wider"
            style={{ color: textSecondary }}
          >
            חקירה מאת <span style={{ color: accentGold }}>{post12.author}</span>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-6 h-10 rounded-full border-2 flex justify-center pt-2"
              style={{ borderColor: `${textSecondary}66` }}
            >
              <div className="w-1 h-2 rounded-full" style={{ backgroundColor: accent }} />
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pb-24">
        {post12.sections.map((section, i) => (
          <div key={i} className="mb-20">
            {/* Evidence callout box */}
            {section.pullQuote && (
              <motion.div
                {...reveal}
                className="mb-10 p-6 md:p-8 relative overflow-hidden"
                style={{
                  backgroundColor: bgEvidence,
                  borderRight: `3px solid ${accentGold}`,
                }}
              >
                {/* Corner markers */}
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: accentGold }} />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: accentGold }} />

                <div className="text-xs tracking-[0.2em] mb-4 font-bold" style={{ color: accentGold }}>
                  &#x25B6; ממצא מרכזי
                </div>
                <p
                  className="text-xl md:text-2xl font-light leading-relaxed"
                  style={{ color: textPrimary, fontFamily: "'Noto Serif Hebrew', Georgia, serif" }}
                >
                  {section.pullQuote}
                </p>
              </motion.div>
            )}

            {/* Body text */}
            <motion.div {...reveal}>
              {section.content.split('\n\n').map((para, j) => (
                <p
                  key={j}
                  className="text-lg leading-[2] mb-5"
                  style={{ color: `${textPrimary}dd` }}
                >
                  {para}
                </p>
              ))}
            </motion.div>

            {/* Section divider - redacted line style */}
            {i < post12.sections.length - 1 && (
              <motion.div
                {...reveal}
                className="flex items-center gap-4 my-16"
              >
                <div className="flex-1 h-px" style={{ backgroundColor: `${textSecondary}33` }} />
                <div className="text-xs tracking-[0.3em]" style={{ color: accent }}>
                  &#x2588;&#x2588;&#x2588;
                </div>
                <div className="flex-1 h-px" style={{ backgroundColor: `${textSecondary}33` }} />
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer
        className="py-16 px-6 text-center"
        style={{ borderTop: `1px solid ${textSecondary}22` }}
      >
        <div className="max-w-lg mx-auto">
          <div className="text-xs tracking-[0.2em] mb-3" style={{ color: accent }}>
            {post12.seriesTitle}
          </div>
          <div className="text-sm" style={{ color: textSecondary }}>
            {post12.author}
          </div>
        </div>
      </footer>
    </article>
  );
}
