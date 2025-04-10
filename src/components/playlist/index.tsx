import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd'
import { PlaylistItem } from '../playlist-item'
import { Track } from '../../lib/store'

interface PlaylistProps {
  tracks: Track[]
  onTrackRemove: (trackId: string) => void
  onReorder: (tracks: Track[]) => void
}

export function Playlist({ tracks, onTrackRemove, onReorder }: PlaylistProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(tracks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    onReorder(items)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="playlist">
        {(provided: DroppableProvided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex flex-col gap-2"
          >
            {tracks.map((track, index) => (
              <Draggable key={track.id} draggableId={track.id} index={index}>
                {(provided: DraggableProvided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <PlaylistItem
                      track={track}
                      onRemove={() => onTrackRemove(track.id)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
} 