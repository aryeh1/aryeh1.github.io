import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PROTECTED_HASH } from '@/data/config';

/** Private dashboard - only visible after authentication */
export function Dashboard() {
  const { logout } = useAuth(PROTECTED_HASH);

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <Link to="/" className="text-sm text-gray-400 hover:text-[var(--accent)]">
              ← Home
            </Link>
            <h1 className="text-3xl font-light mt-4">Private Dashboard</h1>
          </div>
          <button
            onClick={logout}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            Logout
          </button>
        </header>

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <ActionCard
              title="Lab"
              description="Experimental features"
              href="/lab"
            />
            <ActionCard
              title="Archive"
              description="Old projects"
              href="/archive"
              external
            />
            <ActionCard
              title="Docs"
              description="Agent guide"
              href="https://github.com/aryeh1/aryeh1.github.io"
              external
            />
          </div>
        </section>

        {/* Status */}
        <section>
          <h2 className="text-lg font-medium mb-4">Site Status</h2>
          <div className="border border-gray-100 dark:border-gray-700 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Environment</span>
              <span>GitHub Pages</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Build</span>
              <span className="text-green-600">Passing</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Last Update</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </section>
      </motion.div>
    </main>
  );
}

interface ActionCardProps {
  title: string;
  description: string;
  href: string;
  external?: boolean;
}

function ActionCard({ title, description, href, external }: ActionCardProps) {
  const cardClasses = "block border border-gray-100 dark:border-gray-700 p-4 rounded-lg hover:border-[var(--accent)] transition-colors";

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClasses}
      >
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </a>
    );
  }

  return (
    <Link to={href} className={cardClasses}>
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </Link>
  );
}
