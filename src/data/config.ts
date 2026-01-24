import type { SiteConfig } from '@/types';

export const siteConfig: SiteConfig = {
  name: 'Aryeh Lopian',
  title: 'Software Engineer',
  description: 'Personal website of Aryeh Lopian',
  social: {
    linkedin: 'https://www.linkedin.com/in/aryeh-lopian/',
    github: 'https://github.com/aryeh1',
    email: 'mailto:contact@example.com', // Update with real email
  },
  features: {
    darkMode: true,
    passwordProtection: true,
    analytics: false, // Enable when ready
  },
};

/** Password hash for protected sections (SHA-256) */
// To generate: echo -n "your-password" | sha256sum
export const PROTECTED_HASH = 'placeholder-hash-update-before-deploy';
