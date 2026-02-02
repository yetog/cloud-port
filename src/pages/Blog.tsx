import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Clock, Tag, BookOpen, ChevronRight,
  Search, Sparkles
} from 'lucide-react';
import { blogPosts, blogCategories, BlogPost, getPostsByCategory } from '../data/blog';

const PostCard = ({ post, featured = false }: { post: BlogPost; featured?: boolean }) => {
  const categoryInfo = blogCategories.find(c => c.id === post.category);

  return (
    <article
      className={`ff7-panel rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 group ${
        featured ? 'md:col-span-2' : ''
      }`}
    >
      <Link
        to={`/blog/${post.id}`}
        className="block"
        aria-label={`Read article: ${post.title}`}
      >
      {/* Image placeholder */}
      {post.image ? (
        <div className="h-48 bg-gradient-to-br from-primary/20 to-purple-500/20 overflow-hidden">
          <img src={post.image} alt="" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center" aria-hidden="true">
          <BookOpen className="w-12 h-12 text-primary/50" />
        </div>
      )}

      <div className="p-6">
        {/* Category Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs px-2 py-1 rounded-full ${categoryInfo?.color} text-white`}>
            {categoryInfo?.title}
          </span>
          {post.featured && (
            <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(post.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs px-2 py-1 bg-muted/50 rounded-full text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        {/* Read More */}
        <div className="flex items-center gap-1 mt-4 text-primary text-sm font-medium group-hover:gap-2 transition-all" aria-hidden="true">
          Read More
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
      </Link>
    </article>
  );
};

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = getPostsByCategory(selectedCategory).filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Skip Link */}
      <a href="#blog-content" className="skip-link">
        Skip to blog posts
      </a>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <main className="relative z-10" id="blog-content" role="main" aria-label="Blog page">
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
              <BookOpen className="w-10 h-10 text-primary" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground text-glow">
              Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Insights, tutorials, and thoughts on cloud infrastructure, AI, and creative technology.
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="container mx-auto px-4 mb-12">
          <div className="max-w-6xl mx-auto">
            {/* Search */}
            <div className="relative mb-6" role="search">
              <label htmlFor="blog-search" className="sr-only">Search articles</label>
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
              <input
                id="blog-search"
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-muted/30 border border-border/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors min-h-[44px]"
                aria-describedby="search-results-count"
              />
              <span id="search-results-count" className="sr-only" aria-live="polite">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'result' : 'results'} found
              </span>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {blogCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all min-h-[44px] ${
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                  aria-pressed={selectedCategory === category.id}
                  aria-label={`Filter by ${category.title}`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        {selectedCategory === 'all' && featuredPosts.length > 0 && searchQuery === '' && (
          <div className="container mx-auto px-4 mb-12">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-primary" />
                Featured
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredPosts.map(post => (
                  <PostCard key={post.id} post={post} featured />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* All Posts */}
        <div className="container mx-auto px-4 pb-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Tag className="w-6 h-6 text-primary" />
              {selectedCategory === 'all' ? 'All Posts' : blogCategories.find(c => c.id === selectedCategory)?.title}
              <span className="text-sm font-normal text-muted-foreground">
                ({filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'})
              </span>
            </h2>

            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Blog;
