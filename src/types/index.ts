/** Project data for showcase */
export interface Project {
  id: string;
  title: string;
  titleHe?: string;
  description: string;
  tags: string[];
  url?: string;
  github?: string;
  featured: boolean;
  status: 'live' | 'development' | 'archived';
}

/** User authentication state */
export interface AuthState {
  isAuthenticated: boolean;
  timestamp?: number;
}

/** Site configuration */
export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  social: {
    linkedin?: string;
    github?: string;
    email?: string;
  };
  features: {
    darkMode: boolean;
    passwordProtection: boolean;
    analytics: boolean;
  };
}
