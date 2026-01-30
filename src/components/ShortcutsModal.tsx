import { X, Keyboard } from 'lucide-react';
import { useCommandCenterStore } from '@/stores/commandCenterStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const shortcuts = [
  { key: '1-9', action: 'Select main stream by position' },
  { key: 'G', action: 'Toggle Grid layout' },
  { key: 'F', action: 'Toggle Focus layout' },
  { key: 'A', action: 'Toggle Auto-switch mode' },
  { key: 'Space', action: 'Play/Pause main stream' },
  { key: 'M', action: 'Mute/Unmute main stream' },
  { key: '+', action: 'Open Add Stream modal' },
  { key: 'S', action: 'Toggle Settings panel' },
  { key: 'V', action: 'Toggle Audio Mixer' },
  { key: '?', action: 'Show keyboard shortcuts' },
  { key: 'Esc', action: 'Close modals/panels' },
];

export const ShortcutsModal = () => {
  const { showShortcuts, toggleShortcuts } = useCommandCenterStore();

  return (
    <Dialog open={showShortcuts} onOpenChange={toggleShortcuts}>
      <DialogContent className="glass-panel border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-primary" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-2">
          {shortcuts.map(({ key, action }) => (
            <div
              key={key}
              className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5"
            >
              <span className="text-sm text-muted-foreground">{action}</span>
              <kbd className="px-2 py-1 rounded bg-white/10 text-xs font-mono font-bold">
                {key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
