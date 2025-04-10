import { Track } from '../../types'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

interface PlaylistProps {
  tracks: Track[]
  currentTrackId?: string
  onTrackSelect: (track: Track) => void
  onTrackRemove: (trackId: string) => void
  onTracksReorder: (startIndex: number, endIndex: number) => void
  onTrackAdd: (track: Track) => void
}

export function Playlist({
  tracks,
  currentTrackId,
  onTrackSelect,
  onTrackRemove,
  onTracksReorder,
  onTrackAdd,
}: PlaylistProps) {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    onTracksReorder(result.source.index, result.destination.index)
  }

  return (
    <div className="p-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="playlist">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {tracks.map((track, index) => (
                <Draggable key={track.id} draggableId={track.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                        currentTrackId === track.id
                          ? 'bg-primary/10'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => onTrackSelect(track)}
                    >
                      <img
                        src={track.thumbnailUrl}
                        alt={track.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="ml-3 flex-1">
                        <h3 className="font-medium">{track.title}</h3>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onTrackRemove(track.id)
                        }}
                        className="p-2 hover:bg-muted rounded-full"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
} 