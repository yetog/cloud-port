
import { useState, useEffect, useRef } from 'react';
import { projects } from '../data/projects';
import { ExternalLink, Code } from 'lucide-react';

const Projects = () => {
  const [visibleProjects, setVisibleProjects] = useState<string[]>([]);
  const projectsRef = useRef<HTMLDivElement>(null);

  // Handle intersection observer for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const timer = setTimeout(() => {
            setVisibleProjects(projects.map(project => project.id));
          }, 300);
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.1 }
    );
    
    if (projectsRef.current) {
      observer.observe(projectsRef.current);
    }
    
    return () => {
      if (projectsRef.current) {
        observer.unobserve(projectsRef.current);
      }
    };
  }, []);

  return (
    <section id="projects" className="py-20 md:py-28 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title">Projects</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mb-12">
            Here are selected infrastructure and hosting projects I've helped develop or manage. From scalable server architectures to sleek, client-ready websites — each project reflects a blend of efficiency, modern design, and long-term sustainability.
          </p>
          
          <div ref={projectsRef} className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div 
                key={project.id}
                className={`glass-panel p-6 transition-all duration-500 
                          ${visibleProjects.includes(project.id) 
                            ? 'opacity-100 transform-none' 
                            : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="aspect-video w-full bg-muted mb-4 rounded overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-4 mt-4">
                  {project.demoUrl && (
                    <a 
                      href={project.demoUrl}
                      className="flex items-center text-sm text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={16} className="mr-1" />
                      View Project
                    </a>
                  )}
                  {project.codeUrl && (
                    <a 
                      href={project.codeUrl}
                      className="flex items-center text-sm text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Code size={16} className="mr-1" />
                      View Code
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
