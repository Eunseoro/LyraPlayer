import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { PlaylistItem } from '../playlist-item'
import { Track } from '../../lib/store'
import { usePlayerStore } from '../../lib/store'

interface PlaylistProps {
  tracks: Track[]
  onTrackRemove: (trackId: string) => void
  onReorder: (tracks: Track[]) => void
}

export function Playlist({ tracks, onTrackRemove, onReorder }: PlaylistProps) {
  const { currentTrack, setCurrentTrack } = usePlayerStore()
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = tracks.findIndex((track) => track.id === active.id)
      const newIndex = tracks.findIndex((track) => track.id === over.id)
      const newTracks = arrayMove(tracks, oldIndex, newIndex)
      onReorder(newTracks)
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tracks.map((track) => track.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {tracks.map((track) => (
            <PlaylistItem
              key={track.id}
              track={track}
              isSelected={currentTrack?.id === track.id}
              onSelect={() => setCurrentTrack(track)}
              onRemove={() => onTrackRemove(track.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
} 