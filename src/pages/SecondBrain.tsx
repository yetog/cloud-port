import { Brain, ExternalLink, Search } from 'lucide-react';
import { knowledgeCategories } from '@/data/knowledgeBase';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

const SecondBrain = () => {
  const totalArticles = knowledgeCategories.reduce((sum, cat) => sum + cat.articleCount, 0);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      
      <main className="flex-1 md:ml-64">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center items-center px-6 py-20">
          <div className="max-w-6xl w-full mx-auto text-center">
            <div className="mb-8 flex justify-center">
              <div className="glass-panel p-6 rounded-full">
                <Brain size={64} className="text-primary" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              My 2nd Brain
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              A curated collection of knowledge across tech, business, philosophy, and life
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <div className="glass-panel px-6 py-3 rounded-lg">
                <span className="text-primary font-bold text-2xl">{totalArticles}+</span>
                <span className="text-muted-foreground ml-2">Articles</span>
              </div>
              <div className="glass-panel px-6 py-3 rounded-lg">
                <span className="text-primary font-bold text-2xl">{knowledgeCategories.length}</span>
                <span className="text-muted-foreground ml-2">Categories</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-16">
              <div className="glass-panel p-4 rounded-lg flex items-center gap-3">
                <Search size={20} className="text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search across all knowledge..."
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                  disabled
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Search coming soon</p>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {knowledgeCategories.map((category) => (
                <a
                  key={category.id}
                  href={category.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-panel p-6 rounded-lg transition-all duration-300 hover:scale-105 hover:bg-white/10 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="glass-panel p-3 rounded-lg">
                      <category.icon size={32} className="text-primary" />
                    </div>
                    <ExternalLink size={20} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="text-primary font-semibold">{category.articleCount}</span>
                    <span>articles</span>
                  </div>
                </a>
              ))}
            </div>

            {/* Full Archive Link */}
            <div className="glass-panel p-6 rounded-lg">
              <a
                href="https://zaylegend.com/knowledge-base"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
              >
                Browse Complete Knowledge Base
                <ExternalLink size={20} />
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
};

export default SecondBrain;
