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
    analytics: boolean;
  };
}

/** NotMe app showcase */
export interface NotMeFeature {
  icon: string;
  title: string;
  description: string;
}

export interface NotMeConfig {
  name: string;
  tagline: string;
  version: string;
  playStoreUrl: string;
  features: NotMeFeature[];
  privacy: string[];
  tech: string;
}
