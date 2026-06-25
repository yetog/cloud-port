import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Calendar, MapPin, Headphones, Mail, ChevronRight, Camera } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { djProfile, djMixes, djEvents, journeyPosts, getFeaturedMix, vibeColors, djStats } from '../data/dj';
import SpinningVinyl from '../components/SpinningVinyl';

// S3 paths for hero media - update these when you upload content
const S3_DJ_URL = 'https://s3.us-central-1.ionoscloud.com/portfoliowebsite/dj';
const heroVideo = ''; // `${S3_DJ_URL}/hero/dj-hero.mp4` when ready
const heroImage = ''; // `${S3_DJ_URL}/hero/dj-hero.jpg` when ready

const DJ = () => {
  const featuredMix = getFeaturedMix();
  const recentPosts = journeyPosts.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-4 pt-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Portfolio</span>
          </Link>
        </div>

        {/* Hero Section with Video Background Support */}
        <section className="relative container mx-auto px-4 py-20 text-center overflow-hidden">
          {/* Video Background (when available) */}
          {heroVideo && (
            <div className="absolute inset-0 -z-10">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-30"
                poster={heroImage}
              >
                <source src={heroVideo} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
            </div>
          )}

          {/* Static Image Background (fallback when no video) */}
          {!heroVideo && heroImage && (
            <div className="absolute inset-0 -z-10">
              <img
                src={heroImage}
                alt="DJ Zay"
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
            </div>
          )}

          <div className="max-w-4xl mx-auto relative z-10">
            {/* Spinning Vinyl Visual */}
            <div className="flex justify-center mb-8">
              <SpinningVinyl
                isPlaying={true}
                size="xl"
                className="opacity-90"
              />
            </div>

            {/* Name & Tagline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              {djProfile.name}
            </h1>
            <p className="text-2xl md:text-3xl text-muted-foreground mb-4">
              {djProfile.tagline}
            </p>
            <p className="text-lg text-muted-foreground/80 mb-8">
              {djProfile.subtitle}
            </p>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              {djProfile.bio}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dj/mixes">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8">
                  <Headphones className="mr-2 h-5 w-5" />
                  Listen to Mixes
                </Button>
              </Link>
              <Link to="/dj/events">
                <Button size="lg" variant="outline" className="border-purple-500/50 hover:bg-purple-500/10 px-8">
                  <Camera className="mr-2 h-5 w-5" />
                  View Events
                </Button>
              </Link>
              <Link to="/dj/booking">
                <Button size="lg" variant="outline" className="border-pink-500/50 hover:bg-pink-500/10 px-8">
                  <Mail className="mr-2 h-5 w-5" />
                  Book Me
                </Button>
              </Link>
            </div>

            {/* Stats Section */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center hover:border-purple-500/30 transition-all">
                <div className="text-3xl font-bold text-purple-400">{djStats.totalEvents}</div>
                <div className="text-sm text-muted-foreground">Live Events</div>
              </div>
              <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center hover:border-purple-500/30 transition-all">
                <div className="text-3xl font-bold text-pink-400">{djStats.hoursPlayed}+</div>
                <div className="text-sm text-muted-foreground">Hours Played</div>
              </div>
              <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center hover:border-purple-500/30 transition-all">
                <div className="text-3xl font-bold text-purple-400">{djStats.venuesPlayed}</div>
                <div className="text-sm text-muted-foreground">Venues</div>
              </div>
              <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center hover:border-purple-500/30 transition-all">
                <div className="text-3xl font-bold text-pink-400">{djStats.songsInLibrary.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Tracks in Library</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Mix */}
        {featuredMix && (
          <section className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Play className="w-6 h-6 text-purple-400" />
                Featured Mix
              </h2>
              <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-purple-500/30 transition-all group">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  {/* Spinning Vinyl for Featured Mix */}
                  <div className="flex-shrink-0">
                    <SpinningVinyl
                      isPlaying={false}
                      coverUrl={featuredMix.coverUrl}
                      size="lg"
                      className="group-hover:animate-spin-slow"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                      <span className={`text-xs px-2 py-1 rounded-full ${vibeColors[featuredMix.vibe]}`}>
                        {featuredMix.vibe}
                      </span>
                      <span className="text-sm text-muted-foreground">{featuredMix.duration}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{featuredMix.title}</h3>
                    <p className="text-muted-foreground mb-4">{featuredMix.description}</p>
                    <Link to="/dj/mixes">
                      <Button variant="outline" size="sm" className="border-purple-500/50 hover:bg-purple-500/10">
                        <Play className="mr-2 h-4 w-4" />
                        Play Mix
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Events Preview */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Calendar className="w-6 h-6 text-purple-400" />
                Events & Experience
              </h2>
              <Link to="/dj/events" className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-sm">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {djEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-5 hover:border-purple-500/30 transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={14} className="text-purple-400" />
                    <span className="text-xs text-muted-foreground">{event.location}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{event.venue}</h3>
                  <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">
                    {event.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Journey Preview */}
        <section className="container mx-auto px-4 py-16 pb-24">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="text-2xl">🎧</span>
                The Adventures of DJ Zay
              </h2>
              <Link to="/dj/journey" className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-sm">
                Read All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/dj/journey/${post.id}`}
                  className="block bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:border-purple-500/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-purple-400/50">#{post.number}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold hover:text-purple-400 transition-colors">{post.title}</h3>
                      <p className="text-sm text-muted-foreground">{post.date}</p>
                    </div>
                    <ChevronRight className="text-muted-foreground" size={20} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DJ;
