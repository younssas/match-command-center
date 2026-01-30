import { create } from 'zustand';

export interface MatchMetrics {
  intensity: number;
  motionScore: number;
  playerDensity: number;
  ballActivity: number;
  tacticalZone: 'left_penalty' | 'left_attack' | 'midfield' | 'right_attack' | 'right_penalty';
  tempo: number;
  momentum: 'home' | 'away' | 'neutral';
  xG: { home: number; away: number };
  possession: { home: number; away: number };
  pressure: number;
}

export interface Stream {
  id: string;
  url: string;
  name: string;
  teamA: string;
  teamB: string;
  teamALogo?: string;
  teamBLogo?: string;
  score: { home: number; away: number };
  matchTime: number; // in minutes
  isHalfTime: boolean;
  isMain: boolean;
  hasAction: boolean;
  actionType?: 'goal' | 'shot' | 'foul' | 'corner' | 'chance';
  volume: number;
  isMuted: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  metrics: MatchMetrics;
}

export type LayoutMode = 'grid' | 'main-focus' | 'action-focus';

interface CommandCenterState {
  streams: Stream[];
  mainStreamId: string | null;
  actionQueue: { id: string; type: string; timestamp: number }[];
  layoutMode: LayoutMode;
  autoSwitch: boolean;
  audioStreamId: string | null;
  showSettings: boolean;
  showAudioMixer: boolean;
  showShortcuts: boolean;
  showAnalytics: boolean;
  actionDuration: number;
  globalIntensity: number;
  
  // Actions
  addStream: (stream: Omit<Stream, 'id'>) => void;
  removeStream: (id: string) => void;
  setMainStream: (id: string) => void;
  triggerAction: (id: string, type: string) => void;
  clearAction: (id: string) => void;
  processActionQueue: () => void;
  setLayoutMode: (mode: LayoutMode) => void;
  toggleAutoSwitch: () => void;
  setVolume: (id: string, volume: number) => void;
  toggleMute: (id: string) => void;
  setAudioStream: (id: string) => void;
  togglePlayPause: (id: string) => void;
  toggleSettings: () => void;
  toggleAudioMixer: () => void;
  toggleShortcuts: () => void;
  toggleAnalytics: () => void;
  setActionDuration: (duration: number) => void;
  loadPreset: (count: number) => void;
  muteAll: () => void;
  updateStreamMetrics: (id: string, metrics: Partial<MatchMetrics>) => void;
  updateMatchTime: (id: string, time: number) => void;
  updateScore: (id: string, team: 'home' | 'away') => void;
  calculateGlobalIntensity: () => void;
}

const teamNames = [
  { a: 'Arsenal', b: 'Chelsea' },
  { a: 'Man United', b: 'Liverpool' },
  { a: 'Man City', b: 'Tottenham' },
  { a: 'Barcelona', b: 'Real Madrid' },
  { a: 'Bayern', b: 'Dortmund' },
  { a: 'PSG', b: 'Lyon' },
  { a: 'Juventus', b: 'Inter Milan' },
  { a: 'AC Milan', b: 'AS Roma' },
  { a: 'Ajax', b: 'PSV' },
  { a: 'Benfica', b: 'Porto' },
  { a: 'Celtic', b: 'Rangers' },
  { a: 'Atletico', b: 'Sevilla' },
];

const sampleVideos = [
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
];

const tacticalZones: MatchMetrics['tacticalZone'][] = ['left_penalty', 'left_attack', 'midfield', 'right_attack', 'right_penalty'];

