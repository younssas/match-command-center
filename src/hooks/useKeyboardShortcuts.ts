import { useEffect, useState } from 'react';
import { useCommandCenterStore } from '@/stores/commandCenterStore';

export const useKeyboardShortcuts = () => {
  const {
    streams,
    setMainStream,
    toggleMute,
    togglePlayPause,
    setLayoutMode,
    toggleAutoSwitch,
    toggleSettings,
    toggleAudioMixer,
    toggleShortcuts,
    mainStreamId,
  } = useCommandCenterStore();

  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key.toLowerCase();

      // Number keys 1-9 for stream selection
      if (/^[1-9]$/.test(key)) {
        const index = parseInt(key) - 1;
        if (streams[index]) {
          setMainStream(streams[index].id);
        }
        return;
      }

      switch (key) {
        case 'g':
          setLayoutMode('grid');
          break;
        case 'f':
          setLayoutMode('main-focus');
          break;
        case 'a':
          toggleAutoSwitch();
          break;
        case ' ':
          e.preventDefault();
          if (mainStreamId) {
            togglePlayPause(mainStreamId);
          }
          break;
        case 'm':
          if (mainStreamId) {
            toggleMute(mainStreamId);
          }
          break;
        case '+':
        case '=':
          setShowAddModal(true);
          break;
        case 's':
          toggleSettings();
          break;
        case 'v':
          toggleAudioMixer();
          break;
        case '?':
          toggleShortcuts();
          break;
        case 'escape':
          // Close all panels
          useCommandCenterStore.setState({
            showSettings: false,
            showAudioMixer: false,
            showShortcuts: false,
            showAnalytics: false,
          });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [streams, mainStreamId, setMainStream, toggleMute, togglePlayPause, setLayoutMode, toggleAutoSwitch, toggleSettings, toggleAudioMixer, toggleShortcuts]);

  return { showAddModal, setShowAddModal };
};
