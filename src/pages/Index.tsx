import Sidebar from '../components/Sidebar';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Apps from '../components/Apps';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { useSidebarContext } from '@/contexts/SidebarContext';

const Index = () => {
  const { isCollapsed, toggleCollapse } = useSidebarContext();

  return (
    <div className="min-h-screen">
      {/* Skip Link for Keyboard Users */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Sidebar />

      {/* Backdrop overlay when sidebar is expanded */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-300 hidden md:block ${
          isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        onClick={toggleCollapse}
        aria-hidden="true"
      />

      <main
        id="main-content"
        className="flex-1 transition-all duration-300 md:ml-16"
        role="main"
        aria-label="Main content"
      >
        <Hero />
        <About />
        <Apps />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </div>
  );
};

export default Index;
