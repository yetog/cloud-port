import { useParams, Link, Navigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Clock, Tag, User, ChevronLeft, ChevronRight,
  BookOpen
} from 'lucide-react';
import { getPostById, blogPosts, blogCategories } from '../data/blog';

const BlogPost = () => {
  const { postId } = useParams<{ postId: string }>();
  const post = postId ? getPostById(postId) : undefined;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const categoryInfo = blogCategories.find(c => c.id === post.category);

  // Find adjacent posts for navigation
  const currentIndex = blogPosts.findIndex(p => p.id === post.id);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        {/* Header Navigation */}
        <div className="container mx-auto px-4 pt-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft size={20} />
            <span>Back to Blog</span>
          </Link>
        </div>

        {/* Article */}
        <article className="container mx-auto px-4 pb-20">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <header className="mb-12">
              {/* Category */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-sm px-3 py-1 rounded-full ${categoryInfo?.color} text-white`}>
                  {categoryInfo?.title}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-xl text-muted-foreground mb-6">
                {post.excerpt}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
              </div>
            </header>

            {/* Featured Image */}
            {post.image ? (
              <div className="mb-12 rounded-2xl overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-auto" />
              </div>
            ) : (
              <div className="mb-12 h-64 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-primary/30" />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-invert prose-lg max-w-none">
              <div
                className="text-foreground leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{
                  __html: post.content
                    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-foreground mt-12 mb-6">$1</h1>')
                    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-foreground mt-10 mb-4">$1</h2>')
                    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-foreground mt-8 mb-3">$1</h3>')
                    .replace(/^- (.+)$/gm, '<li class="text-muted-foreground ml-4">$1</li>')
                    .replace(/^(\d+)\. (.+)$/gm, '<li class="text-muted-foreground ml-4"><span class="text-primary font-medium">$1.</span> $2</li>')
                    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>')
                    .replace(/\n\n/g, '</p><p class="text-muted-foreground">')
                    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-muted/30 p-4 rounded-lg overflow-x-auto my-6"><code class="text-sm text-foreground">$2</code></pre>')
                }}
              />
            </div>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-border/50">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-muted-foreground" />
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-sm px-3 py-1 bg-muted/50 rounded-full text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <nav className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
              {prevPost && (
                <Link
                  to={`/blog/${prevPost.id}`}
                  className="ff7-panel p-4 rounded-xl hover:border-primary/50 transition-colors group"
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </div>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {prevPost.title}
                  </p>
                </Link>
              )}
              {nextPost && (
                <Link
                  to={`/blog/${nextPost.id}`}
                  className="ff7-panel p-4 rounded-xl hover:border-primary/50 transition-colors group md:text-right md:ml-auto"
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 md:justify-end">
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {nextPost.title}
                  </p>
                </Link>
              )}
            </nav>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
