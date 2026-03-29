import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Filter } from 'lucide-react';
import { journeyPosts, phaseColors, getPublishedPosts } from '../data/dj';

const allTags = [...new Set(journeyPosts.flatMap(p => p.tags))].sort();
const allPhases = [...new Set(journeyPosts.map(p => p.phase))];

const DJJourney = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const publishedPosts = getPublishedPosts();

  const filteredPosts = publishedPosts.filter(post => {
    if (selectedTag && !post.tags.includes(selectedTag)) return false;
    if (selectedPhase && post.phase !== selectedPhase) return false;
    return true;
  });

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
        <div className="container mx-auto px-4 pt-8 pb-8">
          <Link to="/dj" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft size={20} />
            <span>Back to DJ</span>
          </Link>

          <div className="max-w-4xl mx-auto text-center">
            <span className="text-6xl mb-4 block">🎧</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              The Adventures of DJ Zay
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From first failure to finding my sound. The real story of learning to DJ.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="container mx-auto px-4 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filter by:</span>
            </div>

            {/* Phase Filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setSelectedPhase(null)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                  !selectedPhase ? 'bg-purple-500 text-white' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                All Phases
              </button>
              {allPhases.map(phase => (
                <button
                  key={phase}
                  onClick={() => setSelectedPhase(selectedPhase === phase ? null : phase)}
                  className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                    selectedPhase === phase
                      ? phaseColors[phase]
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {phase}
                </button>
              ))}
            </div>

            {/* Tag Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                  !selectedTag ? 'bg-purple-500 text-white' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                All Tags
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                    selectedTag === tag
                      ? 'bg-purple-500 text-white'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="container mx-auto px-4 pb-20">
          <div className="max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500/20"></div>

              {/* Posts */}
              <div className="space-y-4">
                {filteredPosts.map((post, index) => (
                  <Link
                    key={post.id}
                    to={`/dj/journey/${post.id}`}
                    className="block relative pl-16 group"
                  >
                    {/* Timeline Node */}
                    <div className={`absolute left-4 w-5 h-5 rounded-full border-2 border-purple-500 bg-background group-hover:bg-purple-500 transition-colors ${
                      index === 0 ? 'ring-4 ring-purple-500/20' : ''
                    }`}></div>

                    {/* Card */}
                    <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-5 hover:border-purple-500/30 transition-all group-hover:translate-x-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          {/* Meta */}
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-lg font-bold text-purple-400/70">#{post.number}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${phaseColors[post.phase]}`}>
                              {post.phase}
                            </span>
                            <span className="text-xs text-muted-foreground">{post.date}</span>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                            {post.title}
                          </h3>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {post.tags.map(tag => (
                              <span key={tag} className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Summary or Core Focus */}
                          <p className="text-sm text-muted-foreground mt-2">
                            {post.summary || post.coreFocus}
                          </p>
                        </div>

                        <ChevronRight className="text-muted-foreground group-hover:text-purple-400 transition-colors flex-shrink-0 mt-2" size={20} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No posts match the selected filters.</p>
                <button
                  onClick={() => {
                    setSelectedTag(null);
                    setSelectedPhase(null);
                  }}
                  className="mt-4 text-purple-400 hover:text-purple-300"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 text-center">
              <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-4">
                <p className="text-3xl font-bold text-purple-400">{publishedPosts.length}</p>
                <p className="text-sm text-muted-foreground">Entries</p>
              </div>
              <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-4">
                <p className="text-3xl font-bold text-purple-400">1</p>
                <p className="text-sm text-muted-foreground">Season</p>
              </div>
              <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-4">
                <p className="text-3xl font-bold text-purple-400">2026</p>
                <p className="text-sm text-muted-foreground">Started</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DJJourney;
