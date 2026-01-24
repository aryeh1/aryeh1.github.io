import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion';
import { useRef, useEffect, useState, type ReactNode } from 'react';

// ============================================================================
// Custom Hooks
// ============================================================================

/** Animated counter hook with spring physics */
function useAnimatedCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, target, duration]);

  return { count, ref };
}

/** Hook for scroll-triggered reveal animations */
function useScrollReveal(threshold: number = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  return { ref, isInView };
}

// ============================================================================
// Sub-Components
// ============================================================================

/** Animated section wrapper with scroll reveal */
function RevealSection({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isInView } = useScrollReveal();

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/** Stat card with animated counter */
function StatCard({
  value,
  label,
  suffix = '',
  delay = 0,
}: {
  value: number;
  label: string;
  suffix?: string;
  delay?: number;
}) {
  const { count, ref } = useAnimatedCounter(value);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="text-center p-6"
    >
      <div className="text-4xl font-light text-[var(--accent)] mb-2">
        {count}
        {suffix}
      </div>
      <div className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)]">
        {label}
      </div>
    </motion.div>
  );
}

/** Feature card with icon and hover effect */
function FeatureCard({
  icon,
  title,
  description,
  index,
}: {
  icon: string;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="p-6 rounded-xl bg-[var(--bg-card)] dark:bg-[var(--bg-dark-card)]
                 border border-[var(--border)] dark:border-[var(--border-dark)]
                 hover:border-[var(--accent)] transition-colors"
    >
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)] leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

