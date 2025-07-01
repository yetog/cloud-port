
import { ASSETS } from '../config/assets';

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
  // Cloud Infrastructure (3+)
  {
    id: 'cloud-migration',
    title: 'Enterprise Cloud Migration',
    description: 'Led the migration of a legacy infrastructure to AWS, resulting in 40% cost reduction and improved scalability.',
    image: ASSETS.projects.cloudMigration,
    tags: ['AWS', 'Migration', 'Infrastructure'],
    category: 'cloud',
    demoUrl: '#',
  },
  {
    id: 'devops-pipeline',
    title: 'CI/CD Pipeline Optimization',
    description: 'Designed and implemented automated deployment pipelines reducing deployment time from days to minutes.',
    image: ASSETS.projects.devopsPipeline,
    tags: ['DevOps', 'CI/CD', 'Jenkins', 'GitHub Actions'],
    category: 'cloud',
    demoUrl: '#',
  },
  {
    id: 'cloud-security',
    title: 'Cloud Security Framework',
    description: 'Implemented enterprise-grade cloud security policies, automating compliance checks across resources.',
    image: ASSETS.projects.cloudSecurity,
    tags: ['Security', 'Compliance', 'Automation'],
    category: 'cloud',
    demoUrl: '#',
  },
  // Web Hosting (3+)
  {
    id: 'scalable-architecture',
    title: 'Scalable Web Architecture',
    description: 'Architected a high-availability solution handling 10M+ daily requests with 99.99% uptime.',
    image: ASSETS.projects.scalableArchitecture,
    tags: ['Cloud Architecture', 'Load Balancing', 'AWS'],
    category: 'webhosting',
    demoUrl: '#',
  },
  {
    id: 'serverless-api',
    title: 'Serverless API Platform',
    description: 'Built a cost-effective serverless platform connecting multiple data sources with auto-scaling capabilities.',
    image: ASSETS.projects.serverlessApi,
    tags: ['Serverless', 'Lambda', 'API Gateway'],
    category: 'webhosting',
    demoUrl: '#',
  },
  {
    id: 'nextjs-hosting',
    title: 'Next.js Hosting & Deployment',
    description: 'Developed an automated solution for deploying, scaling, and monitoring Next.js apps worldwide.',
    image: ASSETS.projects.nextjsHosting,
    tags: ['Next.js', 'Vercel', 'Web Hosting'],
    category: 'webhosting',
    demoUrl: '#',
  },
  // Art Curation (3+)
  {
    id: 'art-exhibition',
    title: 'Digital Art Exhibition',
    description: 'Curated and hosted a virtual gallery featuring interactive digital art pieces from emerging artists.',
    image: ASSETS.projects.artExhibition,
    tags: ['Virtual Gallery', 'Digital Art', 'Curation'],
    category: 'artcurating',
    demoUrl: '#',
  },
  {
    id: 'mixed-media-salon',
    title: 'Mixed Media Art Salon',
    description: 'Produced an experimental salon bringing together digital, video, and installation artists.',
    image: ASSETS.projects.mixedMediaSalon,
    tags: ['Exhibition', 'Salon', 'Art Curating'],
    category: 'artcurating',
    demoUrl: '#',
  },
  {
    id: 'gallery-tech',
    title: 'Interactive Gallery Tech',
    description: 'Engineered interactive touchscreen displays for in-person digital art experiences.',
    image: ASSETS.projects.galleryTech,
    tags: ['Interactive', 'Gallery', 'Technology'],
    category: 'artcurating',
    demoUrl: '#',
  },
  // Audio Engineering (3+)
  {
    id: 'music-production',
    title: 'Album Production Suite',
    description: 'Designed a cloud-based workflow for remote music production teams, enabling seamless collaboration.',
    image: ASSETS.projects.musicProduction,
    tags: ['Audio Production', 'Cloud Workflow', 'Collaboration'],
    category: 'audioengineering',
    demoUrl: '#',
  },
  {
    id: 'remote-mix',
    title: 'Remote Live Mix',
    description: 'Engineered a low-latency remote mix session for a global live concert broadcast.',
    image: ASSETS.projects.remoteMix,
    tags: ['Live Sound', 'Remote Mixing', 'Streaming'],
    category: 'audioengineering',
    demoUrl: '#',
  },
  {
    id: 'immersive-audio',
    title: 'Immersive Audio Install',
    description: 'Built a 3D spatial audio soundscape for a modern art museum room.',
    image: ASSETS.projects.immersiveAudio,
    tags: ['Spatial Audio', 'Installation', 'Sound Design'],
    category: 'audioengineering',
    demoUrl: '#',
  },
];
