
export interface App {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  appUrl?: string;
  storeUrl?: string;
}

export const apps: App[] = [
  {
    id: 'meditation-timer',
    title: 'Meditation Timer',
    description: 'A minimalist meditation app with customizable ambient sounds and interval timers.',
    image: '/placeholder.svg',
    tags: ['Web App', 'PWA', 'React'],
    appUrl: '#',
  },
  {
    id: 'chess-hub',
    title: 'Chess Hub',
    description: 'Interactive chess learning platform with AI-powered analysis and personalized training.',
    image: '/placeholder.svg',
    tags: ['Web App', 'AI', 'Node.js'],
    appUrl: '#',
  },
  {
    id: 'tts-tool',
    title: 'Text-to-Speech Tool',
    description: 'Convert articles and documents to natural-sounding audio with multiple voice options.',
    image: '/placeholder.svg',
    tags: ['Utility', 'AI', 'Cloud API'],
    appUrl: '#',
  },
  {
    id: 'cloud-dashboard',
    title: 'Cloud Resource Dashboard',
    description: 'A unified dashboard to monitor and manage resources across multiple cloud providers.',
    image: '/placeholder.svg',
    tags: ['DevOps', 'Monitoring', 'React'],
    appUrl: '#',
  }
];
