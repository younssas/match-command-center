import { X, Volume2, VolumeX, Radio } from 'lucide-react';
import { useCommandCenterStore } from '@/stores/commandCenterStore';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export const AudioMixerPanel = () => {
  const {
    streams,
    audioStreamId,
    showAudioMixer,
    toggleAudioMixer,
    setVolume,
    toggleMute,
    setAudioStream,
    muteAll,
  } = useCommandCenterStore();

  if (!showAudioMixer) return null;

  return (
    <div className="fixed right-4 top-4 bottom-20 w-72 glass-panel rounded-2xl z-40 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Audio Mixer</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={muteAll}
          >
            Mute All
          </Button>
          <button
            onClick={toggleAudioMixer}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stream List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {streams.map((stream) => {
          const isActive = stream.id === audioStreamId && !stream.isMuted;
          
          return (
            <div
              key={stream.id}
              className={cn(
                'p-3 rounded-xl bg-white/5 border border-transparent transition-all',
                isActive && 'border-[hsl(var(--audio-green))] bg-[hsl(var(--audio-green))]/5'
              )}
            >
              {/* Stream Name */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium truncate">
                  {stream.teamA} vs {stream.teamB}
                </span>
                {isActive && (
                  <div className="flex items-center gap-1 text-[hsl(var(--audio-green))]">
                    <Radio className="w-3 h-3" />
                    <span className="text-[10px] font-medium">LIVE</span>
                  </div>
                )}
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleMute(stream.id)}
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                    stream.isMuted 
                      ? 'bg-white/5 text-muted-foreground' 
                      : 'bg-[hsl(var(--audio-green))]/20 text-[hsl(var(--audio-green))]'
                  )}
                >
                  {stream.isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                <Slider
                  value={[stream.volume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={([value]) => setVolume(stream.id, value)}
                  className="flex-1"
                  disabled={stream.isMuted}
                />

                <span className="text-xs text-muted-foreground w-8 text-right">
                  {stream.volume}%
                </span>
              </div>

              {/* Solo Button */}
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'w-full mt-2 h-7 text-xs',
                  isActive 
                    ? 'bg-[hsl(var(--audio-green))]/20 text-[hsl(var(--audio-green))] hover:bg-[hsl(var(--audio-green))]/30'
                    : 'bg-white/5 hover:bg-white/10'
                )}
                onClick={() => setAudioStream(stream.id)}
              >
                {isActive ? 'Active' : 'Solo'}
              </Button>
            </div>
          );
        })}
      </div>

      {/* VU Meter Simulation */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-1 h-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'flex-1 h-full rounded-sm transition-all',
                i < 14 ? 'bg-[hsl(var(--audio-green))]' : i < 17 ? 'bg-[hsl(var(--loading-amber))]' : 'bg-destructive',
                audioStreamId ? 'opacity-100' : 'opacity-20'
              )}
              style={{
                animationDelay: `${i * 50}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
