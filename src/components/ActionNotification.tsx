import { useEffect, useState } from 'react';
import { useCommandCenterStore } from '@/stores/commandCenterStore';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  streamName: string;
  type: string;
  timestamp: number;
}

export const ActionNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { streams, actionQueue } = useCommandCenterStore();

  useEffect(() => {
    if (actionQueue.length > 0) {
      const latestAction = actionQueue[actionQueue.length - 1];
      const stream = streams.find((s) => s.id === latestAction.id);
      
      if (stream) {
        const notificationId = `${latestAction.id}-${latestAction.timestamp}`;
        
        // Check if notification already exists
        if (!notifications.find(n => n.id === notificationId)) {
          const notification: Notification = {
            id: notificationId,
            streamName: stream.name,
            type: latestAction.type,
            timestamp: Date.now(),
          };

          setNotifications((prev) => [...prev, notification]);

          // Auto-remove after 4 seconds
          setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
          }, 4000);
        }
      }
    }
  }, [actionQueue, streams]);

  const getActionEmoji = (type: string) => {
    switch (type) {
      case 'goal': return '⚽';
      case 'shot': return '🎯';
      case 'foul': return '⚠️';
      case 'corner': return '🚩';
      case 'chance': return '🔥';
      default: return '⚽';
    }
  };

  const getActionLabel = (type: string) => {
    switch (type) {
      case 'goal': return 'GOAL!';
      case 'shot': return 'Shot on Target';
      case 'foul': return 'Foul';
      case 'corner': return 'Corner Kick';
      case 'chance': return 'Big Chance';
      default: return 'Action';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 pointer-events-none">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            'glass-panel-solid rounded-xl px-4 py-3 flex items-center gap-3 animate-slide-up',
            'border-l-4',
            notification.type === 'goal' ? 'border-l-[hsl(var(--audio-green))]' : 'border-l-destructive'
          )}
        >
          <span className="text-2xl">{getActionEmoji(notification.type)}</span>
          <div>
            <p className="text-sm font-bold">{getActionLabel(notification.type)}</p>
            <p className="text-xs text-muted-foreground">{notification.streamName}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
