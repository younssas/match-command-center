import { useState } from 'react';
import { X, Plus, Link2 } from 'lucide-react';
import { useCommandCenterStore } from '@/stores/commandCenterStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AddStreamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddStreamModal = ({ open, onOpenChange }: AddStreamModalProps) => {
  const [url, setUrl] = useState('');
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  
  const { addStream } = useCommandCenterStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) return;

    addStream({
      url: url.trim(),
      name: `${teamA || 'Team A'} vs ${teamB || 'Team B'}`,
      teamA: teamA || 'Team A',
      teamB: teamB || 'Team B',
      score: '0 - 0',
      matchTime: "1'",
      isMain: false,
      hasAction: false,
      volume: 80,
      isMuted: true,
      isPlaying: true,
      isLoading: false,
    });

    setUrl('');
    setTeamA('');
    setTeamB('');
    onOpenChange(false);
  };

  const sampleUrls = [
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Add New Stream
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* URL Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Stream URL (MP4/HLS)
            </label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 focus:border-primary"
              />
            </div>
            
            {/* Quick Sample URLs */}
            <div className="flex flex-wrap gap-1">
              {sampleUrls.map((sampleUrl, i) => (
                <button
                  key={i}
                  type="button"
                  className="text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-muted-foreground transition-colors"
                  onClick={() => setUrl(sampleUrl)}
                >
                  Sample {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Team Names */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Team A
              </label>
              <Input
                placeholder="Arsenal"
                value={teamA}
                onChange={(e) => setTeamA(e.target.value)}
                className="bg-white/5 border-white/10 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Team B
              </label>
              <Input
                placeholder="Chelsea"
                value={teamB}
                onChange={(e) => setTeamB(e.target.value)}
                className="bg-white/5 border-white/10 focus:border-primary"
              />
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Stream
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
