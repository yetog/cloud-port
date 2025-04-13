
export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
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
    demoUrl: '#',
  },
  {
    id: 'devops-pipeline',
    title: 'CI/CD Pipeline Optimization',
    description: 'Designed and implemented automated deployment pipelines reducing deployment time from days to minutes.',
    image: '/placeholder.svg',
    tags: ['DevOps', 'CI/CD', 'Jenkins', 'GitHub Actions'],
    demoUrl: '#',
  },
  {
    id: 'scalable-architecture',
    title: 'Scalable Web Architecture',
    description: 'Architected a high-availability solution handling 10M+ daily requests with 99.99% uptime.',
    image: '/placeholder.svg',
    tags: ['Cloud Architecture', 'Load Balancing', 'AWS'],
    demoUrl: '#',
  },
  {
    id: 'serverless-api',
    title: 'Serverless API Platform',
    description: 'Built a cost-effective serverless platform connecting multiple data sources with auto-scaling capabilities.',
    image: '/placeholder.svg',
    tags: ['Serverless', 'Lambda', 'API Gateway'],
    demoUrl: '#',
  }
];
