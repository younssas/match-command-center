import { 
  Play, 
  Pause, 
  Grid3X3, 
  LayoutPanelLeft, 
  Plus, 
  Settings, 
  Volume2, 
  Zap,
  ZapOff,
  Keyboard
} from 'lucide-react';
import { useCommandCenterStore } from '@/stores/commandCenterStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const ControlBar = () => {
  const {
    streams,
    layoutMode,
    autoSwitch,
    setLayoutMode,
    toggleAutoSwitch,
    toggleSettings,
    toggleAudioMixer,
    toggleShortcuts,
    loadPreset,
  } = useCommandCenterStore();

  const allPlaying = streams.every((s) => s.isPlaying);

  return (
    <div className="control-bar">
      {/* Stream Count */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-sm">
        <span className="text-muted-foreground">Streams:</span>
        <span className="font-bold text-primary">{streams.length}</span>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-white/10" />

      {/* Layout Toggle */}
      <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'h-8 px-3 rounded-md',
            layoutMode === 'grid' && 'bg-primary text-primary-foreground'
          )}
          onClick={() => setLayoutMode('grid')}
        >
          <Grid3X3 className="w-4 h-4 mr-1.5" />
          Grid
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'h-8 px-3 rounded-md',
            layoutMode === 'main-focus' && 'bg-primary text-primary-foreground'
          )}
          onClick={() => setLayoutMode('main-focus')}
        >
          <LayoutPanelLeft className="w-4 h-4 mr-1.5" />
          Focus
        </Button>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-white/10" />

      {/* Auto Switch Toggle */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'h-9 px-3 rounded-lg',
          autoSwitch 
            ? 'bg-[hsl(var(--audio-green))]/20 text-[hsl(var(--audio-green))] hover:bg-[hsl(var(--audio-green))]/30'
            : 'bg-white/5 hover:bg-white/10'
        )}
        onClick={toggleAutoSwitch}
      >
        {autoSwitch ? (
          <Zap className="w-4 h-4 mr-1.5" />
        ) : (
          <ZapOff className="w-4 h-4 mr-1.5" />
        )}
        Auto
      </Button>

      {/* Quick Presets */}
      <div className="flex items-center gap-1">
        {[3, 6, 9, 12].map((count) => (
          <Button
            key={count}
            variant="ghost"
            size="sm"
            className={cn(
              'h-8 w-8 p-0 rounded-md',
              streams.length === count && 'bg-primary/20 text-primary'
            )}
            onClick={() => loadPreset(count)}
          >
            {count}
          </Button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-white/10" />

      {/* Action Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-lg bg-white/5 hover:bg-white/10"
        onClick={toggleAudioMixer}
      >
        <Volume2 className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-lg bg-white/5 hover:bg-white/10"
        onClick={toggleShortcuts}
      >
        <Keyboard className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-lg bg-white/5 hover:bg-white/10"
        onClick={toggleSettings}
      >
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  );
};