const generateRandomMetrics = (): MatchMetrics => ({
  intensity: Math.random() * 0.6 + 0.2,
  motionScore: Math.random() * 0.7 + 0.2,
  playerDensity: Math.random() * 0.5 + 0.3,
  ballActivity: Math.random() * 0.6 + 0.2,
  tacticalZone: tacticalZones[Math.floor(Math.random() * tacticalZones.length)],
  tempo: Math.random() * 0.5 + 0.3,
  momentum: ['home', 'away', 'neutral'][Math.floor(Math.random() * 3)] as 'home' | 'away' | 'neutral',
  xG: { home: Math.random() * 2, away: Math.random() * 2 },
  possession: { home: 45 + Math.random() * 20, away: 0 },
  pressure: Math.random() * 0.7 + 0.2,
});

const generateStream = (index: number): Stream => {
  const teams = teamNames[index % teamNames.length];
  const video = sampleVideos[index % sampleVideos.length];
  const minutes = Math.floor(Math.random() * 85) + 1;
  const metrics = generateRandomMetrics();
  metrics.possession.away = 100 - metrics.possession.home;
  
  return {
    id: `stream-${Date.now()}-${index}`,
    url: video,
    name: `${teams.a} vs ${teams.b}`,
    teamA: teams.a,
    teamB: teams.b,
    score: { home: Math.floor(Math.random() * 4), away: Math.floor(Math.random() * 3) },
    matchTime: minutes,
    isHalfTime: minutes === 45,
    isMain: index === 0,
    hasAction: false,
    volume: 80,
    isMuted: index !== 0,
    isPlaying: true,
    isLoading: false,
    metrics,
  };
};

const initialStreams: Stream[] = Array.from({ length: 6 }, (_, i) => generateStream(i));

