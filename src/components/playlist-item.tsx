import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Track } from '../lib/store'

interface PlaylistItemProps {
  track: Track
  isSelected: boolean
  onSelect: () => void
  onRemove: () => void
}

export function PlaylistItem({ track, isSelected, onSelect, onRemove }: PlaylistItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: track.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
        isSelected ? 'bg-primary/10' : 'hover:bg-muted'
      }`}
      onClick={onSelect}
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
          onRemove()
        }}
        className="p-2 hover:bg-muted rounded-full"
      >
        ×
      </button>
    </div>
  )
} 