import { useCommandCenterStore } from '@/stores/commandCenterStore';
import { StreamTile } from './StreamTile';
import { cn } from '@/lib/utils';

export const StreamGrid = () => {
  const { streams, mainStreamId, layoutMode } = useCommandCenterStore();

  const mainStream = streams.find((s) => s.id === mainStreamId);
  const otherStreams = streams.filter((s) => s.id !== mainStreamId);

  if (layoutMode === 'main-focus' && mainStream) {
    return (
      <div className="flex h-full gap-4 p-4">
        {/* Main Stream - 75% */}
        <div className="flex-1 min-w-0">
          <StreamTile stream={mainStream} />
        </div>

        {/* Sidebar - Other Streams */}
        {otherStreams.length > 0 && (
          <div className="w-64 xl:w-72 flex-shrink-0 overflow-y-auto space-y-3 pr-1">
            {otherStreams.map((stream) => (
              <StreamTile key={stream.id} stream={stream} isCompact />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Grid Layout - Responsive columns based on stream count
  const getGridCols = (count: number) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2';
    if (count <= 4) return 'grid-cols-1 md:grid-cols-2';
    if (count <= 6) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    if (count <= 9) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    if (count <= 12) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5';
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className={cn('grid gap-4', getGridCols(streams.length))}>
        {streams.map((stream) => (
          <StreamTile key={stream.id} stream={stream} />
        ))}
      </div>
    </div>
  );
};
