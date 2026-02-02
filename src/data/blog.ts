export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: 'cloud' | 'ai' | 'devops' | 'creative' | 'tutorial' | 'insights';
  tags: string[];
  image?: string;
  featured?: boolean;
}

export interface BlogCategory {
  id: string;
  title: string;
  color: string;
}

export const blogCategories: BlogCategory[] = [
  { id: 'all', title: 'All Posts', color: 'bg-muted' },
  { id: 'cloud', title: 'Cloud', color: 'bg-blue-500' },
  { id: 'ai', title: 'AI', color: 'bg-purple-500' },
  { id: 'devops', title: 'DevOps', color: 'bg-green-500' },
  { id: 'creative', title: 'Creative', color: 'bg-orange-500' },
  { id: 'tutorial', title: 'Tutorials', color: 'bg-cyan-500' },
  { id: 'insights', title: 'Insights', color: 'bg-pink-500' }
];

export const blogPosts: BlogPost[] = [
  {
    id: 'building-ai-agents-2026',
    title: 'Building AI Agents in 2026: A Practical Guide',
    excerpt: 'Explore the latest techniques for building intelligent AI agents using modern LLM frameworks and best practices for production deployment.',
    content: `
# Building AI Agents in 2026

The landscape of AI agent development has evolved dramatically. In this guide, we'll explore practical approaches to building intelligent agents that can reason, plan, and execute complex tasks.

## Key Components

### 1. Reasoning Engine
Modern agents use chain-of-thought reasoning to break down complex problems into manageable steps.

### 2. Memory Systems
Long-term and short-term memory systems allow agents to maintain context and learn from interactions.

### 3. Tool Integration
Agents become powerful when they can use external tools - APIs, databases, and other services.

## Best Practices

- Start with clear goal definitions
- Implement robust error handling
- Use structured outputs for reliability
- Monitor and iterate on agent behavior

The future of AI agents is collaborative, with multiple specialized agents working together to solve complex problems.
    `,
    author: 'Isayah Young-Burke',
    date: '2026-01-25',
    readTime: '8 min read',
    category: 'ai',
    tags: ['AI', 'Agents', 'LLM', 'Development'],
    featured: true
  },
  {
    id: 'cloud-cost-optimization',
    title: 'Cloud Cost Optimization: Strategies That Actually Work',
    excerpt: 'Learn proven strategies for reducing cloud costs without sacrificing performance or reliability.',
    content: `
# Cloud Cost Optimization Strategies

Cloud costs can quickly spiral out of control. Here's how to keep them in check while maintaining performance.

## Immediate Wins

1. **Right-sizing instances** - Most workloads are over-provisioned
2. **Reserved capacity** - Commit to predictable workloads
3. **Spot instances** - For fault-tolerant workloads

## Long-term Strategies

- Implement auto-scaling policies
- Use serverless where appropriate
- Regularly audit unused resources
- Set up cost alerts and budgets

The key is continuous monitoring and optimization, not one-time fixes.
    `,
    author: 'Isayah Young-Burke',
    date: '2026-01-20',
    readTime: '6 min read',
    category: 'cloud',
    tags: ['Cloud', 'AWS', 'Cost Optimization', 'Infrastructure']
  },
  {
    id: 'cicd-best-practices',
    title: 'CI/CD Pipeline Best Practices for 2026',
    excerpt: 'Modern deployment pipelines that reduce time-to-production while maintaining quality and security.',
    content: `
# CI/CD Best Practices

Continuous Integration and Deployment are fundamental to modern software delivery. Here's how to do it right.

## Pipeline Architecture

### Build Stage
- Fast feedback loops
- Parallel test execution
- Artifact caching

### Deploy Stage
- Blue-green deployments
- Canary releases
- Automated rollbacks

## Security Integration

Security should be built into every stage:
- SAST scanning
- Dependency audits
- Container scanning
- Runtime protection

Remember: the goal is to ship faster with more confidence, not just to ship faster.
    `,
    author: 'Isayah Young-Burke',
    date: '2026-01-15',
    readTime: '7 min read',
    category: 'devops',
    tags: ['DevOps', 'CI/CD', 'Automation', 'GitHub Actions']
  },
  {
    id: 'audio-engineering-cloud',
    title: 'Audio Engineering in the Cloud Era',
    excerpt: 'How cloud technology is transforming music production and audio engineering workflows.',
    content: `
# Audio Engineering in the Cloud

The intersection of audio engineering and cloud technology opens new possibilities for collaboration and production.

## Cloud-Based Workflows

- Remote collaboration in real-time
- Distributed rendering for complex projects
- Version control for audio assets
- Scalable processing power

## Tools and Platforms

Modern audio engineers leverage cloud infrastructure for:
- Large-scale sample libraries
- AI-assisted mixing and mastering
- Global distribution pipelines
- Backup and archival systems

The future is hybrid - combining local creativity with cloud scalability.
    `,
    author: 'Isayah Young-Burke',
    date: '2026-01-10',
    readTime: '5 min read',
    category: 'creative',
    tags: ['Audio', 'Cloud', 'Music Production', 'Engineering']
  },
  {
    id: 'docker-for-developers',
    title: 'Docker Essentials: A Developer\'s Guide',
    excerpt: 'Everything you need to know about containerization for modern application development.',
    content: `
# Docker Essentials

Containers have revolutionized how we build, ship, and run applications. This guide covers the essentials.

## Core Concepts

1. **Images** - Blueprints for containers
2. **Containers** - Running instances
3. **Volumes** - Persistent data storage
4. **Networks** - Container communication

## Best Practices

- Use multi-stage builds
- Keep images small
- Don't run as root
- Use .dockerignore
- Tag images properly

## Docker Compose

For multi-container applications:
\`\`\`yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
  db:
    image: postgres:15
\`\`\`

Mastering Docker is essential for modern development workflows.
    `,
    author: 'Isayah Young-Burke',
    date: '2026-01-05',
    readTime: '10 min read',
    category: 'tutorial',
    tags: ['Docker', 'Containers', 'DevOps', 'Tutorial']
  },
  {
    id: 'future-of-work-ai',
    title: 'The Future of Work: AI as a Collaborator',
    excerpt: 'How AI is reshaping the workplace and what it means for professionals in tech and creative fields.',
    content: `
# AI as a Collaborator

We're witnessing a fundamental shift in how humans and AI work together. Here are my observations.

## The Collaborative Model

AI isn't replacing workers - it's augmenting capabilities:
- Code generation and review
- Creative ideation
- Data analysis
- Research acceleration

## Adapting to Change

Professionals should:
1. Learn to prompt effectively
2. Understand AI capabilities and limits
3. Focus on uniquely human skills
4. Embrace continuous learning

## The Opportunity

Those who master AI collaboration will have a significant competitive advantage. The key is to see AI as a powerful tool in your arsenal, not a threat.

The future belongs to those who can effectively orchestrate human creativity with AI capabilities.
    `,
    author: 'Isayah Young-Burke',
    date: '2026-01-01',
    readTime: '6 min read',
    category: 'insights',
    tags: ['AI', 'Future of Work', 'Insights', 'Career']
  }
];

export const getFeaturedPosts = (): BlogPost[] => {
  return blogPosts.filter(post => post.featured);
};

export const getPostsByCategory = (category: string): BlogPost[] => {
  if (category === 'all') return blogPosts;
  return blogPosts.filter(post => post.category === category);
};

export const getPostById = (id: string): BlogPost | undefined => {
  return blogPosts.find(post => post.id === id);
};

export const getRecentPosts = (count: number = 3): BlogPost[] => {
  return [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
};
