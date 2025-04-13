
export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: 'cloud' | 'webhosting' | 'artcurating' | 'audioengineering';
  demoUrl?: string;
  codeUrl?: string;
}

export const projects: Project[] = [
  {
    id: 'cloud-migration',
    title: 'Enterprise Cloud Migration',
    description: 'Led the migration of a legacy infrastructure to AWS, resulting in 40% cost reduction and improved scalability.',
    image: '/placeholder.svg',
    tags: ['AWS', 'Migration', 'Infrastructure'],
    category: 'cloud',
    demoUrl: '#',
  },
  {
    id: 'devops-pipeline',
    title: 'CI/CD Pipeline Optimization',
    description: 'Designed and implemented automated deployment pipelines reducing deployment time from days to minutes.',
    image: '/placeholder.svg',
    tags: ['DevOps', 'CI/CD', 'Jenkins', 'GitHub Actions'],
    category: 'cloud',
    demoUrl: '#',
  },
  {
    id: 'scalable-architecture',
    title: 'Scalable Web Architecture',
    description: 'Architected a high-availability solution handling 10M+ daily requests with 99.99% uptime.',
    image: '/placeholder.svg',
    tags: ['Cloud Architecture', 'Load Balancing', 'AWS'],
    category: 'webhosting',
    demoUrl: '#',
  },
  {
    id: 'serverless-api',
    title: 'Serverless API Platform',
    description: 'Built a cost-effective serverless platform connecting multiple data sources with auto-scaling capabilities.',
    image: '/placeholder.svg',
    tags: ['Serverless', 'Lambda', 'API Gateway'],
    category: 'webhosting',
    demoUrl: '#',
  },
  {
    id: 'art-exhibition',
    title: 'Digital Art Exhibition',
    description: 'Curated and hosted a virtual gallery featuring interactive digital art pieces from emerging artists.',
    image: '/placeholder.svg',
    tags: ['Virtual Gallery', 'Digital Art', 'Curation'],
    category: 'artcurating',
    demoUrl: '#',
  },
  {
    id: 'music-production',
    title: 'Album Production Suite',
    description: 'Designed a cloud-based workflow for remote music production teams, enabling seamless collaboration.',
    image: '/placeholder.svg',
    tags: ['Audio Production', 'Cloud Workflow', 'Collaboration'],
    category: 'audioengineering',
    demoUrl: '#',
  }
];
