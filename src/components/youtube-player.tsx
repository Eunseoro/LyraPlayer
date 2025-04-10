import { useYouTubePlayer } from '../hooks/use-youtube-player'

interface YouTubePlayerProps {
  videoId: string
  onReady?: (player: YT.Player) => void
  onStateChange?: (event: YT.OnStateChangeEvent) => void
}

export function YouTubePlayer({ videoId, onReady, onStateChange }: YouTubePlayerProps) {
  const { playerRef } = useYouTubePlayer({
    videoId,
    onReady,
    onStateChange,
  })

  return (
    <div className="w-full h-full">
      <div ref={playerRef} className="w-full h-full" />
    </div>
  )
} 