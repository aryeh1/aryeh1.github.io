import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { projects } from '@/data/projects';

/** Projects page - Efipaz card grid style */
export function Projects() {
  return (
    <main className="min-h-screen">
      {/* Page Header */}
      <section className="py-16 text-center border-b border-[var(--border)] dark:border-[var(--border-dark)]">
        <div className="max-w-[var(--max-width)] mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-light mb-2"
          >
            Projects
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)]"
          >
            A collection of personal projects and experiments
          </motion.p>
        </div>
      </section>

      {/* Project Cards Grid */}
      <section className="py-16">
        <div className="max-w-[var(--max-width)] mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group bg-[var(--bg-card)] dark:bg-[var(--bg-dark-card)]
                           border border-[var(--border)] dark:border-[var(--border-dark)]
                           hover:border-[var(--text-primary)] dark:hover:border-[var(--text-dark)]
                           transition-colors"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-medium group-hover:text-[var(--accent)] dark:group-hover:text-[var(--accent-dark)] transition-colors">
                      {project.title}
                    </h2>
                    <StatusBadge status={project.status} />
                  </div>

                  {project.titleHe && (
                    <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)] font-serif-he mb-2" dir="rtl">
                      {project.titleHe}
                    </p>
                  )}

                  <p className="text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)] text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-[var(--bg-alt)] dark:bg-[var(--bg-dark-alt)]
                                   text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Link */}
                  {project.url && (
                    <Link
                      to={project.url}
                      className="text-sm text-[var(--accent)] dark:text-[var(--accent-dark)]
                                 hover:opacity-70 transition-opacity"
                    >
                      View Project →
                    </Link>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-[var(--border)] dark:border-[var(--border-dark)]">
        <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]">
          More projects coming soon
        </p>
      </footer>
    </main>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    live: 'bg-[var(--accent)]/10 text-[var(--accent)] dark:bg-[var(--accent-dark)]/10 dark:text-[var(--accent-dark)]',
    development: 'bg-[var(--bg-alt)] dark:bg-[var(--bg-dark-alt)] text-[var(--text-secondary)] dark:text-[var(--text-dark-secondary)]',
    archived: 'bg-[var(--bg-alt)] dark:bg-[var(--bg-dark-alt)] text-[var(--text-muted)] dark:text-[var(--text-dark-muted)]',
  };

  return (
    <span className={`text-xs px-2 py-1 ${styles[status as keyof typeof styles] || styles.archived}`}>
      {status}
    </span>
  );
}
