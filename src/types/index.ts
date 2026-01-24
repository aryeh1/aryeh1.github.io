/** Site configuration */
export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  labUrl: string;
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
