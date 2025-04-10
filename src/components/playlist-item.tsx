import { useCallback, useMemo } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X } from 'lucide-react'
import { usePlayerStore } from '../lib/store'
import { Track } from '../lib/store'

interface PlaylistItemProps {
  track: Track
  isSelected: boolean
  onSelect: (track: Track) => void
  onRemove: (trackId: string) => void
}

export function PlaylistItem({ track, isSelected, onSelect, onRemove }: PlaylistItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: track.id })

  const style = useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition,
  }), [transform, transition])

  const handleSelect = useCallback(() => {
    onSelect(track)
  }, [track, onSelect])

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onRemove(track.id)
  }, [track.id, onRemove])

  const formatDuration = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }, [])

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-muted ${
        isSelected ? 'bg-muted' : ''
      }`}
      onClick={handleSelect}
    >
      <div
        {...attributes}
        {...listeners}
        className="p-1 hover:bg-muted-foreground/10 rounded cursor-grab"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>
      <img
        src={track.thumbnailUrl}
        alt={track.title}
        className="w-12 h-12 rounded object-cover ml-2"
      />
      <div className="flex-1 ml-2 min-w-0">
        <h3 className="text-sm font-medium truncate">{track.title}</h3>
        <p className="text-xs text-muted-foreground">{formatDuration(track.duration)}</p>
      </div>
      <button
        onClick={handleRemove}
        className="p-1 hover:bg-muted-foreground/10 rounded"
        aria-label="트랙 제거"
      >
        <X className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  )
} 