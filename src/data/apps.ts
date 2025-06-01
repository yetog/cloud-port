
export interface App {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  appUrl?: string;
  storeUrl?: string;
  githubUrl?: string;
}

export const apps: App[] = [
  {
    id: 'questful-living-adventure',
    title: 'Questful Living Adventure',
    description: 'An RPG-style task organizer that gamifies your daily productivity and goals.',
    image: '/placeholder.svg',
    tags: ['Web App', 'RPG', 'Productivity'],
    appUrl: '/questful-living-adventure/',
    githubUrl: 'https://github.com/yetog/questful-living-adventure',
  },
  {
    id: 'media-magic-streamer',
    title: 'Media Magic Streamer',
    description: 'A powerful media streaming platform for organizing and playing your content.',
    image: '/placeholder.svg',
    tags: ['Web App', 'Media', 'Streaming'],
    appUrl: '/media-magic-streamer/',
    githubUrl: 'https://github.com/yetog/media-magic-streamer',
  },
  {
    id: 'script-scribe-ai-editor',
    title: 'Script Scribe AI Editor',
    description: 'An intelligent script editor inspired by Wolf of NY aesthetics with AI-powered features.',
    image: '/placeholder.svg',
    tags: ['Web App', 'AI', 'Editor'],
    appUrl: '/script-scribe-ai-editor/',
    githubUrl: 'https://github.com/yetog/script-scribe-ai-editor',
  },
  {
    id: 'playful-space-arcade',
    title: 'Playful Space Arcade',
    description: 'A fast-paced, arcade-style space shooter to test your reflexes and score high!',
    image: '/placeholder.svg',
    tags: ['Game', 'Arcade', 'Vite'],
    appUrl: '/playful-space-arcade/',
    githubUrl: 'https://github.com/yetog/playful-space-arcade',
  },
  {
    id: 'pdf-saga-summarize',
    title: 'PDF Saga Summarize',
    description: 'A document summary tool designed for better retention and understanding of PDFs.',
    image: '/placeholder.svg',
    tags: ['Web App', 'AI', 'Documents'],
    appUrl: '/pdf-saga-summarize/',
    githubUrl: 'https://github.com/yetog/pdf-saga-summarize',
  },
  {
    id: 'serene-chord-scapes',
    title: 'Serene Chord Scapes',
    description: 'A minimalist meditation app with customizable ambient sounds and interval timers.',
    image: '/placeholder.svg',
    tags: ['Web App', 'PWA', 'Meditation'],
    appUrl: '/serene-chord-scapes/',
    githubUrl: 'https://github.com/yetog/serene-chord-scapes',
  }
];
