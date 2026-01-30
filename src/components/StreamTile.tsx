import { useRef, useEffect, useState } from 'react';
import { X, Volume2, VolumeX, Play, Pause, Maximize2 } from 'lucide-react';
import { Stream, useCommandCenterStore } from '@/stores/commandCenterStore';
import { cn } from '@/lib/utils';

interface StreamTileProps {
  stream: Stream;
  isCompact?: boolean;
}

export const StreamTile = ({ stream, isCompact = false }: StreamTileProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const {
    mainStreamId,
    audioStreamId,
    setMainStream,
    removeStream,
    toggleMute,
    setAudioStream,
    togglePlayPause,
  } = useCommandCenterStore();

  const isMain = stream.id === mainStreamId;
  const isAudioActive = stream.id === audioStreamId && !stream.isMuted;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = stream.isMuted;
      videoRef.current.volume = stream.volume / 100;
      
      if (stream.isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [stream.isMuted, stream.volume, stream.isPlaying]);

  const handleTileClick = () => {
    setMainStream(stream.id);
  };

  const handleAudioClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (stream.isMuted) {
      setAudioStream(stream.id);
    } else {
      toggleMute(stream.id);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeStream(stream.id);
  };

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePlayPause(stream.id);
  };

  return (
    <div
      className={cn(
        'stream-tile cursor-pointer group',
        isMain && 'stream-tile-main',
        stream.hasAction && 'stream-tile-action',
        isAudioActive && 'stream-tile-audio',
        isCompact && 'h-28'
      )}
      onClick={handleTileClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video */}
      <div className="aspect-video-fixed bg-black relative">
        <video
          ref={videoRef}
          src={stream.url}
          className="w-full h-full object-cover"
          loop
          playsInline
          autoPlay
          muted={stream.isMuted}
        />

        {/* Loading State */}
        {stream.isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="w-8 h-8 border-2 border-[hsl(var(--loading-amber))] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Action Badge */}
        {stream.hasAction && (
          <div className="action-badge">
            ⚽ ACTION
          </div>
        )}

        {/* Top Right Controls */}
        <div className={cn(
          'absolute top-3 right-3 flex items-center gap-2 transition-opacity duration-200',
          isHovered || isMain ? 'opacity-100' : 'opacity-0'
        )}>
          <button
            onClick={handleRemove}
            className="w-7 h-7 rounded-full bg-black/60 hover:bg-destructive flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3">
          {/* Match Info */}
          {!isCompact && (
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="live-badge">LIVE</span>
                <span className="text-xs text-muted-foreground">{stream.matchTime}</span>
              </div>
              {isAudioActive && <div className="audio-indicator" />}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className={cn(isCompact && 'text-xs')}>
              <div className="font-semibold text-sm leading-tight">
                {stream.teamA} <span className="text-primary">{stream.score}</span> {stream.teamB}
              </div>
            </div>

            {/* Audio/Play Controls */}
            <div className={cn(
              'flex items-center gap-1 transition-opacity duration-200',
              isHovered || isMain ? 'opacity-100' : 'opacity-0'
            )}>
              <button
                onClick={handlePlayPause}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                {stream.isPlaying ? (
                  <Pause className="w-3.5 h-3.5" />
                ) : (
                  <Play className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={handleAudioClick}
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center transition-colors',
                  isAudioActive 
                    ? 'bg-[hsl(var(--audio-green))] hover:bg-[hsl(var(--audio-green-glow))]'
                    : 'bg-white/10 hover:bg-white/20'
                )}
              >
                {stream.isMuted ? (
                  <VolumeX className="w-3.5 h-3.5" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>
              {isMain && (
                <button
                  className="w-7 h-7 rounded-full bg-primary/20 hover:bg-primary/30 flex items-center justify-center transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Indicator */}
        {isMain && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
            MAIN
          </div>
        )}
      </div>
    </div>
  );
};
