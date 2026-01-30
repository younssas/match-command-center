import { useRef, useEffect, useState } from 'react';
import { X, Volume2, VolumeX, Play, Pause, Maximize2, TrendingUp, Target, Users } from 'lucide-react';
import { Stream, useCommandCenterStore } from '@/stores/commandCenterStore';
import { cn } from '@/lib/utils';
import { IntensityMeter } from './IntensityMeter';

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

  const formatMatchTime = (minutes: number) => {
    if (minutes === 45) return "HT";
    if (minutes > 90) return `90+${minutes - 90}'`;
    return `${minutes}'`;
  };

  const getActionLabel = (type?: string) => {
    switch (type) {
      case 'goal': return '⚽ GOAL!';
      case 'shot': return '🎯 SHOT';
      case 'foul': return '⚠️ FOUL';
      case 'corner': return '🚩 CORNER';
      case 'chance': return '🔥 CHANCE';
      default: return '⚽ ACTION';
    }
  };

  return (
    <div
      className={cn(
        'stream-tile cursor-pointer group scanlines',
        isMain && 'stream-tile-main',
        stream.hasAction && 'stream-tile-action',
        isAudioActive && !stream.hasAction && !isMain && 'stream-tile-audio',
        isCompact && 'h-28'
      )}
      onClick={handleTileClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video */}
      <div className="aspect-video-fixed bg-black relative overflow-hidden">
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
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-10 h-10 border-2 border-[hsl(var(--loading-amber))] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Action Badge */}
        {stream.hasAction && (
          <div className="action-badge animate-scale-in">
            {getActionLabel(stream.actionType)}
          </div>
        )}

        {/* Top Right Controls */}
        <div className={cn(
          'absolute top-3 right-3 flex items-center gap-2 transition-all duration-300',
          isHovered || isMain ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        )}>
          <button
            onClick={handleRemove}
            className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm hover:bg-destructive flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Overlay */}
        <div className="absolute bottom-0 inset-x-0 broadcast-overlay p-3">
          {/* Match Info Row */}
          {!isCompact && (
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="live-badge">LIVE</span>
                <span className="text-xs font-mono text-white/80 bg-black/40 px-1.5 py-0.5 rounded">
                  {formatMatchTime(stream.matchTime)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isAudioActive && <div className="audio-indicator" />}
                {/* Quick Metrics */}
                <div className="flex items-center gap-1.5 text-[10px] text-white/60">
                  <TrendingUp className="w-3 h-3" />
                  <span>{Math.round(stream.metrics.intensity * 100)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Score Display */}
          <div className="flex items-center justify-between">
            <div className={cn('flex-1', isCompact && 'text-xs')}>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-white">{stream.teamA}</span>
                <span className="font-bold text-lg text-primary font-mono">
                  {stream.score.home} - {stream.score.away}
                </span>
                <span className="font-semibold text-sm text-white">{stream.teamB}</span>
              </div>
              
              {/* Intensity Bar */}
              {!isCompact && (
                <div className="mt-2">
                  <IntensityMeter value={stream.metrics.intensity} size="sm" />
                </div>
              )}
            </div>

            {/* Audio/Play Controls */}
            <div className={cn(
              'flex items-center gap-1.5 ml-3 transition-all duration-300',
              isHovered || isMain ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
            )}>
              <button
                onClick={handlePlayPause}
                className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                {stream.isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={handleAudioClick}
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110',
                  isAudioActive 
                    ? 'bg-[hsl(var(--audio-green))] hover:bg-[hsl(var(--audio-green-glow))] shadow-lg shadow-[hsl(var(--audio-green))]/30'
                    : 'bg-white/10 backdrop-blur-sm hover:bg-white/20'
                )}
              >
                {stream.isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              {isMain && (
                <button
                  className="w-8 h-8 rounded-full bg-primary/30 hover:bg-primary/40 flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Indicator */}
        {isMain && !stream.hasAction && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-primary/30">
            MAIN
          </div>
        )}

        {/* Momentum Indicator */}
        {stream.metrics.momentum !== 'neutral' && !isCompact && (
          <div className={cn(
            'absolute top-12 left-3 px-2 py-0.5 rounded text-[9px] font-medium uppercase tracking-wider',
            stream.metrics.momentum === 'home' 
              ? 'bg-[hsl(var(--audio-green))]/20 text-[hsl(var(--audio-green))]'
              : 'bg-[hsl(var(--momentum-purple))]/20 text-[hsl(var(--momentum-purple))]'
          )}>
            {stream.metrics.momentum === 'home' ? stream.teamA : stream.teamB} Momentum
          </div>
        )}
      </div>
    </div>
  );
};
