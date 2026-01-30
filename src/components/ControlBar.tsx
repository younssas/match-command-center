import { 
  Grid3X3, 
  LayoutPanelLeft, 
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

  return (
    <div className="control-bar">
      {/* Stream Count */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 text-sm">
        <span className="text-muted-foreground text-xs">Streams:</span>
        <span className="font-bold text-primary font-mono">{streams.length}</span>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-white/10" />

      {/* Layout Toggle */}
      <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'h-8 px-3 rounded-lg transition-all duration-200',
            layoutMode === 'grid' && 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
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
            'h-8 px-3 rounded-lg transition-all duration-200',
            layoutMode === 'main-focus' && 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
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
          'h-9 px-4 rounded-xl transition-all duration-200',
          autoSwitch 
            ? 'bg-[hsl(var(--audio-green))]/20 text-[hsl(var(--audio-green))] hover:bg-[hsl(var(--audio-green))]/30 shadow-lg shadow-[hsl(var(--audio-green))]/10'
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
      <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
        {[3, 6, 9, 12].map((count) => (
          <Button
            key={count}
            variant="ghost"
            size="sm"
            className={cn(
              'h-7 w-8 p-0 rounded-lg font-mono text-xs transition-all duration-200',
              streams.length === count && 'bg-primary/30 text-primary'
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
        className="h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10"
        onClick={toggleAudioMixer}
      >
        <Volume2 className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10"
        onClick={toggleShortcuts}
      >
        <Keyboard className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10"
        onClick={toggleSettings}
      >
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  );
};
