import { X, Activity, TrendingUp, Users, Target, Zap, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { useCommandCenterStore } from '@/stores/commandCenterStore';
import { IntensityMeter } from './IntensityMeter';
import { cn } from '@/lib/utils';

export const AnalyticsDashboard = () => {
  const { streams, mainStreamId, globalIntensity, showAnalytics, toggleAnalytics } = useCommandCenterStore();
  
  const mainStream = streams.find((s) => s.id === mainStreamId);

  if (!showAnalytics) return null;

  const getZoneLabel = (zone: string) => {
    switch (zone) {
      case 'left_penalty': return 'Left Penalty';
      case 'left_attack': return 'Left Attack';
      case 'midfield': return 'Midfield';
      case 'right_attack': return 'Right Attack';
      case 'right_penalty': return 'Right Penalty';
      default: return zone;
    }
  };

  const getMomentumIcon = (momentum: string) => {
    switch (momentum) {
      case 'home': return <ArrowUp className="w-4 h-4 text-[hsl(var(--audio-green))]" />;
      case 'away': return <ArrowDown className="w-4 h-4 text-[hsl(var(--momentum-purple))]" />;
      default: return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  // Calculate aggregate stats
  const avgIntensity = streams.reduce((sum, s) => sum + s.metrics.intensity, 0) / streams.length;
  const highIntensityCount = streams.filter((s) => s.metrics.intensity > 0.7).length;
  const activeActions = streams.filter((s) => s.hasAction).length;
  const totalGoals = streams.reduce((sum, s) => sum + s.score.home + s.score.away, 0);

  return (
    <div className="fixed left-4 top-20 bottom-24 w-80 glass-panel-solid rounded-2xl z-40 flex flex-col overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Match Analytics</h3>
        </div>
        <button
          onClick={toggleAnalytics}
          className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Global Overview */}
      <div className="p-4 border-b border-white/10 space-y-4">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-3.5 h-3.5" />
          Global Overview
        </h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="analysis-card">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Avg Intensity</p>
            <p className="metric-value-primary text-2xl">{Math.round(avgIntensity * 100)}%</p>
          </div>
          <div className="analysis-card">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Active Actions</p>
            <p className="metric-value text-2xl">{activeActions}</p>
          </div>
          <div className="analysis-card">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">High Intensity</p>
            <p className="metric-value text-2xl">{highIntensityCount} <span className="text-sm text-muted-foreground">matches</span></p>
          </div>
          <div className="analysis-card">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Total Goals</p>
            <p className="metric-value text-2xl">{totalGoals}</p>
          </div>
        </div>

        {/* Global Intensity Bar */}
        <IntensityMeter value={globalIntensity} size="lg" showLabel label="System Intensity" />
      </div>

      {/* Main Stream Analysis */}
      {mainStream && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Target className="w-3.5 h-3.5" />
            Main Match Analysis
          </h4>

          <div className="analysis-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">{mainStream.teamA} vs {mainStream.teamB}</span>
              <span className="text-xs text-muted-foreground font-mono">{mainStream.matchTime}'</span>
            </div>
            <div className="text-center py-2">
              <span className="text-3xl font-bold font-mono text-primary">
                {mainStream.score.home} - {mainStream.score.away}
              </span>
            </div>
          </div>

          {/* Component Scores */}
          <div className="space-y-3">
            <IntensityMeter 
              value={mainStream.metrics.motionScore} 
              showLabel 
              label="Motion Score" 
            />
            <IntensityMeter 
              value={mainStream.metrics.playerDensity} 
              showLabel 
              label="Player Density" 
            />
            <IntensityMeter 
              value={mainStream.metrics.ballActivity} 
              showLabel 
              label="Ball Activity" 
            />
            <IntensityMeter 
              value={mainStream.metrics.tempo} 
              showLabel 
              label="Tempo" 
            />
            <IntensityMeter 
              value={mainStream.metrics.pressure} 
              showLabel 
              label="Pressure" 
            />
          </div>

          {/* Tactical Zone */}
          <div className="analysis-card">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Active Zone</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{getZoneLabel(mainStream.metrics.tacticalZone)}</span>
              <div className={cn(
                'px-2 py-1 rounded text-[10px] font-bold uppercase',
                mainStream.metrics.tacticalZone.includes('penalty') 
                  ? 'bg-destructive/20 text-destructive' 
                  : 'bg-primary/20 text-primary'
              )}>
                {mainStream.metrics.tacticalZone.includes('penalty') ? 'DANGER ZONE' : 'BUILD-UP'}
              </div>
            </div>
            
            {/* Zone Visualization */}
            <div className="mt-3 h-8 rounded-lg bg-[hsl(var(--audio-green))]/20 relative overflow-hidden flex">
              {['left_penalty', 'left_attack', 'midfield', 'right_attack', 'right_penalty'].map((zone) => (
                <div 
                  key={zone}
                  className={cn(
                    'flex-1 border-r border-white/10 last:border-r-0 transition-all duration-300',
                    mainStream.metrics.tacticalZone === zone && 'bg-primary/40'
                  )}
                />
              ))}
            </div>
          </div>

          {/* Possession & xG */}
          <div className="grid grid-cols-2 gap-3">
            <div className="analysis-card">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Possession</p>
              <div className="flex items-center justify-between text-xs">
                <span>{Math.round(mainStream.metrics.possession.home)}%</span>
                <span>{Math.round(mainStream.metrics.possession.away)}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden flex mt-1">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${mainStream.metrics.possession.home}%` }}
                />
              </div>
            </div>
            <div className="analysis-card">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">xG</p>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[hsl(var(--audio-green))]">{mainStream.metrics.xG.home.toFixed(2)}</span>
                <span className="text-[hsl(var(--momentum-purple))]">{mainStream.metrics.xG.away.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Momentum */}
          <div className="analysis-card">
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Momentum</p>
              <div className="flex items-center gap-2">
                {getMomentumIcon(mainStream.metrics.momentum)}
                <span className="text-sm font-medium">
                  {mainStream.metrics.momentum === 'neutral' 
                    ? 'Balanced' 
                    : mainStream.metrics.momentum === 'home' 
                      ? mainStream.teamA 
                      : mainStream.teamB}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
