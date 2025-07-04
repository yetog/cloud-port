import { useState, useEffect, useRef } from 'react';
import { skills } from '../data/skills';
import { ASSETS } from '../config/assets';

const About = () => {
  const [visibleSkills, setVisibleSkills] = useState<string[]>([]);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const skillsRef = useRef<HTMLDivElement>(null);

  // Handle intersection observer for skills animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const timer = setTimeout(() => {
            setVisibleSkills(skills.map(skill => skill.name));
          }, 300);
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.2 }
    );
    
    if (skillsRef.current) {
      observer.observe(skillsRef.current);
    }
    
    return () => {
      if (skillsRef.current) {
        observer.unobserve(skillsRef.current);
      }
    };
  }, []);

  const handleImageLoad = () => {
    console.log('Profile image loaded successfully');
    setImageLoaded(true);
  };

  const handleImageError = () => {
    console.log('Profile image failed to load, trying alternative...');
    setImageError(true);
  };

  return (
    <section id="about" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title">About Me</h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-1">
              <div className="aspect-[3/4] w-full max-w-xs mx-auto md:mx-0 overflow-hidden rounded-xl glass-panel">
                {!imageError ? (
                  <img 
                    src={ASSETS.profile.avatar} 
                    alt="Profile photo"
                    className="w-full h-full object-cover object-top"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                ) : (
                  <img 
                    src={ASSETS.profile.avatarPng} 
                    alt="Profile photo"
                    className="w-full h-full object-cover object-top"
                    onLoad={handleImageLoad}
                    onError={() => console.log('Both profile images failed to load')}
                  />
                )}
                {!imageLoaded && !imageError && (
                  <div className="w-full h-full bg-secondary animate-pulse flex items-center justify-center">
                    <span className="text-muted-foreground">Loading...</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <p className="text-lg leading-relaxed mb-6">
                I'm an infrastructure and cloud consultant with a passion for building scalable, resilient digital systems. With a background in web engineering and a deep understanding of cloud architecture, I help businesses optimize infrastructure, enhance security, and improve operational agility.
              </p>
              <p className="text-lg leading-relaxed mb-8">
                Whether it's streamlining deployments, migrating to cloud-native platforms, or improving performance, I bring a hands-on, solution-oriented approach to every project.
              </p>
              
              <div ref={skillsRef} className="mt-12">
                <h3 className="text-xl font-semibold mb-6">Skills & Expertise</h3>
                
                <div className="space-y-8">
                  {['technical', 'cloud', 'soft'].map((category) => (
                    <div key={category} className="mb-8">
                      <h4 className="text-lg font-medium capitalize mb-4">{category} Skills</h4>
                      <div className="space-y-5">
                        {skills
                          .filter((skill) => skill.category === category)
                          .map((skill) => (
                            <div key={skill.name} className="space-y-2">
                              <div className="flex justify-between">
                                <span>{skill.name}</span>
                                <span>{skill.level}%</span>
                              </div>
                              <div className="progress-bar">
                                <div 
                                  className="progress-bar-fill" 
                                  style={{ 
                                    width: visibleSkills.includes(skill.name) ? `${skill.level}%` : '0%',
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
