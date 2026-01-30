import { create } from 'zustand';

export interface Stream {
  id: string;
  url: string;
  name: string;
  teamA: string;
  teamB: string;
  score: string;
  matchTime: string;
  isMain: boolean;
  hasAction: boolean;
  volume: number;
  isMuted: boolean;
  isPlaying: boolean;
  isLoading: boolean;
}

export type LayoutMode = 'grid' | 'main-focus' | 'action-focus';

interface CommandCenterState {
  streams: Stream[];
  mainStreamId: string | null;
  actionQueue: string[];
  layoutMode: LayoutMode;
  autoSwitch: boolean;
  audioStreamId: string | null;
  showSettings: boolean;
  showAudioMixer: boolean;
  showShortcuts: boolean;
  actionDuration: number;
  
  // Actions
  addStream: (stream: Omit<Stream, 'id'>) => void;
  removeStream: (id: string) => void;
  setMainStream: (id: string) => void;
  triggerAction: (id: string) => void;
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
  setActionDuration: (duration: number) => void;
  loadPreset: (count: number) => void;
  muteAll: () => void;
}

const sampleMatches = [
  { teamA: 'Arsenal', teamB: 'Chelsea', score: '2 - 1' },
  { teamA: 'Man United', teamB: 'Liverpool', score: '1 - 1' },
  { teamA: 'Man City', teamB: 'Tottenham', score: '3 - 0' },
  { teamA: 'Barcelona', teamB: 'Real Madrid', score: '2 - 2' },
  { teamA: 'Bayern', teamB: 'Dortmund', score: '4 - 1' },
  { teamA: 'PSG', teamB: 'Lyon', score: '2 - 0' },
  { teamA: 'Juventus', teamB: 'Inter', score: '1 - 0' },
  { teamA: 'AC Milan', teamB: 'Roma', score: '3 - 2' },
  { teamA: 'Ajax', teamB: 'PSV', score: '2 - 1' },
  { teamA: 'Benfica', teamB: 'Porto', score: '1 - 1' },
  { teamA: 'Celtic', teamB: 'Rangers', score: '2 - 0' },
  { teamA: 'Atletico', teamB: 'Sevilla', score: '1 - 2' },
];

const sampleVideos = [
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
];

const generateStream = (index: number): Stream => {
  const match = sampleMatches[index % sampleMatches.length];
  const video = sampleVideos[index % sampleVideos.length];
  const minutes = Math.floor(Math.random() * 90) + 1;
  
  return {
    id: `stream-${Date.now()}-${index}`,
    url: video,
    name: `${match.teamA} vs ${match.teamB}`,
    teamA: match.teamA,
    teamB: match.teamB,
    score: match.score,
    matchTime: `${minutes}'`,
    isMain: index === 0,
    hasAction: false,
    volume: 80,
    isMuted: index !== 0,
    isPlaying: true,
    isLoading: false,
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
  actionDuration: 20,

  addStream: (streamData) => {
    const newStream: Stream = {
      ...streamData,
      id: `stream-${Date.now()}`,
    };
    set((state) => ({
      streams: [...state.streams, newStream],
    }));
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
        actionQueue: state.actionQueue.filter((qid) => qid !== id),
      };
    });
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

  triggerAction: (id) => {
    set((state) => {
      const newQueue = state.actionQueue.includes(id)
        ? state.actionQueue
        : [...state.actionQueue, id];
      
      return {
        actionQueue: newQueue,
        streams: state.streams.map((s) => ({
          ...s,
          hasAction: s.id === id ? true : s.hasAction,
        })),
      };
    });
  },

  clearAction: (id) => {
    set((state) => ({
      actionQueue: state.actionQueue.filter((qid) => qid !== id),
      streams: state.streams.map((s) => ({
        ...s,
        hasAction: s.id === id ? false : s.hasAction,
      })),
    }));
  },

  processActionQueue: () => {
    const { actionQueue, autoSwitch } = get();
    if (actionQueue.length > 0 && autoSwitch) {
      const nextActionId = actionQueue[0];
      set((state) => ({
        mainStreamId: nextActionId,
        audioStreamId: nextActionId,
        layoutMode: 'action-focus',
        streams: state.streams.map((s) => ({
          ...s,
          isMain: s.id === nextActionId,
          isMuted: s.id !== nextActionId,
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

  setActionDuration: (duration) => set({ actionDuration: duration }),

  loadPreset: (count) => {
    const newStreams = Array.from({ length: count }, (_, i) => generateStream(i));
    set({
      streams: newStreams,
      mainStreamId: newStreams[0]?.id || null,
      audioStreamId: newStreams[0]?.id || null,
      actionQueue: [],
    });
  },

  muteAll: () => {
    set((state) => ({
      streams: state.streams.map((s) => ({ ...s, isMuted: true })),
      audioStreamId: null,
    }));
  },
}));
