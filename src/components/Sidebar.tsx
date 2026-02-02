import { useState, useEffect } from 'react';
import { Menu, User, AppWindow, FolderOpen, Music, Mail as MailIcon, Github, Linkedin, Twitter, ChevronLeft, ChevronRight, Briefcase, BookOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import SoundToggle from './SoundToggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useSound } from '@/contexts/SoundContext';
import { useSidebarContext } from '@/contexts/SidebarContext';

interface NavLink {
  name: string;
  href: string;
  icon: React.ReactNode;
  isRoute?: boolean;
}

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const { playClick, playToggle } = useSound();
  const { isCollapsed, toggleCollapse } = useSidebarContext();

  const isHomePage = location.pathname === '/';

  const navLinks: NavLink[] = [
    { name: 'About', href: '#about', icon: <User size={20} /> },
    { name: 'Apps', href: '#apps', icon: <AppWindow size={20} /> },
    { name: 'Projects', href: '#projects', icon: <FolderOpen size={20} /> },
    { name: 'Services', href: '/services', icon: <Briefcase size={20} />, isRoute: true },
    { name: 'Blog', href: '/blog', icon: <BookOpen size={20} />, isRoute: true },
    { name: 'Music', href: '/music', icon: <Music size={20} />, isRoute: true },
    { name: 'Contact', href: '#contact', icon: <MailIcon size={20} /> },
  ];

  const socialLinks = [
    { name: 'GitHub', icon: <Github size={18} />, url: 'https://github.com/yetog' },
    { name: 'LinkedIn', icon: <Linkedin size={18} />, url: 'https://linkedin.com/in/' },
    { name: 'Twitter', icon: <Twitter size={18} />, url: 'https://twitter.com/' },
  ];

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  const handleCollapseToggle = () => {
    playToggle();
    toggleCollapse();
  };

  const handleMobileMenuToggle = () => {
    playToggle();
    setIsOpen(!isOpen);
  };

  // For hash links, prefix with "/" if not on home page
  const getHref = (link: NavLink) => {
    if (link.isRoute) return link.href;
    return isHomePage ? link.href : `/${link.href}`;
  };

  const NavItem = ({ link }: { link: NavLink }) => {
    const isActive = link.isRoute
      ? location.pathname === link.href
      : activeSection === link.href.substring(1);

    const handleClick = () => {
      playClick();
      setIsOpen(false);
    };

    const linkContent = (
      <div
        className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer hover-lift
                  ${isCollapsed ? 'justify-center' : 'justify-start'}
                  ${isActive
                    ? 'bg-primary/20 text-primary border border-primary/40'
                    : 'text-muted-foreground hover:bg-primary/10 hover:text-foreground border border-transparent'}`}
        style={isActive ? { boxShadow: '0 0 15px hsl(var(--primary) / 0.2)' } : {}}
      >
        <span className="flex-shrink-0">{link.icon}</span>
        {!isCollapsed && <span className="hidden md:block">{link.name}</span>}
      </div>
    );

    // Wrap in tooltip for collapsed view
    const tooltipWrapped = (
      <Tooltip>
        <TooltipTrigger asChild>
          {link.isRoute ? (
            <Link to={link.href} onClick={handleClick}>
              {linkContent}
            </Link>
          ) : (
            <a href={getHref(link)} onClick={handleClick}>
              {linkContent}
            </a>
          )}
        </TooltipTrigger>
        <TooltipContent side="right" className={isCollapsed ? '' : 'md:hidden'}>
          {link.name}
        </TooltipContent>
      </Tooltip>
    );

    return <li>{tooltipWrapped}</li>;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-4 right-4 z-50 md:hidden">
        <button
          onClick={handleMobileMenuToggle}
          className="p-2 ff7-panel"
          aria-label="Toggle menu"
        >
          <Menu size={24} className="text-primary" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed z-40 h-screen backdrop-blur-lg border-r transition-all duration-300
                   ${isCollapsed ? 'w-16' : 'w-64'} left-0
                   ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        style={{
          background: 'hsl(var(--card) / 0.95)',
          borderColor: 'hsl(var(--primary) / 0.2)',
        }}
      >
        {/* Collapse Toggle Button - Desktop Only */}
        <button
          onClick={handleCollapseToggle}
          className="hidden md:flex absolute -right-3 top-20 w-6 h-6 bg-card border border-primary/30 rounded-full items-center justify-center hover:bg-primary/20 transition-colors z-50"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight size={14} className="text-primary" />
          ) : (
            <ChevronLeft size={14} className="text-primary" />
          )}
        </button>

        <div className="flex flex-col h-full p-4">
          {/* Branding */}
          <div className={`mb-8 text-center ${isCollapsed ? 'px-0' : ''}`}>
            <Link to="/" className="block" onClick={() => playClick()}>
              {!isCollapsed ? (
                <>
                  <h2 className="font-bold text-lg md:text-xl tracking-tight hidden md:block text-foreground text-glow hover:text-primary transition-colors">
                    Isayah Young-Burke
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1 hidden md:block">
                    Infrastructure & AI Consultant
                  </p>
                </>
              ) : null}
              <div className={`w-10 h-10 mx-auto rounded-lg bg-primary/20 flex items-center justify-center ${isCollapsed ? '' : 'md:hidden'}`}>
                <span className="text-primary font-bold text-lg">IY</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <NavItem key={link.name} link={link} />
              ))}
            </ul>
          </nav>

          {/* Separator */}
          <div className="h-px bg-border/50 my-4" />

          {/* Social Links */}
          <div className={`flex items-center justify-center gap-3 mb-4 ${isCollapsed ? 'flex-col' : ''}`}>
            {socialLinks.map((link) => (
              <Tooltip key={link.name}>
                <TooltipTrigger asChild>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    aria-label={link.name}
                    onClick={() => playClick()}
                  >
                    {link.icon}
                  </a>
                </TooltipTrigger>
                <TooltipContent side={isCollapsed ? 'right' : 'top'}>
                  {link.name}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Theme and Sound Toggles */}
          <div className={`flex items-center justify-center gap-2 mb-4 ${isCollapsed ? 'flex-col' : ''}`}>
            <ThemeToggle />
            <SoundToggle />
          </div>

          {/* Copyright */}
          {!isCollapsed && (
            <div className="mt-auto text-center hidden md:block">
              <p className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} Isayah Young-Burke
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
