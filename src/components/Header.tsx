import { useState } from 'react';
import { Plus, Radio, MonitorPlay, Activity, TrendingUp } from 'lucide-react';
import { useCommandCenterStore } from '@/stores/commandCenterStore';
import { Button } from '@/components/ui/button';
import { AddStreamModal } from './AddStreamModal';
import { IntensityMeter } from './IntensityMeter';
import { cn } from '@/lib/utils';

export const Header = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const { streams, globalIntensity, toggleAnalytics, showAnalytics } = useCommandCenterStore();
  
  const liveCount = streams.filter((s) => s.isPlaying).length;
  const actionCount = streams.filter((s) => s.hasAction).length;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 glass-panel-solid border-b border-white/10 z-40">
        <div className="h-full flex items-center justify-between px-6">
          {/* Logo / Title */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-[hsl(var(--intensity-cyan))] flex items-center justify-center shadow-lg shadow-primary/20">
              <MonitorPlay className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Command Center
              </h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Multi-Match Director</p>
            </div>
          </div>

          {/* Center Status */}
          <div className="flex items-center gap-6">
            {/* Live Count */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-destructive/10 border border-destructive/20">
              <Radio className="w-3.5 h-3.5 text-destructive animate-pulse" />
              <span className="text-sm font-semibold text-destructive">{liveCount} LIVE</span>
            </div>

            {/* Action Alert */}
            {actionCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[hsl(var(--loading-amber))]/10 border border-[hsl(var(--loading-amber))]/20 animate-scale-in">
                <TrendingUp className="w-3.5 h-3.5 text-[hsl(var(--loading-amber))]" />
                <span className="text-sm font-semibold text-[hsl(var(--loading-amber))]">{actionCount} ACTION</span>
              </div>
            )}

            {/* Global Intensity */}
            <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 min-w-[200px]">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1">
                <IntensityMeter value={globalIntensity} size="sm" />
              </div>
              <span className={cn(
                'text-xs font-bold font-mono',
                globalIntensity < 0.4 ? 'text-[hsl(var(--audio-green))]' : 
                globalIntensity < 0.7 ? 'text-[hsl(var(--loading-amber))]' : 
                'text-[hsl(var(--action-red))] text-glow-sm'
              )}>
                {Math.round(globalIntensity * 100)}%
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAnalytics}
              className={cn(
                'h-9 px-3 rounded-xl',
                showAnalytics && 'bg-primary/20 text-primary'
              )}
            >
              <Activity className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-primary to-[hsl(var(--intensity-cyan))] hover:opacity-90 shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Stream
            </Button>
          </div>
        </div>
      </header>

      <AddStreamModal open={showAddModal} onOpenChange={setShowAddModal} />
    </>
  );
};
