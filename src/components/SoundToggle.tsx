import { Volume2, VolumeX } from 'lucide-react';
import { useSound } from '@/contexts/SoundContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const SoundToggle = () => {
  const { settings, toggleSound, playToggle } = useSound();
  
  const handleToggle = () => {
    toggleSound();
    if (!settings.enabled) {
      // Play sound when turning ON (after state update)
      setTimeout(() => playToggle(), 50);
    }
  };
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={handleToggle}
          className="p-2 rounded-lg transition-all border border-transparent hover:border-primary/20 hover:bg-primary/10 focus-glow"
          aria-label={`Turn sound ${settings.enabled ? 'off' : 'on'}`}
        >
          {settings.enabled ? (
            <Volume2 className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
          ) : (
            <VolumeX className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>Sound {settings.enabled ? 'on' : 'off'}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default SoundToggle;
