import { LucideIcon, Code, Briefcase, TrendingUp, BookOpen, Users, Lightbulb } from 'lucide-react';

export interface KnowledgeCategory {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  articleCount: number;
  url: string;
}

export const knowledgeCategories: KnowledgeCategory[] = [
  {
    id: 'tech',
    name: 'Tech',
    description: 'Docker, PostgreSQL, VSCode & more',
    icon: Code,
    articleCount: 13,
    url: 'https://zaylegend.com/knowledge-base/tech/awesome-list.html'
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Hiring, Sales, Marketing',
    icon: Briefcase,
    articleCount: 6,
    url: 'https://zaylegend.com/knowledge-base/business/hiring.html'
  },
  {
    id: 'levels',
    name: 'Levels',
    description: 'Business, Life, Leadership',
    icon: TrendingUp,
    articleCount: 8,
    url: 'https://zaylegend.com/knowledge-base/levels/business.html'
  },
  {
    id: 'philosophy',
    name: 'Philosophy',
    description: 'Ethics, Buddhism, Stoicism',
    icon: BookOpen,
    articleCount: 5,
    url: 'https://zaylegend.com/knowledge-base/philosophy/ethics.html'
  },
  {
    id: 'people',
    name: 'People',
    description: 'Notable figures & their lessons',
    icon: Users,
    articleCount: 4,
    url: 'https://zaylegend.com/knowledge-base/people/index.html'
  },
  {
    id: 'miscellaneous',
    name: 'Miscellaneous',
    description: 'Chess, Climbing, Consciousness & more',
    icon: Lightbulb,
    articleCount: 12,
    url: 'https://zaylegend.com/knowledge-base/misc/chess.html'
  },
];
