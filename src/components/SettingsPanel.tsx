import { X, Settings, Zap, Clock, MonitorPlay } from 'lucide-react';
import { useCommandCenterStore } from '@/stores/commandCenterStore';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export const SettingsPanel = () => {
  const {
    showSettings,
    toggleSettings,
    autoSwitch,
    toggleAutoSwitch,
    actionDuration,
    setActionDuration,
    streams,
  } = useCommandCenterStore();

  if (!showSettings) return null;

  return (
    <div className="fixed left-4 top-4 bottom-20 w-80 glass-panel rounded-2xl z-40 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Settings</h3>
        </div>
        <button
          onClick={toggleSettings}
          className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Auto-Switch Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Auto-Switch
          </h4>
          
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
            <div>
              <p className="text-sm font-medium">Enable Auto-Switch</p>
              <p className="text-xs text-muted-foreground">
                Automatically switch to action streams
              </p>
            </div>
            <Switch checked={autoSwitch} onCheckedChange={toggleAutoSwitch} />
          </div>

          <div className="p-3 rounded-xl bg-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Action Duration</span>
              </div>
              <span className="text-sm font-medium text-primary">{actionDuration}s</span>
            </div>
            <Slider
              value={[actionDuration]}
              min={5}
              max={60}
              step={5}
              onValueChange={([value]) => setActionDuration(value)}
            />
            <p className="text-xs text-muted-foreground">
              How long to stay on an action before returning to main
            </p>
          </div>
        </div>

        {/* Stream Stats */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <MonitorPlay className="w-4 h-4" />
            Stream Stats
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white/5 text-center">
              <p className="text-2xl font-bold text-primary">{streams.length}</p>
              <p className="text-xs text-muted-foreground">Active Streams</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 text-center">
              <p className="text-2xl font-bold text-[hsl(var(--audio-green))]">
                {streams.filter((s) => !s.isMuted).length}
              </p>
              <p className="text-xs text-muted-foreground">Audio Active</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 text-center">
              <p className="text-2xl font-bold text-destructive">
                {streams.filter((s) => s.hasAction).length}
              </p>
              <p className="text-xs text-muted-foreground">Action Alerts</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 text-center">
              <p className="text-2xl font-bold text-[hsl(var(--loading-amber))]">
                {streams.filter((s) => s.isLoading).length}
              </p>
              <p className="text-xs text-muted-foreground">Loading</p>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="p-3 rounded-xl bg-white/5 space-y-2">
          <p className="text-sm font-medium">Performance Mode</p>
          <p className="text-xs text-muted-foreground">
            {streams.length > 12 
              ? 'High load detected. Consider reducing streams for better performance.'
              : 'System running optimally.'}
          </p>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div 
              className={cn(
                'h-full transition-all duration-500',
                streams.length > 12 ? 'bg-destructive' : streams.length > 8 ? 'bg-[hsl(var(--loading-amber))]' : 'bg-[hsl(var(--audio-green))]'
              )}
              style={{ width: `${Math.min((streams.length / 20) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
