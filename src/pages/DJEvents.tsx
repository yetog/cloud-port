import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Star, Play, Camera, ChevronLeft, ChevronRight, X, Headphones, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { djEvents, getEventMix, DJEvent, DJMix } from '../data/dj';
import SpinningVinyl from '../components/SpinningVinyl';

// Photo Gallery Modal Component
const PhotoGallery = ({
  photos,
  isOpen,
  onClose,
  currentIndex,
  setCurrentIndex,
  eventName
}: {
  photos: string[];
  isOpen: boolean;
  onClose: () => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  eventName: string;
}) => {
  if (!isOpen || photos.length === 0) return null;

  const next = () => setCurrentIndex((currentIndex + 1) % photos.length);
  const prev = () => setCurrentIndex((currentIndex - 1 + photos.length) % photos.length);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
      >
        <X size={32} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
      >
        <ChevronLeft size={32} className="text-white" />
      </button>

      <div className="max-w-5xl max-h-[80vh] px-16" onClick={(e) => e.stopPropagation()}>
        <img
          src={photos[currentIndex]}
          alt={`${eventName} photo ${currentIndex + 1}`}
          className="max-w-full max-h-[80vh] object-contain rounded-lg"
        />
        <p className="text-center text-white/60 mt-4">
          {currentIndex + 1} / {photos.length}
        </p>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
      >
        <ChevronRight size={32} className="text-white" />
      </button>
    </div>
  );
};

