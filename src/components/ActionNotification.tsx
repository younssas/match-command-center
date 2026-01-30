import { useEffect, useState } from 'react';
import { useCommandCenterStore } from '@/stores/commandCenterStore';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  streamName: string;
  timestamp: number;
}

export const ActionNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { streams, actionQueue } = useCommandCenterStore();

  useEffect(() => {
    if (actionQueue.length > 0) {
      const latestActionId = actionQueue[actionQueue.length - 1];
      const stream = streams.find((s) => s.id === latestActionId);
      
      if (stream) {
        const notification: Notification = {
          id: `${latestActionId}-${Date.now()}`,
          streamName: stream.name,
          timestamp: Date.now(),
        };

        setNotifications((prev) => [...prev, notification]);

        // Auto-remove after 3 seconds
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
        }, 3000);
      }
    }
  }, [actionQueue, streams]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            'glass-panel rounded-xl px-4 py-3 flex items-center gap-3 animate-in slide-in-from-right-5 fade-in duration-300',
            'border-l-4 border-l-destructive'
          )}
        >
          <span className="text-xl">⚽</span>
          <div>
            <p className="text-sm font-semibold">Action Detected!</p>
            <p className="text-xs text-muted-foreground">{notification.streamName}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
