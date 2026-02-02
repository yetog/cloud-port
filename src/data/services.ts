export interface Service {
  id: string;
  title: string;
  description: string;
  icon: 'cloud' | 'server' | 'code' | 'brain' | 'shield' | 'database' | 'globe' | 'rocket' | 'headphones' | 'palette';
  features: string[];
  category: 'cloud' | 'ai' | 'infrastructure' | 'creative';
}

export interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  color: string;
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'cloud',
    title: 'Cloud Infrastructure',
    description: 'Enterprise-grade cloud solutions and migrations',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'ai',
    title: 'AI & Automation',
    description: 'Intelligent systems and workflow automation',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'infrastructure',
    title: 'Web & DevOps',
    description: 'Hosting, deployment, and continuous integration',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'creative',
    title: 'Creative Tech',
    description: 'Audio engineering and digital experiences',
    color: 'from-orange-500 to-red-500'
  }
];

export const services: Service[] = [
  // Cloud Infrastructure
  {
    id: 'cloud-migration',
    title: 'Cloud Migration',
    description: 'Seamless migration of legacy infrastructure to modern cloud platforms with minimal downtime and maximum cost efficiency.',
    icon: 'cloud',
    features: [
      'AWS, Azure, GCP expertise',
      'Zero-downtime migrations',
      'Cost optimization analysis',
      'Infrastructure as Code (IaC)',
      'Compliance and security review'
    ],
    category: 'cloud'
  },
  {
    id: 'cloud-architecture',
    title: 'Cloud Architecture Design',
    description: 'Design scalable, resilient cloud architectures that grow with your business needs.',
    icon: 'server',
    features: [
      'High-availability design',
      'Auto-scaling configurations',
      'Multi-region deployments',
      'Disaster recovery planning',
      'Performance optimization'
    ],
    category: 'cloud'
  },
  {
    id: 'cloud-security',
    title: 'Cloud Security',
    description: 'Implement enterprise-grade security policies and compliance automation across your cloud resources.',
    icon: 'shield',
    features: [
      'Security audits and assessments',
      'IAM policy design',
      'Encryption and key management',
      'Compliance automation (SOC2, HIPAA)',
      'Vulnerability scanning'
    ],
    category: 'cloud'
  },

  // AI & Automation
  {
    id: 'ai-integration',
    title: 'AI Integration',
    description: 'Integrate cutting-edge AI capabilities into your applications with custom LLM solutions and intelligent agents.',
    icon: 'brain',
    features: [
      'LLM integration (OpenAI, Anthropic)',
      'Custom AI agent development',
      'RAG system implementation',
      'Voice AI and TTS integration',
      'AI-powered automation'
    ],
    category: 'ai'
  },
  {
    id: 'chatbot-development',
    title: 'AI Chatbot Development',
    description: 'Build intelligent conversational AI systems for customer support, sales, and internal tools.',
    icon: 'brain',
    features: [
      'Multi-channel deployment',
      'Custom training data',
      'Context-aware conversations',
      'Integration with existing systems',
      'Analytics and insights'
    ],
    category: 'ai'
  },
  {
    id: 'workflow-automation',
    title: 'Workflow Automation',
    description: 'Automate repetitive tasks and streamline business processes with intelligent automation solutions.',
    icon: 'rocket',
    features: [
      'Process analysis and optimization',
      'API integrations',
      'Scheduled task automation',
      'Error handling and monitoring',
      'Custom dashboard development'
    ],
    category: 'ai'
  },

  // Web & DevOps
  {
    id: 'web-hosting',
    title: 'Web Hosting & Management',
    description: 'Reliable, high-performance web hosting with proactive management and 24/7 monitoring.',
    icon: 'globe',
    features: [
      'Managed hosting solutions',
      'Domain management',
      'SSL certificate management',
      'CDN configuration',
      'Performance monitoring'
    ],
    category: 'infrastructure'
  },
  {
    id: 'cicd-pipelines',
    title: 'CI/CD Pipeline Setup',
    description: 'Automated deployment pipelines that reduce deployment time from days to minutes.',
    icon: 'code',
    features: [
      'GitHub Actions / GitLab CI',
      'Automated testing',
      'Container orchestration',
      'Blue-green deployments',
      'Rollback automation'
    ],
    category: 'infrastructure'
  },
  {
    id: 'database-management',
    title: 'Database Management',
    description: 'Database design, optimization, and management for high-performance applications.',
    icon: 'database',
    features: [
      'Schema design and optimization',
      'Migration and data modeling',
      'Backup and recovery',
      'Performance tuning',
      'Replication and clustering'
    ],
    category: 'infrastructure'
  },

  // Creative Tech
  {
    id: 'audio-engineering',
    title: 'Audio Engineering',
    description: 'Professional audio production, mixing, and mastering for music, podcasts, and multimedia projects.',
    icon: 'headphones',
    features: [
      'Music production',
      'Mixing and mastering',
      'Podcast production',
      'Sound design',
      'Live sound engineering'
    ],
    category: 'creative'
  },
  {
    id: 'digital-experience',
    title: 'Digital Experience Design',
    description: 'Create immersive digital experiences with interactive visualizations and creative tech solutions.',
    icon: 'palette',
    features: [
      'Interactive visualizations',
      'Web-based audio/video apps',
      'Game development',
      'VR/AR experiences',
      'Creative coding'
    ],
    category: 'creative'
  }
];

export const getServicesByCategory = (category: string): Service[] => {
  return services.filter(s => s.category === category);
};

export const getServiceById = (id: string): Service | undefined => {
  return services.find(s => s.id === id);
};
