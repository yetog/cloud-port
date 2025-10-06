
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
  // FEATURED APPS (First 5 - shown on main portfolio page)
  {
    id: 'sensei-ai',
    title: '🥋 Sensei AI',
    description: 'Your GPT Trainer - Sensei AI helps you train GPT agents using your sources. Import JSON, TXT, MD, CSV and chat with citations for enhanced AI interactions.',
    image: ASSETS.apps.zenReset, // Temporary - you can add a proper image later
    tags: ['AI', 'Training', 'GPT', 'Citations'],
    appUrl: 'https://sensei.zaylegend.com/',
    githubUrl: 'https://github.com/yetog/sensei-ai',
  },
  {
    id: 'zen-reset-meditation',
    title: '🧘 Zen Reset',
    description: 'A minimalist meditation web app designed to create calming experiences through guided audio. Built with Docker, optimized for fast loading, portable deployment, and always-on availability via Linux VM.',
    image: ASSETS.apps.zenReset,
    tags: ['Meditation', 'Audio', 'Docker'],
    appUrl: 'https://zaylegend.com/zen-reset',
    githubUrl: 'https://github.com/zaylegend/zen-reset',
  },
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
    id: 'wolf-ai-assistant',
    title: '🐺 Wolf AI Assistant', 
    description: 'Advanced AI assistant with TTS and MCP integration, featuring sophisticated conversational capabilities and voice interaction.',
    image: ASSETS.apps.wolfAiAssistant,
    tags: ['AI', 'Assistant', 'TTS'],
    appUrl: 'https://huggingface.co/spaces/Agents-MCP-Hackathon/Wolf-AI-yetog',
    githubUrl: 'https://github.com/yetog/wolf-ai-assistant',
  },
  {
    id: 'voice-assistant',
    title: '🎙️ Voice Assistant',
    description: 'Advanced conversational AI with real-time voice interaction powered by ElevenLabs and IONOS AI. Features voice-to-voice communication, WebSocket streaming, and intelligent coaching evaluations.',
    image: ASSETS.apps.zenReset, // Temporary - you can add a proper image later
    tags: ['AI', 'Voice', 'Real-time', 'ElevenLabs'],
    appUrl: 'https://zaylegend.com/voice-assistant',
    githubUrl: 'https://github.com/yetog/voice-agent-11',
  },
  
  // OTHER APPS
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
    id: 'knowledge-base',
    title: '📚 Knowledge Base',
    description: 'A comprehensive personal knowledge repository covering technology, business, philosophy, and life insights. Organized collection of research, notes, and learnings across diverse topics.',
    image: ASSETS.apps.zenReset, // Temporary - you can add a proper image later
    tags: ['Knowledge', 'Documentation', 'Reference'],
    appUrl: 'https://zaylegend.com/knowledge-base',
    githubUrl: 'https://github.com/yetog/knowledge-base',
  }
];
