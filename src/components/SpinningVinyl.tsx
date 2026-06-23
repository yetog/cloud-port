import { cn } from "@/lib/utils";

interface SpinningVinylProps {
  isPlaying: boolean;
  coverUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-48 h-48',
};

const labelSizes = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const SpinningVinyl = ({
  isPlaying,
  coverUrl,
  size = 'lg',
  className
}: SpinningVinylProps) => {
  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {/* Vinyl Record */}
      <div
        className={cn(
          "absolute inset-0 rounded-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 shadow-2xl",
          isPlaying && "animate-spin-slow"
        )}
        style={{
          animationDuration: '3s',
        }}
      >
        {/* Grooves */}
        <div className="absolute inset-2 rounded-full border border-zinc-700/30" />
        <div className="absolute inset-4 rounded-full border border-zinc-700/20" />
        <div className="absolute inset-6 rounded-full border border-zinc-700/30" />
        <div className="absolute inset-8 rounded-full border border-zinc-700/20" />

        {/* Shine effect */}
        <div
          className="absolute inset-0 rounded-full opacity-20"
          style={{
            background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
          }}
        />

        {/* Center Label */}
        <div
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden",
            "bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center",
            labelSizes[size]
          )}
        >
          {coverUrl ? (
            <img
              src={coverUrl}
              alt="Album art"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-2 h-2 rounded-full bg-zinc-900" />
          )}
        </div>

        {/* Center hole */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-zinc-900" />
      </div>

      {/* Glow effect when playing */}
      {isPlaying && (
        <div
          className="absolute inset-0 rounded-full opacity-30 blur-xl -z-10"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)',
          }}
        />
      )}
    </div>
  );
};

export default SpinningVinyl;
