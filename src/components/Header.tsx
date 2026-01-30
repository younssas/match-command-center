import { useState } from 'react';
import { Plus, Radio, MonitorPlay } from 'lucide-react';
import { useCommandCenterStore } from '@/stores/commandCenterStore';
import { Button } from '@/components/ui/button';
import { AddStreamModal } from './AddStreamModal';

export const Header = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const { streams } = useCommandCenterStore();
  
  const liveCount = streams.filter((s) => s.isPlaying).length;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 glass-panel border-b border-white/10 z-40 flex items-center justify-between px-6">
        {/* Logo / Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
            <MonitorPlay className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Command Center</h1>
            <p className="text-xs text-muted-foreground">Multi-Match Director</p>
          </div>
        </div>

        {/* Center Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/20 text-destructive">
            <Radio className="w-3 h-3 animate-pulse" />
            <span className="text-sm font-medium">{liveCount} LIVE</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Stream
          </Button>
        </div>
      </header>

      <AddStreamModal open={showAddModal} onOpenChange={setShowAddModal} />
    </>
  );
};
