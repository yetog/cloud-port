import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Headphones, Clock, Volume2, VolumeX } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { djMixes, djProfile, vibeColors, DJMix } from '../data/dj';

const MixPlayer = ({
  currentMix,
  isPlaying,
  onPlayPause,
  audioRef,
}: {
  currentMix: DJMix | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}) => {
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const percent = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(percent) ? 0 : percent);

      const mins = Math.floor(audio.currentTime / 60);
      const secs = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
      setCurrentTime(`${mins}:${secs}`);
    };

    audio.addEventListener('timeupdate', updateProgress);
    return () => audio.removeEventListener('timeupdate', updateProgress);
  }, [audioRef]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted, audioRef]);

  const handleSeek = (value: number[]) => {
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (value[0] / 100) * audioRef.current.duration;
      setProgress(value[0]);
    }
  };

  if (!currentMix) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border/50 p-4 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Mix Info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            {currentMix.coverUrl ? (
              <img src={currentMix.coverUrl} alt={currentMix.title} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Headphones className="w-8 h-8 text-purple-400" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold truncate">{currentMix.title}</p>
            <p className="text-sm text-muted-foreground truncate">{djProfile.name}</p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <button
            onClick={onPlayPause}
            className="p-3 bg-white text-black rounded-full hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full max-w-md">
            <span className="text-xs text-muted-foreground w-10 text-right">{currentTime}</span>
            <Slider
              value={[progress]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-10">{currentMix.duration}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-full hover:bg-muted/50 transition-colors"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <Slider
            value={[isMuted ? 0 : volume]}
            onValueChange={(value) => {
              setVolume(value[0]);
              setIsMuted(false);
            }}
            max={100}
            step={1}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

const DJMixes = () => {
  const [currentMix, setCurrentMix] = useState<DJMix | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleMixSelect = (mix: DJMix) => {
    if (currentMix?.id === mix.id) {
      handlePlayPause();
    } else {
      setCurrentMix(mix);
      setIsPlaying(true);
    }
  };

  const handlePlayPause = () => {
    if (!currentMix && djMixes.length > 0) {
      setCurrentMix(djMixes[0]);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (audioRef.current && currentMix?.audioUrl) {
      audioRef.current.src = currentMix.audioUrl;
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          // Handle autoplay restrictions
          setIsPlaying(false);
        });
      }
    }
  }, [currentMix]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 relative overflow-hidden pb-32">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} />

      {/* Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-4 pt-8 pb-12">
          <Link to="/dj" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft size={20} />
            <span>Back to DJ</span>
          </Link>

          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Mixes
            </h1>
            <p className="text-xl text-muted-foreground">
              Curated sets for every vibe. House, funk, soul, and everything in between.
            </p>
          </div>
        </div>

        {/* Mixes Grid */}
        <div className="container mx-auto px-4 pb-20">
          <div className="max-w-4xl mx-auto space-y-4">
            {djMixes.map((mix) => (
              <button
                key={mix.id}
                onClick={() => handleMixSelect(mix)}
                className={`w-full bg-background/50 backdrop-blur-sm border rounded-2xl p-6 text-left transition-all hover:border-purple-500/30 ${
                  currentMix?.id === mix.id ? 'border-purple-500/50 bg-purple-500/5' : 'border-border/50'
                }`}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Cover */}
                  <div className="w-full md:w-32 h-32 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl flex items-center justify-center flex-shrink-0 relative group">
                    {mix.coverUrl ? (
                      <img src={mix.coverUrl} alt={mix.title} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <Headphones className="w-12 h-12 text-purple-400" />
                    )}
                    <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {currentMix?.id === mix.id && isPlaying ? (
                        <Pause className="w-10 h-10 text-white" />
                      ) : (
                        <Play className="w-10 h-10 text-white ml-1" />
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${vibeColors[mix.vibe]}`}>
                        {mix.vibe}
                      </span>
                      {mix.featured && (
                        <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-1">{mix.title}</h3>
                    <p className="text-muted-foreground mb-3">{mix.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {mix.duration}
                      </span>
                      {mix.recordedAt && (
                        <span>Recorded at {mix.recordedAt}</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {djMixes.length === 0 && (
              <div className="text-center py-20">
                <Headphones className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Mixes Coming Soon</h3>
                <p className="text-muted-foreground">
                  New mixes are being uploaded. Check back soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mix Player */}
      <MixPlayer
        currentMix={currentMix}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        audioRef={audioRef}
      />
    </div>
  );
};

export default DJMixes;