/** Phone mockup component */
function PhoneMockup({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-64 h-[520px]">
      {/* Phone frame */}
      <div
        className="absolute inset-0 rounded-[3rem] border-[8px]
                      border-[var(--text-primary)] dark:border-[var(--text-dark)]
                      bg-[var(--bg-dark)] dark:bg-[var(--bg-primary)]
                      shadow-2xl overflow-hidden"
      >
        {/* Notch */}
        <div
          className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6
                        bg-[var(--text-primary)] dark:bg-[var(--text-dark)] rounded-full"
        />
        {/* Screen content */}
        <div className="absolute inset-4 top-10 rounded-[2rem] overflow-hidden bg-[var(--bg-dark-alt)]">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Mock app screen for phone */
function MockAppScreen() {
  const notifications = [
    { app: 'WhatsApp', title: 'Mom', text: 'Call me when you can', time: '2m' },
    { app: 'Gmail', title: 'GitHub', text: 'New pull request merged', time: '15m' },
    { app: 'Slack', title: '#general', text: 'Meeting in 10 minutes', time: '1h' },
  ];

  return (
    <div className="h-full p-4 text-[var(--text-dark)]">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-2xl font-light">NotMe</div>
        <div className="text-xs opacity-60 mt-1">12 notifications today</div>
      </div>

      {/* Notification list */}
      <div className="space-y-3">
        {notifications.map((n, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + i * 0.2 }}
            className="bg-[var(--bg-dark-card)] rounded-lg p-3"
          >
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-medium opacity-80">{n.app}</span>
              <span className="text-[10px] opacity-50">{n.time}</span>
            </div>
            <div className="text-sm font-medium">{n.title}</div>
            <div className="text-xs opacity-70 truncate">{n.text}</div>
          </motion.div>
        ))}
      </div>

      {/* Bottom nav hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-8 opacity-40">
        <div className="w-6 h-6 rounded-full border border-current" />
        <div className="w-6 h-6 rounded-sm border border-current" />
        <div className="w-6 h-6 rounded-full border border-current" />
      </div>
    </div>
  );
}

/** Privacy principle card */
function PrivacyPrinciple({
  icon,
  text,
  index,
}: {
  icon: string;
  text: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="flex items-center gap-4 py-3"
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)]">
        {text}
      </span>
    </motion.div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

/** Not Me App showcase page - Advanced React patterns demo */
export function NotMeApp() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Smooth spring for progress indicator
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  const features = [
    {
      icon: '📚',
      title: 'Notification History',
      description:
        'Permanent, searchable archive with smart deduplication. Never lose an important notification again.',
    },
    {
      icon: '📊',
      title: 'Dashboard Analytics',
      description:
        'Understand your notification patterns. See which apps demand your attention most.',
    },
    {
      icon: '🔬',
      title: 'Research Tool',
      description:
        'Advanced search with filters by app, date, and keywords. Export to CSV for analysis.',
    },
    {
      icon: '🛡️',
      title: 'Intervention Lab',
      description:
        'Rule-based blocking with regex support. Take control of notification overload.',
    },
    {
      icon: '🎯',
      title: 'Focus UI',
      description:
        'Clean, grouped feed organized by app. Expand to see details, collapse to scan quickly.',
    },
    {
      icon: '🔒',
      title: 'Complete Privacy',
      description:
        'Zero internet access. No analytics. No tracking. Your data never leaves your device.',
    },
  ];

  const privacyPrinciples = [
    { icon: '🚫', text: 'No internet permissions - completely offline' },
    { icon: '📵', text: 'No analytics, tracking, or telemetry' },
    { icon: '🚷', text: 'No advertising or third-party SDKs' },
    { icon: '☁️', text: 'No cloud sync - data stays on device' },
    { icon: '🗑️', text: 'Uninstall deletes everything permanently' },
  ];

  return (
    <div ref={containerRef} className="relative">
      {/* Progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-[var(--accent)] origin-left z-50"
        style={{ scaleX: smoothProgress }}
      />

      {/* Hero Section */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="min-h-[80vh] flex flex-col items-center justify-center px-8 relative"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center"
        >
          {/* App icon */}
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-7xl mb-8"
          >
            🔔
          </motion.div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-4">
            NotMe
          </h1>

          {/* Hebrew subtitle */}
          <p
            className="text-2xl text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)] font-serif-he mb-6"
            dir="rtl"
          >
            לא אני
          </p>

          {/* Tagline */}
          <p className="text-lg text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)] max-w-md mx-auto">
            Your notifications. Your data. Your device.
            <br />
            <span className="text-[var(--accent)]">Nothing leaves.</span>
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-[var(--text-muted)] dark:text-[var(--text-dark-muted)] text-sm"
          >
            Scroll to explore
          </motion.div>
        </motion.div>
      </motion.section>

      {/* What is NotMe */}
      <RevealSection className="py-24 px-8 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-light mb-8">What is NotMe?</h2>
        <p className="text-lg text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)] leading-relaxed mb-6">
          NotMe is a <strong className="text-[var(--text-primary)] dark:text-[var(--text-dark)]">privacy-focused notification logger</strong> for
          Android. It captures every notification your device receives and stores
          them locally in a searchable database.
        </p>
        <p className="text-lg text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)] leading-relaxed">
          Unlike cloud-based solutions, NotMe has{' '}
          <strong className="text-[var(--text-primary)] dark:text-[var(--text-dark)]">zero internet access</strong>. Your
          notification history—messages, alerts, app activity—stays entirely on
          your device.
        </p>
      </RevealSection>

      {/* Phone Mockup Section */}
      <RevealSection className="py-24 px-8 bg-[var(--bg-alt)] dark:bg-[var(--bg-dark-alt)]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-3xl font-light mb-6">Clean, Focused Interface</h2>
            <p className="text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)] leading-relaxed mb-4">
              Notifications are grouped by app for easy scanning. Expand any app to
              see full details, or keep it collapsed for a quick overview.
            </p>
            <p className="text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)] leading-relaxed">
              Smart deduplication means repeated notifications are counted, not
              duplicated. Your history stays clean and meaningful.
            </p>
          </div>
          <div className="flex-1">
            <PhoneMockup>
              <MockAppScreen />
            </PhoneMockup>
          </div>
        </div>
      </RevealSection>

      {/* Stats Section */}
      <RevealSection className="py-24 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-light text-center mb-16">By the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard value={0} label="Internet Permissions" delay={0} />
            <StatCard value={0} label="Third-party SDKs" delay={0.1} />
            <StatCard value={100} suffix="%" label="Local Storage" delay={0.2} />
            <StatCard value={0} label="Data Shared" delay={0.3} />
          </div>
        </div>
      </RevealSection>

      {/* Features Grid */}
      <RevealSection className="py-24 px-8 bg-[var(--bg-alt)] dark:bg-[var(--bg-dark-alt)]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-light text-center mb-16">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} index={index} />
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Privacy Section */}
      <RevealSection className="py-24 px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-light text-center mb-4">Privacy First</h2>
          <p className="text-center text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)] mb-12">
            NotMe was built with a simple philosophy: your data is yours alone.
          </p>
          <div className="space-y-2">
            {privacyPrinciples.map((principle, index) => (
              <PrivacyPrinciple key={index} {...principle} index={index} />
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Technical Details */}
      <RevealSection className="py-24 px-8 bg-[var(--bg-alt)] dark:bg-[var(--bg-dark-alt)]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-light text-center mb-12">Under the Hood</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <span className="text-[var(--accent)]">01</span> Requirements
              </h3>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)]">
                <li>• Android 15+ (API 35)</li>
                <li>• Notification Access permission</li>
                <li>• ~5 MB storage</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <span className="text-[var(--accent)]">02</span> Technology
              </h3>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)]">
                <li>• Native Android (Java)</li>
                <li>• Room (SQLite) database</li>
                <li>• Material Design 3</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <span className="text-[var(--accent)]">03</span> Data Storage
              </h3>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)]">
                <li>• Local SQLite database</li>
                <li>• CSV export capability</li>
                <li>• Automatic cleanup tools</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <span className="text-[var(--accent)]">04</span> Intelligence
              </h3>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)]">
                <li>• Smart notification grouping</li>
                <li>• Dismissal reason tracking</li>
                <li>• System noise filtering</li>
              </ul>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* CTA Section */}
      <RevealSection className="py-32 px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-5xl mb-8">🎭</div>
          <h2 className="text-3xl font-light mb-4">Coming Soon</h2>
          <p className="text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)] mb-8 max-w-md mx-auto">
            NotMe is currently in private beta. Stay tuned for the public release
            on Google Play.
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
            <span className="text-sm text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
              In Development
            </span>
          </div>
        </motion.div>
      </RevealSection>

      {/* Footer */}
      <footer className="py-12 px-8 text-center border-t border-[var(--border)] dark:border-[var(--border-dark)]">
        <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
          Built by Aryeh Lopian
        </p>
      </footer>
    </div>
  );
}
