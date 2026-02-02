import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useSound } from '@/contexts/SoundContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { playToggle } = useSound();
  
  const handleToggle = () => {
    playToggle();
    toggleTheme();
  };
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={handleToggle}
          className="p-2 rounded-lg transition-all border border-transparent hover:border-primary/20 hover:bg-primary/10 focus-glow"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
          ) : (
            <Moon className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ThemeToggle;
