import { useState, useEffect, useRef } from 'react';
import { skills } from '../data/skills';
import { ASSETS } from '../config/assets';
import { FF7Panel, SectionHeader, AttributeBar, MateriaIndicator } from './rpg';

// Map skill levels to materia (1-5 scale based on percentage)
const getMateria = (level: number): number => {
  if (level >= 90) return 5;
  if (level >= 75) return 4;
  if (level >= 60) return 3;
  if (level >= 40) return 2;
  return 1;
};

// Generate abbreviation from skill name
const getAbbr = (name: string): string => {
  const words = name.split(' ');
  if (words.length >= 3) {
    return words.slice(0, 3).map(w => w[0]).join('').toUpperCase();
  }
  return name.slice(0, 3).toUpperCase();
};

const About = () => {
  const [visibleSkills, setVisibleSkills] = useState<string[]>([]);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const skillsRef = useRef<HTMLDivElement>(null);

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

  const categoryColors: Record<string, 'primary' | 'gold' | 'blue'> = {
    technical: 'primary',
    cloud: 'blue',
    soft: 'gold'
  };

  return (
    <section id="about" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title text-glow">About Me</h2>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Profile Image */}
            <div className="md:col-span-1">
              <FF7Panel className="aspect-[3/4] w-full max-w-xs mx-auto md:mx-0 overflow-hidden p-0">
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
                  <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
                    <span className="text-muted-foreground">Loading...</span>
                  </div>
                )}
              </FF7Panel>
            </div>

            {/* Content */}
            <div className="md:col-span-2">
              <FF7Panel className="mb-6">
                <p className="text-lg leading-relaxed mb-4 text-foreground">
                  I'm an infrastructure and AI consultant with a passion for building scalable, resilient digital systems. With a background in web engineering and a deep understanding of cloud architecture, I help businesses optimize infrastructure, enhance security, and improve operational agility.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Whether it's streamlining deployments, migrating to cloud-native platforms, or improving performance, I bring a hands-on, solution-oriented approach to every project.
                </p>
              </FF7Panel>

              {/* Skills Section */}
              <div ref={skillsRef}>
                <FF7Panel title="Skills & Expertise" withCorners>
                  <div className="space-y-8">
                    {['technical', 'cloud', 'soft'].map((category) => {
                      const categorySkills = skills.filter((skill) => skill.category === category);

                      return (
                        <div key={category}>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground capitalize">
                              {category} Skills
                            </h4>
                            <MateriaIndicator
                              filled={Math.round(categorySkills.reduce((acc, s) => acc + s.level, 0) / categorySkills.length / 20)}
                              total={5}
                              size="sm"
                              color={categoryColors[category]}
                            />
                          </div>
                          <div className="space-y-3">
                            {categorySkills.map((skill) => (
                              <AttributeBar
                                key={skill.name}
                                abbr={getAbbr(skill.name)}
                                label={skill.name}
                                value={visibleSkills.includes(skill.name) ? skill.level : 0}
                                color={categoryColors[category]}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </FF7Panel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
