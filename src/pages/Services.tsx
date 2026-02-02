import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Cloud, Server, Code, Brain, Shield, Database,
  Globe, Rocket, Headphones, Palette, ChevronRight, Sparkles
} from 'lucide-react';
import { services, serviceCategories, Service, getServicesByCategory } from '../data/services';

const iconMap = {
  cloud: Cloud,
  server: Server,
  code: Code,
  brain: Brain,
  shield: Shield,
  database: Database,
  globe: Globe,
  rocket: Rocket,
  headphones: Headphones,
  palette: Palette
};

const ServiceCard = ({ service }: { service: Service }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const IconComponent = iconMap[service.icon];
  const featuresId = `features-${service.id}`;

  return (
    <article
      className="ff7-panel rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300"
      aria-labelledby={`service-${service.id}`}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/20 rounded-xl border border-primary/30" aria-hidden="true">
            <IconComponent className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 id={`service-${service.id}`} className="text-xl font-bold text-foreground mb-2">
              {service.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
          </div>
        </div>
      </div>

      {/* Features Toggle */}
      <div className="border-t border-border/50">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-6 py-3 flex items-center justify-between text-sm text-muted-foreground hover:bg-muted/20 transition-colors min-h-[44px]"
          aria-expanded={isExpanded}
          aria-controls={featuresId}
          aria-label={`${isExpanded ? 'Hide' : 'View'} features for ${service.title}`}
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
            View Features
          </span>
          <ChevronRight
            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
            aria-hidden="true"
          />
        </button>

        {isExpanded && (
          <div id={featuresId} className="px-6 pb-4 animate-slide-down">
            <ul className="space-y-2" aria-label={`Features for ${service.title}`}>
              {service.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" aria-hidden="true" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
};

const CategorySection = ({ category }: { category: typeof serviceCategories[0] }) => {
  const categoryServices = getServicesByCategory(category.id);
  const headingId = `category-${category.id}`;

  return (
    <section className="mb-16" aria-labelledby={headingId}>
      <div className="mb-8">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${category.color} bg-opacity-20 mb-4`}>
          <h2 id={headingId} className="text-sm font-medium text-white">{category.title}</h2>
        </div>
        <p className="text-muted-foreground">{category.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label={`${category.title} services`}>
        {categoryServices.map(service => (
          <div key={service.id} role="listitem">
            <ServiceCard service={service} />
          </div>
        ))}
      </div>
    </section>
  );
};

const Services = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Skip Link */}
      <a href="#services-content" className="skip-link">
        Skip to services
      </a>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <main className="relative z-10" id="services-content" role="main" aria-label="Services page">
        {/* Header */}
        <div className="container mx-auto px-4 pt-8 pb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 min-h-[44px]"
            aria-label="Go back to portfolio home"
          >
            <ArrowLeft size={20} aria-hidden="true" />
            <span>Back to Portfolio</span>
          </Link>

          <div className="max-w-4xl mx-auto text-center">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/30 to-purple-500/30 rounded-2xl flex items-center justify-center border border-primary/30">
              <Rocket className="w-10 h-10 text-primary" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground text-glow">
              Services
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Professional infrastructure, AI, and creative technology solutions
              tailored to your business needs.
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 text-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{services.length}</p>
                <p className="text-muted-foreground">Services</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{serviceCategories.length}</p>
                <p className="text-muted-foreground">Categories</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">24/7</p>
                <p className="text-muted-foreground">Support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Services by Category */}
        <div className="container mx-auto px-4 pb-20">
          <div className="max-w-6xl mx-auto">
            {serviceCategories.map(category => (
              <CategorySection key={category.id} category={category} />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-4 pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="ff7-panel rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Let's discuss your project and find the right solution for your needs.
                Schedule a consultation or reach out directly.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/#contact"
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Contact Me
                </Link>
                <Link
                  to="/#projects"
                  className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
                >
                  View Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Services;
