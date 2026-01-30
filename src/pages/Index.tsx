import { Header } from '@/components/Header';
import { StreamGrid } from '@/components/StreamGrid';
import { ControlBar } from '@/components/ControlBar';
import { AudioMixerPanel } from '@/components/AudioMixerPanel';
import { SettingsPanel } from '@/components/SettingsPanel';
import { ShortcutsModal } from '@/components/ShortcutsModal';
import { ActionNotification } from '@/components/ActionNotification';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useMatchSimulation } from '@/hooks/useMatchSimulation';
import { AddStreamModal } from '@/components/AddStreamModal';

const Index = () => {
  const { showAddModal, setShowAddModal } = useKeyboardShortcuts();
  useMatchSimulation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 pt-16 pb-24">
        <StreamGrid />
      </main>

      {/* Floating Control Bar */}
      <ControlBar />

      {/* Side Panels */}
      <AudioMixerPanel />
      <SettingsPanel />
      <AnalyticsDashboard />

      {/* Modals */}
      <ShortcutsModal />
      <AddStreamModal open={showAddModal} onOpenChange={setShowAddModal} />

      {/* Notifications */}
      <ActionNotification />
    </div>
  );
};

export default Index;
