import { cn } from '@/lib/utils';

interface IntensityMeterProps {
  value: number; // 0-1
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

export const IntensityMeter = ({ 
  value, 
  size = 'md', 
  showLabel = false, 
  label = 'Intensity',
  animated = true 
}: IntensityMeterProps) => {
  const percentage = Math.round(value * 100);
  
  const getIntensityClass = () => {
    if (value < 0.4) return 'intensity-low';
    if (value < 0.7) return 'intensity-mid';
    return 'intensity-high';
  };

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
          <span className={cn(
            'text-sm font-bold font-mono',
            value < 0.4 ? 'text-[hsl(var(--audio-green))]' : 
            value < 0.7 ? 'text-[hsl(var(--loading-amber))]' : 
            'text-[hsl(var(--action-red))] text-glow-sm'
          )}>
            {percentage}%
          </span>
        </div>
      )}
      <div className={cn('intensity-meter', sizeClasses[size])}>
        <div 
          className={cn(
            'intensity-meter-fill',
            getIntensityClass(),
            animated && 'transition-all duration-500 ease-out'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
