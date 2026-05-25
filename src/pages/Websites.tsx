import { Link } from 'react-router-dom';
import {
  ArrowLeft, Globe, ExternalLink, MapPin, Calendar, User
} from 'lucide-react';
import { websites, Website } from '../data/websites';

const WebsiteCard = ({ website }: { website: Website }) => {
  return (
    <article
      className="ff7-panel rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300"
      aria-labelledby={`website-${website.id}`}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-500/30" aria-hidden="true">
            <Globe className="w-6 h-6 text-cyan-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 id={`website-${website.id}`} className="text-xl font-bold text-foreground">
                {website.title}
              </h3>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                website.status === 'live'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              }`}>
                {website.status === 'live' ? 'Live' : 'In Development'}
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">{website.description}</p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-4">
              {website.clientName && (
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {website.clientName}
                </span>
              )}
              {website.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {website.location}
                </span>
              )}
              {website.launchDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(website.launchDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {website.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visit Site Button */}
      <div className="border-t border-border/50">
        <a
          href={website.siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full px-6 py-3 flex items-center justify-between text-sm text-cyan-400 hover:bg-cyan-500/10 transition-colors min-h-[44px]"
          aria-label={`Visit ${website.title} website`}
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
            Visit Website
          </span>
          <span className="text-xs text-muted-foreground">{website.siteUrl.replace('https://', '')}</span>
        </a>
      </div>
    </article>
  );
};

const Websites = () => {
  const liveCount = websites.filter(w => w.status === 'live').length;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Skip Link */}
      <a href="#websites-content" className="skip-link">
        Skip to websites
      </a>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <main className="relative z-10" id="websites-content" role="main" aria-label="Client websites page">
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
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-2xl flex items-center justify-center border border-cyan-500/30">
              <Globe className="w-10 h-10 text-cyan-400" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground text-glow">
              Client Websites
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Professional websites built for clients across various industries.
              Fast, responsive, and optimized for conversions.
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 text-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{websites.length}</p>
                <p className="text-muted-foreground">Total Sites</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">{liveCount}</p>
                <p className="text-muted-foreground">Live</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-muted-foreground">Uptime</p>
              </div>
            </div>
          </div>
        </div>

        {/* Websites Grid */}
        <div className="container mx-auto px-4 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="list" aria-label="Client websites">
              {websites.map(website => (
                <div key={website.id} role="listitem">
                  <WebsiteCard website={website} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-4 pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="ff7-panel rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Need a Website for Your Business?</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                I build fast, professional websites that drive leads and conversions.
                From landscaping to e-commerce, let's create something great together.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/#contact"
                  className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors"
                >
                  Get a Quote
                </Link>
                <Link
                  to="/services"
                  className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
                >
                  View All Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Websites;