// Event Card with Mix Preview
const EventCard = ({ event, onOpenGallery }: { event: DJEvent; onOpenGallery: (photos: string[], index: number, name: string) => void }) => {
  const linkedMix = getEventMix(event);
  const hasPhotos = event.photos && event.photos.length > 0;
  const hasVideo = !!event.videoUrl;

  return (
    <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all group">
      {/* Main Image / Video Section */}
      <div className="relative">
        <div className="w-full h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center overflow-hidden">
          {hasVideo ? (
            <video
              src={event.videoUrl}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
              poster={event.imageUrl}
            />
          ) : event.imageUrl ? (
            <img src={event.imageUrl} alt={event.venue} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <Calendar className="w-20 h-20 text-purple-400/50" />
          )}

          {/* Play overlay for video */}
          {hasVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Play className="w-8 h-8 text-white" />
              </div>
            </div>
          )}

          {/* Photo count badge */}
          {hasPhotos && (
            <button
              onClick={() => onOpenGallery(event.photos!, 0, event.venue)}
              className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm hover:bg-black/80 transition-colors"
            >
              <Camera size={16} />
              {event.photos!.length} photos
            </button>
          )}

          {/* Event type badge */}
          <div className="absolute top-4 left-4">
            <span className="text-xs px-3 py-1.5 bg-purple-600/90 backdrop-blur-sm text-white rounded-full font-medium">
              {event.type}
            </span>
          </div>
        </div>

        {/* Photo thumbnails strip */}
        {hasPhotos && event.photos!.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex gap-2 overflow-x-auto">
              {event.photos!.slice(0, 4).map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => onOpenGallery(event.photos!, idx, event.venue)}
                  className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ring-2 ring-white/20 hover:ring-purple-400 transition-all"
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
              {event.photos!.length > 4 && (
                <button
                  onClick={() => onOpenGallery(event.photos!, 4, event.venue)}
                  className="w-12 h-12 rounded-lg bg-black/60 flex items-center justify-center flex-shrink-0 text-white text-xs font-medium"
                >
                  +{event.photos!.length - 4}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin size={14} className="text-purple-400" />
            {event.location}
          </span>
          {event.date && (
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar size={14} className="text-purple-400" />
              {event.date}
            </span>
          )}
        </div>

        <h3 className="text-2xl font-bold mb-3">{event.venue}</h3>
        <p className="text-muted-foreground mb-4">{event.description}</p>

        {/* Highlights */}
        {event.highlights && event.highlights.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {event.highlights.map((highlight, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 bg-purple-500/10 text-purple-400 rounded-full flex items-center gap-1"
                >
                  <Sparkles size={10} />
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Linked Mix Section */}
        {linkedMix && (
          <div className="mt-4 p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
            <div className="flex items-center gap-4">
              <SpinningVinyl
                isPlaying={false}
                coverUrl={linkedMix.coverUrl}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-purple-400 mb-1 flex items-center gap-1">
                  <Headphones size={12} />
                  Mix from this night
                </p>
                <p className="font-semibold truncate">{linkedMix.title}</p>
                <p className="text-sm text-muted-foreground">{linkedMix.duration}</p>
              </div>
              <Link to="/dj/mixes">
                <Button size="sm" variant="outline" className="border-purple-500/50 hover:bg-purple-500/10">
                  <Play size={14} className="mr-1" />
                  Listen
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Placeholder card for when no photos exist yet
const PlaceholderEventCard = ({ event }: { event: DJEvent }) => {
  const linkedMix = getEventMix(event);

  return (
    <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all group">
      {/* Placeholder Image */}
      <div className="relative">
        <div className="w-full h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex flex-col items-center justify-center">
          {event.imageUrl ? (
            <img src={event.imageUrl} alt={event.venue} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <>
              <Camera className="w-16 h-16 text-purple-400/30 mb-3" />
              <p className="text-sm text-muted-foreground">Photos coming soon</p>
            </>
          )}

          {/* Event type badge */}
          <div className="absolute top-4 left-4">
            <span className="text-xs px-3 py-1.5 bg-purple-600/90 backdrop-blur-sm text-white rounded-full font-medium">
              {event.type}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin size={14} className="text-purple-400" />
            {event.location}
          </span>
          {event.date && (
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar size={14} className="text-purple-400" />
              {event.date}
            </span>
          )}
        </div>

        <h3 className="text-2xl font-bold mb-3">{event.venue}</h3>
        <p className="text-muted-foreground mb-4">{event.description}</p>

        {/* Highlights */}
        {event.highlights && event.highlights.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {event.highlights.map((highlight, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 bg-purple-500/10 text-purple-400 rounded-full flex items-center gap-1"
                >
                  <Sparkles size={10} />
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Linked Mix Section */}
        {linkedMix && (
          <div className="mt-4 p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
            <div className="flex items-center gap-4">
              <SpinningVinyl
                isPlaying={false}
                coverUrl={linkedMix.coverUrl}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-purple-400 mb-1 flex items-center gap-1">
                  <Headphones size={12} />
                  Mix from this night
                </p>
                <p className="font-semibold truncate">{linkedMix.title}</p>
                <p className="text-sm text-muted-foreground">{linkedMix.duration}</p>
              </div>
              <Link to="/dj/mixes">
                <Button size="sm" variant="outline" className="border-purple-500/50 hover:bg-purple-500/10">
                  <Play size={14} className="mr-1" />
                  Listen
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DJEvents = () => {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryEventName, setGalleryEventName] = useState('');

  const openGallery = (photos: string[], index: number, eventName: string) => {
    setGalleryPhotos(photos);
    setGalleryIndex(index);
    setGalleryEventName(eventName);
    setGalleryOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 relative overflow-hidden">
      {/* Photo Gallery Modal */}
      <PhotoGallery
        photos={galleryPhotos}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        currentIndex={galleryIndex}
        setCurrentIndex={setGalleryIndex}
        eventName={galleryEventName}
      />

      {/* Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
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
              Events & Experience
            </h1>
            <p className="text-xl text-muted-foreground">
              From residencies to private events. Building the vibe, one set at a time.
            </p>
          </div>
        </div>

        {/* Events Grid */}
        <div className="container mx-auto px-4 pb-20">
          <div className="max-w-5xl mx-auto space-y-8">
            {djEvents.map((event) => (
              event.photos && event.photos.length > 0 ? (
                <EventCard
                  key={event.id}
                  event={event}
                  onOpenGallery={openGallery}
                />
              ) : (
                <PlaceholderEventCard key={event.id} event={event} />
              )
            ))}

            {/* What I Bring Section */}
            <div className="mt-12 bg-background/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Star className="w-6 h-6 text-purple-400" />
                What I Bring
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 text-purple-400">Vibes</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Soulful house & deep grooves</li>
                    <li>Funk-driven energy</li>
                    <li>Smooth transitions</li>
                    <li>Crowd-reading adaptability</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-purple-400">Setup</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>CDJ / Controller ready</li>
                    <li>USB & streaming compatible</li>
                    <li>Backup systems in place</li>
                    <li>Professional approach</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center pt-8">
              <p className="text-muted-foreground mb-4">Want me at your next event?</p>
              <Link
                to="/dj/booking"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full transition-colors"
              >
                Book Me
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DJEvents;
