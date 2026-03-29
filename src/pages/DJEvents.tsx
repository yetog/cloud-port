import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Star } from 'lucide-react';
import { djEvents } from '../data/dj';

const DJEvents = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-4 pt-8 pb-12">
          <Link to="/dj" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft size={20} />
            <span>Back to DJ</span>
          </Link>

          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Events & Experience
            </h1>
            <p className="text-xl text-muted-foreground">
              From residencies to private events. Building the vibe, one set at a time.
            </p>
          </div>
        </div>

        {/* Events List */}
        <div className="container mx-auto px-4 pb-20">
          <div className="max-w-4xl mx-auto space-y-6">
            {djEvents.map((event) => (
              <div
                key={event.id}
                className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="w-full md:w-64 h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                    {event.imageUrl ? (
                      <img src={event.imageUrl} alt={event.venue} className="w-full h-full object-cover" />
                    ) : (
                      <Calendar className="w-16 h-16 text-purple-400/50" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">
                        {event.type}
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin size={14} />
                        {event.location}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{event.venue}</h3>
                    <p className="text-muted-foreground">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* What I Bring Section */}
            <div className="mt-12 bg-background/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Star className="w-6 h-6 text-purple-400" />
                What I Bring
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 text-purple-400">Vibes</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Soulful house & deep grooves</li>
                    <li>Funk-driven energy</li>
                    <li>Smooth transitions</li>
                    <li>Crowd-reading adaptability</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-purple-400">Setup</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>CDJ / Controller ready</li>
                    <li>USB & streaming compatible</li>
                    <li>Backup systems in place</li>
                    <li>Professional approach</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center pt-8">
              <p className="text-muted-foreground mb-4">Want me at your next event?</p>
              <Link
                to="/dj/booking"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full transition-colors"
              >
                Book Me
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DJEvents;
