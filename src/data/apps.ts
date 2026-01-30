
import { ASSETS } from '../config/assets';

export type AppStatus = 'finished' | 'testing' | 'upgrading';

export interface App {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  status: AppStatus;
  appUrl?: string;
  storeUrl?: string;
  githubUrl?: string;
}

// =============================================================================
// FINISHED APPS - Production ready, fully functional
// =============================================================================
export const finishedApps: App[] = [
  {
    id: 'sensei-ai',
    title: '🥋 Sensei AI',
    description: 'Your GPT Trainer - Sensei AI helps you train GPT agents using your sources. Import JSON, TXT, MD, CSV and chat with citations for enhanced AI interactions.',
    image: ASSETS.apps.zenReset,
    tags: ['AI', 'Training', 'GPT', 'Citations'],
    status: 'finished',
    appUrl: 'https://sensei.zaylegend.com/',
    githubUrl: 'https://github.com/yetog/sensei-ai',
  },
  {
    id: 'zen-reset-meditation',
    title: '🧘 Zen Reset',
    description: 'A minimalist meditation web app designed to create calming experiences through guided audio. Built with Docker, optimized for fast loading, portable deployment, and always-on availability via Linux VM.',
    image: ASSETS.apps.zenReset,
    tags: ['Meditation', 'Audio', 'Docker'],
    status: 'finished',
    appUrl: 'https://zaylegend.com/zen-reset',
    githubUrl: 'https://github.com/zaylegend/zen-reset',
  },
  {
    id: 'chord-genesis',
    title: '🎵 Chord Genesis',
    description: 'An intelligent music composition tool that generates chord progressions and harmonies. Perfect for musicians, producers, and songwriters looking to explore new musical ideas and accelerate their creative process.',
    image: ASSETS.apps.chordGenesis,
    tags: ['Music', 'AI', 'Composition'],
    status: 'finished',
    appUrl: 'https://zaylegend.com/chord-genesis',
    githubUrl: 'https://github.com/yetog/chord-genesis',
  },
  {
    id: 'wolf-ai-assistant',
    title: '🐺 Wolf AI Assistant',
    description: 'Advanced AI assistant with TTS and MCP integration, featuring sophisticated conversational capabilities and voice interaction.',
    image: ASSETS.apps.wolfAiAssistant,
    tags: ['AI', 'Assistant', 'TTS'],
    status: 'finished',
    appUrl: 'https://huggingface.co/spaces/Agents-MCP-Hackathon/Wolf-AI-yetog',
    githubUrl: 'https://github.com/yetog/wolf-ai-assistant',
  },
  {
    id: 'voice-assistant',
    title: '🎙️ Voice Assistant',
    description: 'Advanced conversational AI with real-time voice interaction powered by ElevenLabs and IONOS AI. Features voice-to-voice communication, WebSocket streaming, and intelligent coaching evaluations.',
    image: ASSETS.apps.zenReset,
    tags: ['AI', 'Voice', 'Real-time', 'ElevenLabs'],
    status: 'finished',
    appUrl: 'https://zaylegend.com/voice-assistant',
    githubUrl: 'https://github.com/yetog/voice-agent-11',
  },
  {
    id: 'contentforge',
    title: '🔥 ContentForge',
    description: 'Unified creative content platform combining AI sprite generation, story creation, voice synthesis, and presentation generation. Go from story concept to complete multimedia presentation seamlessly.',
    image: ASSETS.apps.zenReset,
    tags: ['AI', 'Creative', 'Multimedia', 'Content'],
    status: 'finished',
    appUrl: 'https://zaylegend.com/contentforge',
    githubUrl: 'https://github.com/yetog/contentforge',
  },
  {
    id: 'cloud-llm-assistant',
    title: '🤖 Cloud LLM Assistant',
    description: 'An intelligent AI assistant powered by advanced language models, hosted on cloud infrastructure for scalable conversational AI experiences.',
    image: ASSETS.apps.cloudLlmAssistant,
    tags: ['AI', 'Cloud', 'Assistant'],
    status: 'finished',
    appUrl: 'https://ashley-v3.streamlit.app/',
    githubUrl: 'https://github.com/zaylegend/ashley-v3',
  },
  {
    id: 'dj-visualizer',
    title: '🎧 DJ Visualizer',
    description: 'An immersive audio-reactive visualization platform for DJs and music enthusiasts. Features real-time audio analysis, dynamic visual effects, and customizable display modes for live performances.',
    image: ASSETS.apps.djVisualizer,
    tags: ['Audio', 'Visualization', 'DJ Tools'],
    status: 'finished',
    appUrl: 'https://zaylegend.com/dj-visualizer',
    githubUrl: 'https://github.com/yetog/apr',
  },
  {
    id: 'fineline',
    title: '📝 FineLine',
    description: 'A timeline-based journal application for tracking life events, goals, and memories. Organize your thoughts chronologically with an intuitive interface designed for reflection and personal growth.',
    image: ASSETS.apps.fineLine,
    tags: ['Productivity', 'Journal', 'Timeline'],
    status: 'finished',
    appUrl: 'https://zaylegend.com/fineline',
    githubUrl: 'https://github.com/yetog/fineline',
  },
  {
    id: 'game-hub',
    title: '🎮 Game Hub',
    description: 'A playful space arcade featuring multiple mini-games and interactive experiences. Built as a gaming platform with various arcade-style games, leaderboards, and engaging user experiences.',
    image: ASSETS.apps.gameHub,
    tags: ['Gaming', 'Arcade', 'Entertainment'],
    status: 'finished',
    appUrl: 'https://zaylegend.com/game-hub',
    githubUrl: 'https://github.com/yetog/playful-space-arcade',
  },
  {
    id: 'sprite-gen',
    title: '🎨 Sprite Gen',
    description: 'A powerful sprite generation tool for game developers and digital artists. Create pixel-perfect sprites, animations, and game assets with advanced algorithms and customizable parameters.',
    image: ASSETS.apps.spriteGen,
    tags: ['Game Dev', 'Graphics', 'Tools'],
    status: 'finished',
    appUrl: 'https://zaylegend.com/spritegen',
    githubUrl: 'https://github.com/yetog/spritegen',
  },
  {
    id: 'knowledge-base',
    title: '📚 Knowledge Base',
    description: 'A comprehensive personal knowledge repository covering technology, business, philosophy, and life insights. Organized collection of research, notes, and learnings across diverse topics.',
    image: ASSETS.apps.zenReset,
    tags: ['Knowledge', 'Documentation', 'Reference'],
    status: 'finished',
    appUrl: 'https://zaylegend.com/knowledge-base',
    githubUrl: 'https://github.com/yetog/knowledge-base',
  }
];

