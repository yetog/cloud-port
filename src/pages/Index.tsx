import Sidebar from '../components/Sidebar';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Apps from '../components/Apps';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { useSidebarContext } from '@/contexts/SidebarContext';

const Index = () => {
  const { isCollapsed } = useSidebarContext();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Skip Link for Keyboard Users */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Sidebar />

      <main
        id="main-content"
        className={`flex-1 transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'}`}
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
