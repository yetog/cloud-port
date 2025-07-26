
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
  }
];