// =============================================================================
// TESTING APPS - Beta/experimental, work in progress
// =============================================================================
export const testingApps: App[] = [
  {
    id: 'darkflow-mind-mapper',
    title: '🧠 Darkflow Mind Mapper',
    description: 'Visual mind mapping tool for organizing thoughts, ideas, and projects with an intuitive dark-themed interface.',
    image: ASSETS.apps.zenReset,
    tags: ['Productivity', 'Mind Map', 'Organization'],
    status: 'testing',
    githubUrl: 'https://github.com/yetog/darkflow-mind-mapper',
  },
  {
    id: 'bh-ai-79',
    title: '🤖 BH AI 79',
    description: 'AI-powered application exploring advanced language model capabilities and experimental features.',
    image: ASSETS.apps.zenReset,
    tags: ['AI', 'Experimental'],
    status: 'testing',
    githubUrl: 'https://github.com/Akasuki-de/bh-ai-79',
  },
  {
    id: 'gmat-mastery-suite',
    title: '📊 GMAT Mastery Suite',
    description: 'Comprehensive test preparation platform for GMAT with practice questions, analytics, and personalized study plans.',
    image: ASSETS.apps.zenReset,
    tags: ['Education', 'Test Prep', 'Analytics'],
    status: 'testing',
    githubUrl: 'https://github.com/yetog/gmat-mastery-suite',
  },
  {
    id: 'losk',
    title: '📖 Losk - Light Novel Hub',
    description: 'A platform for reading and discovering light novels with a clean, reader-friendly interface.',
    image: ASSETS.apps.zenReset,
    tags: ['Reading', 'Entertainment', 'Literature'],
    status: 'testing',
    githubUrl: 'https://github.com/yetog/losk',
  },
  {
    id: 'purple-lotus',
    title: '♈ Purple Lotus',
    description: 'Zodiac-themed social media platform connecting users through astrology, horoscopes, and celestial insights.',
    image: ASSETS.apps.zenReset,
    tags: ['Social', 'Astrology', 'Community'],
    status: 'testing',
    githubUrl: 'https://github.com/yetog/purple-lotus',
  },
  {
    id: 'got-hired-ai',
    title: '📄 Got Hired AI',
    description: 'AI-powered resume and cover letter builder that helps job seekers create compelling applications tailored to specific roles.',
    image: ASSETS.apps.zenReset,
    tags: ['AI', 'Career', 'Resume Builder'],
    status: 'testing',
    githubUrl: 'https://github.com/yetog/got-hired-ai',
  },
  {
    id: 'zen-tot',
    title: '🧘 Zen ToT',
    description: 'Experimental mindfulness and meditation application with tree-of-thought reasoning integration.',
    image: ASSETS.apps.zenReset,
    tags: ['Meditation', 'AI', 'Experimental'],
    status: 'testing',
    githubUrl: 'https://github.com/yetog/zen-tot',
  },
];

