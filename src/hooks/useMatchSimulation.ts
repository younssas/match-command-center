import { useEffect, useRef } from 'react';
import { useCommandCenterStore } from '@/stores/commandCenterStore';

export const useMatchSimulation = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    streams,
    updateMatchTime,
    updateStreamMetrics,
    triggerAction,
    clearAction,
    processActionQueue,
    autoSwitch,
  } = useCommandCenterStore();

  useEffect(() => {
    // Update match time every 3 seconds (simulating 1 minute of match time)
    intervalRef.current = setInterval(() => {
      streams.forEach((stream) => {
        if (!stream.isPlaying || stream.isHalfTime) return;

        // Update match time
        const newTime = Math.min(stream.matchTime + 1, 95);
        if (newTime !== stream.matchTime) {
          updateMatchTime(stream.id, newTime);
        }

        // Randomly update metrics
        const intensityDelta = (Math.random() - 0.5) * 0.1;
        const motionDelta = (Math.random() - 0.5) * 0.08;
        const tempoData = (Math.random() - 0.5) * 0.1;
        const pressureDelta = (Math.random() - 0.5) * 0.1;

        const zones = ['left_penalty', 'left_attack', 'midfield', 'right_attack', 'right_penalty'] as const;
        const newZone = Math.random() > 0.85 ? zones[Math.floor(Math.random() * zones.length)] : stream.metrics.tacticalZone;
        
        const newMomentum = Math.random() > 0.9 
          ? (['home', 'away', 'neutral'] as const)[Math.floor(Math.random() * 3)]
          : stream.metrics.momentum;

        updateStreamMetrics(stream.id, {
          intensity: Math.max(0.1, Math.min(0.95, stream.metrics.intensity + intensityDelta)),
          motionScore: Math.max(0.1, Math.min(0.95, stream.metrics.motionScore + motionDelta)),
          tempo: Math.max(0.1, Math.min(0.95, stream.metrics.tempo + tempoData)),
          pressure: Math.max(0.1, Math.min(0.95, stream.metrics.pressure + pressureDelta)),
          tacticalZone: newZone,
          momentum: newMomentum,
          xG: {
            home: Math.max(0, stream.metrics.xG.home + (Math.random() - 0.4) * 0.05),
            away: Math.max(0, stream.metrics.xG.away + (Math.random() - 0.4) * 0.05),
          },
          possession: {
            home: Math.max(30, Math.min(70, stream.metrics.possession.home + (Math.random() - 0.5) * 3)),
            away: 0, // Will be calculated
          },
        });

        // Update away possession
        updateStreamMetrics(stream.id, {
          possession: {
            home: stream.metrics.possession.home,
            away: 100 - stream.metrics.possession.home,
          },
        });
      });
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [streams.length, streams.map(s => s.isPlaying).join(',')]);

  // Action trigger simulation
  useEffect(() => {
    const actionTypes = ['shot', 'foul', 'corner', 'chance', 'goal'];
    
    const triggerRandomAction = () => {
      if (streams.length === 0) return;
      
      // Pick a random stream
      const randomStream = streams[Math.floor(Math.random() * streams.length)];
      
      if (randomStream && !randomStream.hasAction && randomStream.isPlaying) {
        // Higher chance of action if intensity is high
        const actionChance = 0.3 + randomStream.metrics.intensity * 0.4;
        
        if (Math.random() < actionChance) {
          // Pick action type (goal is rare)
          const type = Math.random() > 0.92 
            ? 'goal' 
            : actionTypes[Math.floor(Math.random() * (actionTypes.length - 1))];
          
          triggerAction(randomStream.id, type);
          
          if (autoSwitch) {
            processActionQueue();
          }

          // Clear action after some time
          setTimeout(() => {
            clearAction(randomStream.id);
          }, 8000 + Math.random() * 7000);
        }
      }
    };

    // Check for actions every 8-20 seconds
    const scheduleNext = () => {
      const delay = 8000 + Math.random() * 12000;
      setTimeout(() => {
        triggerRandomAction();
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => {};
  }, [streams.length, autoSwitch]);
};
