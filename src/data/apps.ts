
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
    id: 'chord-genesis',
    title: '🎵 Chord Genesis',
    description: 'An intelligent music composition tool that generates chord progressions and harmonies. Perfect for musicians, producers, and songwriters looking to explore new musical ideas and accelerate their creative process.',
    image: ASSETS.apps.chordGenesis,
    tags: ['Music', 'AI', 'Composition'],
    appUrl: 'https://zaylegend.com/chord-genesis',
    githubUrl: 'https://github.com/yetog/chord-genesis',
  },
  {
    id: 'cloud-llm-assistant',
    title: '🤖 Cloud LLM Assistant',
    description: 'An intelligent AI assistant powered by advanced language models, hosted on cloud infrastructure for scalable conversational AI experiences.',
    image: ASSETS.apps.cloudLlmAssistant,
    tags: ['AI', 'Cloud', 'Assistant'],
    appUrl: 'https://ashley-v3.streamlit.app/',
    githubUrl: 'https://github.com/zaylegend/ashley-v3',
  },
  {
    id: 'dj-visualizer',
    title: '🎧 DJ Visualizer',
    description: 'An immersive audio-reactive visualization platform for DJs and music enthusiasts. Features real-time audio analysis, dynamic visual effects, and customizable display modes for live performances.',
    image: ASSETS.apps.djVisualizer,
    tags: ['Audio', 'Visualization', 'DJ Tools'],
    appUrl: 'https://zaylegend.com/dj-visualizer',
    githubUrl: 'https://github.com/yetog/apr',
  },
  {
    id: 'fineline',
    title: '📝 FineLine',
    description: 'A timeline-based journal application for tracking life events, goals, and memories. Organize your thoughts chronologically with an intuitive interface designed for reflection and personal growth.',
    image: ASSETS.apps.fineLine,
    tags: ['Productivity', 'Journal', 'Timeline'],
    appUrl: 'https://zaylegend.com/fineline',
    githubUrl: 'https://github.com/yetog/fineline',
  },
  {
    id: 'game-hub',
    title: '🎮 Game Hub',
    description: 'A playful space arcade featuring multiple mini-games and interactive experiences. Built as a gaming platform with various arcade-style games, leaderboards, and engaging user experiences.',
    image: ASSETS.apps.gameHub,
    tags: ['Gaming', 'Arcade', 'Entertainment'],
    appUrl: 'https://zaylegend.com/game-hub',
    githubUrl: 'https://github.com/yetog/playful-space-arcade',
  },
  {
    id: 'sprite-gen',
    title: '🎨 Sprite Gen',
    description: 'A powerful sprite generation tool for game developers and digital artists. Create pixel-perfect sprites, animations, and game assets with advanced algorithms and customizable parameters.',
    image: ASSETS.apps.spriteGen,
    tags: ['Game Dev', 'Graphics', 'Tools'],
    appUrl: 'https://zaylegend.com/spritegen',
    githubUrl: 'https://github.com/yetog/spritegen',
  },
  {
    id: 'wolf-ai-assistant',
    title: '🐺 Wolf AI Assistant', 
    description: 'Advanced AI assistant with TTS and MCP integration, featuring sophisticated conversational capabilities and voice interaction.',
    image: ASSETS.apps.wolfAiAssistant,
    tags: ['AI', 'Assistant', 'TTS'],
    appUrl: 'https://huggingface.co/spaces/Agents-MCP-Hackathon/Wolf-AI-yetog',
    githubUrl: 'https://github.com/yetog/wolf-ai-assistant',
  },
  {
    id: 'zen-reset-meditation',
    title: '🧘 Zen Reset',
    description: 'A minimalist meditation web app designed to create calming experiences through guided audio. Built with Docker, optimized for fast loading, portable deployment, and always-on availability via Linux VM.',
    image: ASSETS.apps.zenReset,
    tags: ['Meditation', 'Audio', 'Docker'],
    appUrl: 'https://zaylegend.com/zen-reset',
    githubUrl: 'https://github.com/zaylegend/zen-reset',
  }
];