// =============================================================================
// UPGRADING APPS - Active development, being enhanced
// =============================================================================
export const upgradingApps: App[] = [
  {
    id: 'ashley-v3',
    title: '☁️ Ashley v3',
    description: 'Cloud Provision Agent with ElevenLabs voice integration. Manages cloud infrastructure through conversational AI with natural voice interactions.',
    image: ASSETS.apps.zenReset,
    tags: ['AI', 'Cloud', 'Voice', 'Infrastructure'],
    status: 'upgrading',
    githubUrl: 'https://github.com/yetog/Ashley-v3',
  },
  {
    id: 'sensei-ai-io',
    title: '💼 Sensei AI IO',
    description: 'Sales and Retention Assistant powered by AI. Helps teams improve customer engagement and retention through intelligent insights.',
    image: ASSETS.apps.zenReset,
    tags: ['AI', 'Sales', 'CRM', 'Retention'],
    status: 'upgrading',
    githubUrl: 'https://github.com/yetog/sensei-ai-io',
  },
  {
    id: 'ask-hr-beta',
    title: '👥 Ask HR Beta',
    description: 'AI HR Assistant that answers employee questions, helps with onboarding, and provides HR policy guidance.',
    image: ASSETS.apps.zenReset,
    tags: ['AI', 'HR', 'Assistant', 'Enterprise'],
    status: 'upgrading',
    githubUrl: 'https://github.com/yetog/ask-hr-beta',
  },
  {
    id: 'sop-ai-beta',
    title: '📋 SOP AI Beta',
    description: 'SOP AI RAG Chatbot for querying and understanding Standard Operating Procedures using retrieval-augmented generation.',
    image: ASSETS.apps.zenReset,
    tags: ['AI', 'RAG', 'Documentation', 'Enterprise'],
    status: 'upgrading',
    githubUrl: 'https://github.com/yetog/sop-ai-beta',
  },
];

// Combined apps array for backward compatibility
export const apps: App[] = [...finishedApps, ...testingApps, ...upgradingApps];

// Helper to get apps by status
export const getAppsByStatus = (status: AppStatus): App[] => {
  return apps.filter(app => app.status === status);
};

// Featured apps (first 5 finished apps for main page)
export const featuredApps = finishedApps.slice(0, 5);
