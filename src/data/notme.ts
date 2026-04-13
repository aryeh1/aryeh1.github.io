import type { NotMeConfig } from '@/types';

export const notmeConfig: NotMeConfig = {
  name: 'NotMe',
  tagline: 'A privacy-focused notification logger for Android',
  version: '1.0',
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.app.notme',
  githubUrl: 'https://github.com/aryeh1/NotMe',
  features: [
    {
      icon: '◉',
      title: 'Smart Feed',
      description: 'Notifications grouped by app with time filters',
    },
    {
      icon: '◫',
      title: 'Dashboard',
      description: 'Analytics on your notification patterns',
    },
    {
      icon: '⊘',
      title: 'Research',
      description: 'Search and filter your entire history',
    },
    {
      icon: '⊡',
      title: 'Privacy First',
      description: 'Zero internet permissions, all data on device',
    },
  ],
  privacy: [
    'No internet access — zero network permissions',
    'No tracking, analytics, or ads',
    'All data stored locally in SQLite',
    'Uninstalling deletes everything',
  ],
  tech: 'Java · Android SDK 36 · Room · Material Design',
};
