import type { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'not-me',
    title: 'Not Me',
    titleHe: 'לא אני',
    description: 'Mobile application - Coming soon to Google Play',
    tags: ['Mobile', 'Android', 'Coming Soon'],
    featured: true,
    status: 'development',
  },
  {
    id: 'tanakh',
    title: 'Tanakh Reader',
    titleHe: 'תנ"ך',
    description: 'Interactive Hebrew Bible reader with commentary',
    tags: ['React', 'TypeScript', 'Hebrew'],
    url: '/projects/tanakh',
    featured: true,
    status: 'live',
  },
  {
    id: 'kamea',
    title: 'Kamea Generator',
    titleHe: 'קמע',
    description: 'Generative art based on Hebrew text',
    tags: ['SVG', 'Canvas', 'Generative'],
    url: '/projects/kamea',
    featured: true,
    status: 'live',
  },
];
