import { useEffect, useRef } from 'react';
import { useCommandCenterStore } from '@/stores/commandCenterStore';

export const useActionSimulator = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const actionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    streams,
    autoSwitch,
    actionDuration,
    triggerAction,
    clearAction,
    processActionQueue,
  } = useCommandCenterStore();

  useEffect(() => {
    const scheduleNextAction = () => {
      // Random interval between 15-40 seconds
      const delay = Math.random() * 25000 + 15000;

      timeoutRef.current = setTimeout(() => {
        if (streams.length === 0) {
          scheduleNextAction();
          return;
        }

        // Pick a random stream
        const randomIndex = Math.floor(Math.random() * streams.length);
        const randomStream = streams[randomIndex];

        if (randomStream && !randomStream.hasAction) {
          // Trigger action
          triggerAction(randomStream.id);

          // Process action queue for auto-switch
          if (autoSwitch) {
            processActionQueue();
          }

          // Clear action after duration
          actionTimeoutRef.current = setTimeout(() => {
            clearAction(randomStream.id);
          }, actionDuration * 1000);
        }

        scheduleNextAction();
      }, delay);
    };

    scheduleNextAction();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (actionTimeoutRef.current) {
        clearTimeout(actionTimeoutRef.current);
      }
    };
  }, [streams.length, autoSwitch, actionDuration, triggerAction, clearAction, processActionQueue]);
};
