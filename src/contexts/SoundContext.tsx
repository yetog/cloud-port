import React, { createContext, useState, useContext, useCallback, ReactNode, useRef, useEffect } from 'react';

interface SoundSettings {
  enabled: boolean;
  volume: number;
}

interface SoundContextType {
  settings: SoundSettings;
  setSettings: (settings: SoundSettings) => void;
  toggleSound: () => void;
  playClick: () => void;
  playToggle: () => void;
  playTransition: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

// Simple beep generator using Web Audio API
const createBeep = (frequency: number, duration: number, volume: number) => {
  if (typeof window === 'undefined') return;
  
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(volume * 0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (e) {
    // Audio not supported or blocked
  }
};

interface SoundProviderProps {
  children: ReactNode;
}

export const SoundProvider: React.FC<SoundProviderProps> = ({ children }) => {
  const [settings, setSettingsState] = useState<SoundSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sound-settings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return { enabled: true, volume: 0.3 };
        }
      }
    }
    return { enabled: true, volume: 0.3 };
  });

  useEffect(() => {
    localStorage.setItem('sound-settings', JSON.stringify(settings));
  }, [settings]);

  const setSettings = useCallback((newSettings: SoundSettings) => {
    setSettingsState(newSettings);
  }, []);

  const toggleSound = useCallback(() => {
    setSettingsState(prev => ({ ...prev, enabled: !prev.enabled }));
  }, []);

  const playClick = useCallback(() => {
    if (settings.enabled) {
      createBeep(800, 0.05, settings.volume);
    }
  }, [settings.enabled, settings.volume]);

  const playToggle = useCallback(() => {
    if (settings.enabled) {
      createBeep(600, 0.08, settings.volume);
      setTimeout(() => createBeep(900, 0.08, settings.volume), 50);
    }
  }, [settings.enabled, settings.volume]);

  const playTransition = useCallback(() => {
    if (settings.enabled) {
      createBeep(400, 0.15, settings.volume * 0.5);
    }
  }, [settings.enabled, settings.volume]);

  return (
    <SoundContext.Provider value={{ settings, setSettings, toggleSound, playClick, playToggle, playTransition }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = (): SoundContextType => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