export const useCommandCenterStore = create<CommandCenterState>((set, get) => ({
  streams: initialStreams,
  mainStreamId: initialStreams[0]?.id || null,
  actionQueue: [],
  layoutMode: 'grid',
  autoSwitch: true,
  audioStreamId: initialStreams[0]?.id || null,
  showSettings: false,
  showAudioMixer: false,
  showShortcuts: false,
  showAnalytics: false,
  actionDuration: 20,
  globalIntensity: 0.5,

  addStream: (streamData) => {
    const newStream: Stream = {
      ...streamData,
      id: `stream-${Date.now()}`,
    };
    set((state) => ({
      streams: [...state.streams, newStream],
    }));
    get().calculateGlobalIntensity();
  },

  removeStream: (id) => {
    set((state) => {
      const newStreams = state.streams.filter((s) => s.id !== id);
      const wasMain = state.mainStreamId === id;
      const wasAudio = state.audioStreamId === id;
      
      return {
        streams: newStreams,
        mainStreamId: wasMain ? (newStreams[0]?.id || null) : state.mainStreamId,
        audioStreamId: wasAudio ? (newStreams[0]?.id || null) : state.audioStreamId,
        actionQueue: state.actionQueue.filter((item) => item.id !== id),
      };
    });
    get().calculateGlobalIntensity();
  },

  setMainStream: (id) => {
    set((state) => ({
      mainStreamId: id,
      streams: state.streams.map((s) => ({
        ...s,
        isMain: s.id === id,
      })),
    }));
  },

  triggerAction: (id, type) => {
    set((state) => {
      const existingAction = state.actionQueue.find((item) => item.id === id);
      const newQueue = existingAction
        ? state.actionQueue
        : [...state.actionQueue, { id, type, timestamp: Date.now() }];
      
      return {
        actionQueue: newQueue,
        streams: state.streams.map((s) => ({
          ...s,
          hasAction: s.id === id ? true : s.hasAction,
          actionType: s.id === id ? type as Stream['actionType'] : s.actionType,
          metrics: s.id === id 
            ? { ...s.metrics, intensity: Math.min(s.metrics.intensity + 0.3, 1) }
            : s.metrics,
        })),
      };
    });
    get().calculateGlobalIntensity();
  },

  clearAction: (id) => {
    set((state) => ({
      actionQueue: state.actionQueue.filter((item) => item.id !== id),
      streams: state.streams.map((s) => ({
        ...s,
        hasAction: s.id === id ? false : s.hasAction,
        actionType: s.id === id ? undefined : s.actionType,
      })),
    }));
    get().calculateGlobalIntensity();
  },

  processActionQueue: () => {
    const { actionQueue, autoSwitch } = get();
    if (actionQueue.length > 0 && autoSwitch) {
      const nextAction = actionQueue[0];
      set((state) => ({
        mainStreamId: nextAction.id,
        audioStreamId: nextAction.id,
        layoutMode: 'action-focus',
        streams: state.streams.map((s) => ({
          ...s,
          isMain: s.id === nextAction.id,
          isMuted: s.id !== nextAction.id,
        })),
      }));
    }
  },

  setLayoutMode: (mode) => set({ layoutMode: mode }),

  toggleAutoSwitch: () => set((state) => ({ autoSwitch: !state.autoSwitch })),

  setVolume: (id, volume) => {
    set((state) => ({
      streams: state.streams.map((s) =>
        s.id === id ? { ...s, volume, isMuted: volume === 0 } : s
      ),
    }));
  },

  toggleMute: (id) => {
    set((state) => ({
      streams: state.streams.map((s) =>
        s.id === id ? { ...s, isMuted: !s.isMuted } : s
      ),
    }));
  },

  setAudioStream: (id) => {
    set((state) => ({
      audioStreamId: id,
      streams: state.streams.map((s) => ({
        ...s,
        isMuted: s.id !== id,
      })),
    }));
  },

  togglePlayPause: (id) => {
    set((state) => ({
      streams: state.streams.map((s) =>
        s.id === id ? { ...s, isPlaying: !s.isPlaying } : s
      ),
    }));
  },

  toggleSettings: () => set((state) => ({ showSettings: !state.showSettings })),
  toggleAudioMixer: () => set((state) => ({ showAudioMixer: !state.showAudioMixer })),
  toggleShortcuts: () => set((state) => ({ showShortcuts: !state.showShortcuts })),
  toggleAnalytics: () => set((state) => ({ showAnalytics: !state.showAnalytics })),

  setActionDuration: (duration) => set({ actionDuration: duration }),

  loadPreset: (count) => {
    const newStreams = Array.from({ length: count }, (_, i) => generateStream(i));
    set({
      streams: newStreams,
      mainStreamId: newStreams[0]?.id || null,
      audioStreamId: newStreams[0]?.id || null,
      actionQueue: [],
    });
    get().calculateGlobalIntensity();
  },

  muteAll: () => {
    set((state) => ({
      streams: state.streams.map((s) => ({ ...s, isMuted: true })),
      audioStreamId: null,
    }));
  },

  updateStreamMetrics: (id, metrics) => {
    set((state) => ({
      streams: state.streams.map((s) =>
        s.id === id ? { ...s, metrics: { ...s.metrics, ...metrics } } : s
      ),
    }));
    get().calculateGlobalIntensity();
  },

  updateMatchTime: (id, time) => {
    set((state) => ({
      streams: state.streams.map((s) =>
        s.id === id ? { ...s, matchTime: time, isHalfTime: time === 45 } : s
      ),
    }));
  },

  updateScore: (id, team) => {
    set((state) => ({
      streams: state.streams.map((s) =>
        s.id === id
          ? {
              ...s,
              score: {
                ...s.score,
                [team]: s.score[team] + 1,
              },
            }
          : s
      ),
    }));
  },

  calculateGlobalIntensity: () => {
    const { streams } = get();
    if (streams.length === 0) {
      set({ globalIntensity: 0 });
      return;
    }
    
    const avgIntensity = streams.reduce((sum, s) => sum + s.metrics.intensity, 0) / streams.length;
    const hasAction = streams.some((s) => s.hasAction);
    const actionBonus = hasAction ? 0.2 : 0;
    
    set({ globalIntensity: Math.min(avgIntensity + actionBonus, 1) });
  },
}));
