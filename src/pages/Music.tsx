import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Shuffle, Repeat, Music2, Disc3, ExternalLink, ArrowLeft,
  ListMusic, Clock, Calendar
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { musicProjects, artistInfo, Track, MusicProject } from '../data/music';

const MusicPlayer = ({
  currentTrack,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onShuffle,
  shuffle,
  repeat,
  onRepeat
}: {
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onShuffle: () => void;
  shuffle: boolean;
  repeat: boolean;
  onRepeat: () => void;
}) => {
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border/50 p-4 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Disc3 className="w-8 h-8 text-purple-400 animate-spin-slow" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold truncate">{currentTrack?.title || 'No track selected'}</p>
            <p className="text-sm text-muted-foreground truncate">{currentTrack?.artist || 'Select a track to play'}</p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="flex items-center gap-4">
            <button
              onClick={onShuffle}
              className={`p-2 rounded-full hover:bg-muted/50 transition-colors ${shuffle ? 'text-purple-400' : 'text-muted-foreground'}`}
            >
              <Shuffle size={18} />
            </button>
            <button
              onClick={onPrevious}
              className="p-2 rounded-full hover:bg-muted/50 transition-colors"
            >
              <SkipBack size={20} />
            </button>
            <button
              onClick={onPlayPause}
              className="p-3 bg-white text-black rounded-full hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </button>
            <button
              onClick={onNext}
              className="p-2 rounded-full hover:bg-muted/50 transition-colors"
            >
              <SkipForward size={20} />
            </button>
            <button
              onClick={onRepeat}
              className={`p-2 rounded-full hover:bg-muted/50 transition-colors ${repeat ? 'text-purple-400' : 'text-muted-foreground'}`}
            >
              <Repeat size={18} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full max-w-md">
            <span className="text-xs text-muted-foreground w-10 text-right">0:00</span>
            <Slider
              value={[progress]}
              onValueChange={(value) => setProgress(value[0])}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-10">{currentTrack?.duration || '0:00'}</span>
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

const ProjectCard = ({
  project,
  onTrackSelect,
  currentTrack
}: {
  project: MusicProject;
  onTrackSelect: (track: Track) => void;
  currentTrack: Track | null;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const typeLabels = {
    album: 'Album',
    ep: 'EP',
    single: 'Single',
    mixtape: 'Mixtape',
    compilation: 'Compilation'
  };

  return (
    <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:border-border transition-all">
      {/* Project Header */}
      <div className="p-6">
        <div className="flex gap-6">
          {/* Cover Art */}
          <div className="w-32 h-32 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
            {project.coverUrl ? (
              <img src={project.coverUrl} alt={project.title} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <Music2 className="w-12 h-12 text-purple-400" />
            )}
          </div>

          {/* Project Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">
                {typeLabels[project.type]}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar size={12} />
                {project.year}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <ListMusic size={14} />
                {project.tracks.length} track{project.tracks.length !== 1 ? 's' : ''}
              </span>

              {/* External Links */}
              {project.links?.spotify && (
                <a href={project.links.spotify} target="_blank" rel="noopener noreferrer"
                   className="text-green-500 hover:text-green-400 transition-colors">
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="border-t border-border/50">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-6 py-3 flex items-center justify-between text-sm text-muted-foreground hover:bg-muted/20 transition-colors"
        >
          <span>View Tracks</span>
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isExpanded && (
          <div className="px-6 pb-4">
            {project.tracks.map((track, index) => (
              <button
                key={track.id}
                onClick={() => onTrackSelect(track)}
                className={`w-full flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors ${
                  currentTrack?.id === track.id ? 'bg-purple-500/20' : ''
                }`}
              >
                <span className="w-6 text-center text-sm text-muted-foreground">{index + 1}</span>
                <div className="flex-1 text-left">
                  <p className={`font-medium ${currentTrack?.id === track.id ? 'text-purple-400' : ''}`}>
                    {track.title}
                  </p>
                  {track.genre && (
                    <p className="text-xs text-muted-foreground">{track.genre}</p>
                  )}
                </div>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock size={12} />
                  {track.duration}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Music = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [allTracks, setAllTracks] = useState<Track[]>([]);

  useEffect(() => {
    // Flatten all tracks from all projects
    const tracks = musicProjects.flatMap(p => p.tracks);
    setAllTracks(tracks);
  }, []);

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    if (!currentTrack && allTracks.length > 0) {
      setCurrentTrack(allTracks[0]);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (!currentTrack || allTracks.length === 0) return;

    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * allTracks.length);
      setCurrentTrack(allTracks[randomIndex]);
    } else {
      const currentIndex = allTracks.findIndex(t => t.id === currentTrack.id);
      const nextIndex = (currentIndex + 1) % allTracks.length;
      setCurrentTrack(allTracks[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (!currentTrack || allTracks.length === 0) return;

    const currentIndex = allTracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? allTracks.length - 1 : currentIndex - 1;
    setCurrentTrack(allTracks[prevIndex]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 relative overflow-hidden pb-32">
      {/* Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-4 pt-8 pb-12">
          {/* Back Link */}
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft size={20} />
            <span>Back to Portfolio</span>
          </Link>

          <div className="max-w-4xl mx-auto text-center">
            {/* Artist Avatar */}
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full flex items-center justify-center">
              <Music2 className="w-16 h-16 text-purple-400" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {artistInfo.name}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              {artistInfo.bio}
            </p>

            {/* Genre Tags */}
            <div className="flex justify-center gap-2 mb-8">
              {artistInfo.genres.map(genre => (
                <span key={genre} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                  {genre}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 text-sm">
              <div className="text-center">
                <p className="text-2xl font-bold">{musicProjects.length}</p>
                <p className="text-muted-foreground">Projects</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{allTracks.length}</p>
                <p className="text-muted-foreground">Tracks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Discography */}
        <div className="container mx-auto px-4 pb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Disc3 className="w-6 h-6 text-purple-400" />
              Discography
            </h2>

            <div className="space-y-6">
              {musicProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onTrackSelect={handleTrackSelect}
                  currentTrack={currentTrack}
                />
              ))}
            </div>

            {musicProjects.length === 0 && (
              <div className="text-center py-20">
                <Music2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground">
                  New music is in the works. Check back soon for updates.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Music Player */}
      <MusicPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onShuffle={() => setShuffle(!shuffle)}
        shuffle={shuffle}
        repeat={repeat}
        onRepeat={() => setRepeat(!repeat)}
      />

      {/* Custom animation for spinning disc */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Music;
