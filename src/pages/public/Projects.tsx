import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { projects } from '@/data/projects';

/** Projects showcase page */
export function Projects() {
  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Page Title */}
        <header className="mb-12">
          <h1 className="text-3xl font-light">Projects</h1>
          <p className="text-[var(--text-light)] dark:text-[var(--text-dark-light)] mt-2">
            A collection of personal projects and experiments
          </p>
        </header>

        {/* Project Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-[var(--border)] dark:border-[var(--border-dark)] p-6 rounded-lg
                         hover:border-[var(--accent)] transition-colors
                         bg-[var(--bg-primary)] dark:bg-[var(--bg-dark-alt)]"
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-medium">{project.title}</h2>
                <StatusBadge status={project.status} />
              </div>

              {project.titleHe && (
                <p className="text-sm text-[var(--text-light)] dark:text-[var(--text-dark-light)] font-serif-he mb-2" dir="rtl">
                  {project.titleHe}
                </p>
              )}

              <p className="text-[var(--text-light)] dark:text-[var(--text-dark-light)] text-sm mb-4">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-[var(--bg-alt)] dark:bg-[var(--bg-dark)] rounded
                               text-[var(--text-light)] dark:text-[var(--text-dark-light)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {project.url && (
                <Link
                  to={project.url}
                  className="block mt-4 text-sm text-[var(--accent)] border-none hover:opacity-80"
                >
                  View →
                </Link>
              )}
            </motion.article>
          ))}
        </div>
      </motion.div>
    </main>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    live: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    development: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    archived: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400',
  };

  return (
    <span className={`text-xs px-2 py-1 rounded ${colors[status as keyof typeof colors] || colors.archived}`}>
      {status}
    </span>
  );
}
