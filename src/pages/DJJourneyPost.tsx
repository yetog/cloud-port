import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, Tag } from 'lucide-react';
import { journeyPosts, phaseColors } from '../data/dj';

const DJJourneyPost = () => {
  const { postId } = useParams<{ postId: string }>();
  const post = journeyPosts.find(p => p.id === postId);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <Link to="/dj/journey" className="text-purple-400 hover:text-purple-300">
            Back to Journey
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = journeyPosts.findIndex(p => p.id === postId);
  const prevPost = currentIndex > 0 ? journeyPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < journeyPosts.length - 1 ? journeyPosts[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-4 pt-8 pb-8">
          <Link to="/dj/journey" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft size={20} />
            <span>Back to Journey</span>
          </Link>
        </div>

        {/* Post Content */}
        <article className="container mx-auto px-4 pb-20">
          <div className="max-w-3xl mx-auto">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-2xl font-bold text-purple-400/50">#{post.number}</span>
              <span className={`text-sm px-3 py-1 rounded-full ${phaseColors[post.phase]}`}>
                {post.phase}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar size={14} />
                {post.date}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map(tag => (
                <span key={tag} className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full flex items-center gap-1">
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-10"></div>

            {/* Post Body - Placeholder for actual content */}
            <div className="prose prose-invert prose-purple max-w-none">
              {/* The Moment */}
              {post.moment ? (
                <section className="mb-10">
                  <h2 className="text-xl font-semibold text-purple-400 mb-4 flex items-center gap-2">
                    <span>🎬</span> The Moment
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed italic">
                    {post.moment}
                  </p>
                </section>
              ) : (
                <section className="mb-10">
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6 text-center">
                    <p className="text-muted-foreground">
                      Full story coming soon...
                    </p>
                    <p className="text-sm text-muted-foreground/70 mt-2">
                      Core focus: {post.coreFocus}
                    </p>
                  </div>
                </section>
              )}

              {/* What Happened */}
              {post.whatHappened && (
                <section className="mb-10">
                  <h2 className="text-xl font-semibold text-purple-400 mb-4 flex items-center gap-2">
                    <span>⚠️</span> What Happened
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {post.whatHappened}
                  </p>
                </section>
              )}

              {/* The Realization */}
              {post.realization && (
                <section className="mb-10">
                  <h2 className="text-xl font-semibold text-purple-400 mb-4 flex items-center gap-2">
                    <span>🧠</span> The Realization
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {post.realization}
                  </p>
                </section>
              )}

              {/* What Changed */}
              {post.whatChanged && (
                <section className="mb-10">
                  <h2 className="text-xl font-semibold text-purple-400 mb-4 flex items-center gap-2">
                    <span>🛠️</span> What Changed After
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {post.whatChanged}
                  </p>
                </section>
              )}

              {/* Takeaway */}
              {post.takeaway && (
                <section className="mb-10">
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/20">
                    <h2 className="text-lg font-semibold text-purple-400 mb-2 flex items-center gap-2">
                      <span>🎯</span> Takeaway
                    </h2>
                    <p className="text-xl font-medium">
                      "{post.takeaway}"
                    </p>
                  </div>
                </section>
              )}
            </div>

            {/* Navigation */}
            <div className="mt-16 pt-8 border-t border-border/50">
              <div className="flex justify-between items-center gap-4">
                {prevPost ? (
                  <Link
                    to={`/dj/journey/${prevPost.id}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-purple-400 transition-colors group flex-1"
                  >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <div className="text-left">
                      <p className="text-xs text-muted-foreground">Previous</p>
                      <p className="font-medium truncate">#{prevPost.number} {prevPost.title}</p>
                    </div>
                  </Link>
                ) : (
                  <div className="flex-1" />
                )}

                {nextPost ? (
                  <Link
                    to={`/dj/journey/${nextPost.id}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-purple-400 transition-colors group flex-1 justify-end"
                  >
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Next</p>
                      <p className="font-medium truncate">#{nextPost.number} {nextPost.title}</p>
                    </div>
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <div className="flex-1" />
                )}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default DJJourneyPost;
