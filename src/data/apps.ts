
import { ASSETS } from '../config/assets';

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
    id: 'cloud-llm-assistant',
    title: '🤖 Cloud LLM Assistant',
    description: 'An intelligent AI assistant powered by advanced language models, hosted on cloud infrastructure for scalable conversational AI experiences.',
    image: ASSETS.apps.cloudLlmAssistant,
    tags: ['Web App', 'AI', 'Cloud', 'LLM'],
    appUrl: 'https://ashley-v3.streamlit.app/',
  },
  {
    id: 'wolf-ai-assistant',
    title: '🐺 Wolf AI Assistant', 
    description: 'Advanced AI assistant with TTS and MCP integration, featuring sophisticated conversational capabilities and voice interaction.',
    image: ASSETS.apps.wolfAiAssistant,
    tags: ['AI Assistant', 'TTS', 'MCP', 'HuggingFace'],
    appUrl: 'https://huggingface.co/spaces/Agents-MCP-Hackathon/Wolf-AI-yetog',
  },
  {
    id: 'zen-reset-meditation',
    title: '🧘 Zen Reset - Meditation App',
    description: 'A minimalist meditation web app designed to create calming experiences through guided audio. Built with Docker, optimized for fast loading, portable deployment, and always-on availability via Linux VM.',
    image: ASSETS.apps.zenReset,
    tags: ['React', 'Docker', 'NGINX', 'Ubuntu', 'Meditation', 'Audio'],
    appUrl: 'http://zaylegend.com/zen-reset',
    githubUrl: 'https://github.com/zaylegend/zen-reset',
  },
  {
    id: 'chord-genesis',
    title: '🎵 Chord Genesis',
    description: 'An intelligent music composition tool that generates chord progressions and harmonies. Perfect for musicians, producers, and songwriters looking to explore new musical ideas and accelerate their creative process.',
    image: ASSETS.apps.chordGenesis,
    tags: ['Music', 'AI', 'Composition', 'Creative Tools'],
    githubUrl: 'https://github.com/yetog/chord-genesis',
  },
  {
    id: 'sprite-gen',
    title: '🎨 Sprite Gen',
    description: 'A powerful sprite generation tool for game developers and digital artists. Create pixel-perfect sprites, animations, and game assets with advanced algorithms and customizable parameters.',
    image: ASSETS.apps.spriteGen,
    tags: ['Game Dev', 'Graphics', 'Pixel Art', 'Tools'],
    githubUrl: 'https://github.com/yetog/spritegen',
  },
  {
    id: 'dj-visualizer',
    title: '🎧 DJ Visualizer',
    description: 'An immersive audio-reactive visualization platform for DJs and music enthusiasts. Features real-time audio analysis, dynamic visual effects, and customizable display modes for live performances.',
    image: ASSETS.apps.djVisualizer,
    tags: ['Audio', 'Visualization', 'DJ Tools', 'Real-time'],
    githubUrl: 'https://github.com/yetog/apr',
  },
  {
    id: 'fineline',
    title: '📝 FineLine',
    description: 'A timeline-based journal application for tracking life events, goals, and memories. Organize your thoughts chronologically with an intuitive interface designed for reflection and personal growth.',
    image: ASSETS.apps.fineLine,
    tags: ['Productivity', 'Journal', 'Timeline', 'Personal'],
    githubUrl: 'https://github.com/yetog/fineline',
  },
  {
    id: 'game-hub',
    title: '🎮 Game Hub',
    description: 'A playful space arcade featuring multiple mini-games and interactive experiences. Built as a gaming platform with various arcade-style games, leaderboards, and engaging user experiences.',
    image: ASSETS.apps.gameHub,
    tags: ['Gaming', 'Arcade', 'Entertainment', 'Interactive'],
    githubUrl: 'https://github.com/yetog/playful-space-arcade',
  }
];
