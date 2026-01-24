import type { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'not-me',
    title: 'Not Me',
    titleHe: 'לא אני',
    description: 'Mobile application - Coming soon to Google Play',
    tags: ['Mobile', 'Android', 'Coming Soon'],
    url: '/app/not-me',
    featured: true,
    status: 'development',
  },
  {
    id: 'tanakh',
    title: 'Tanakh Reader',
    titleHe: 'תנ"ך',
    description: 'Interactive Hebrew Bible reader with commentary',
    tags: ['React', 'TypeScript', 'Hebrew'],
    url: '/archive/tanakh-deploy/index.html',
    featured: true,
    status: 'live',
  },
  {
    id: 'kamea',
    title: 'Kamea Generator',
    titleHe: 'קמע',
    description: 'Generative art based on Hebrew text',
    tags: ['SVG', 'Canvas', 'Generative'],
    url: '/lab',
    featured: true,
    status: 'live',
  },
];
