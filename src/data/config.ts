import type { SiteConfig } from '@/types';

export const siteConfig: SiteConfig = {
  name: 'Aryeh Lopian',
  title: 'Software Engineer',
  description: 'Personal website of Aryeh Lopian',
  social: {
    linkedin: 'https://www.linkedin.com/in/aryeh1',
    github: 'https://github.com/aryeh1',
    email: 'aryeh.lopian.07@gmail.com',
  },
  features: {
    darkMode: true,
    passwordProtection: true,
    analytics: false, // Enable when ready
  },
};

/** Password hash for protected sections (SHA-256) */
export const PROTECTED_HASH = 'b370edd9c33ddc1ae8117a1478816414bbdb9092022b23b82e890f297797713a';
