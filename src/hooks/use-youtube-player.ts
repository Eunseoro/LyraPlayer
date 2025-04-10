import { useEffect, useRef } from 'react'

interface UseYouTubePlayerProps {
  videoId: string
  onReady?: (player: YT.Player) => void
  onStateChange?: (event: YT.OnStateChangeEvent) => void
}

export function useYouTubePlayer({ videoId, onReady, onStateChange }: UseYouTubePlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null)
  const playerInstanceRef = useRef<YT.Player | null>(null)
  const apiLoadedRef = useRef(false)

  useEffect(() => {
    if (!playerRef.current) return

    const loadYouTubeAPI = () => {
      return new Promise<void>((resolve) => {
        if (window.YT) {
          resolve()
          return
        }

        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        const firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

        window.onYouTubeIframeAPIReady = () => {
          apiLoadedRef.current = true
          resolve()
        }
      })
    }

    const initializePlayer = async () => {
      try {
        await loadYouTubeAPI()
        if (!playerRef.current) return

        playerInstanceRef.current = new window.YT.Player(playerRef.current, {
          height: '100%',
          width: '100%',
          videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            modestbranding: 1,
            rel: 0,
          },
          events: {
            onReady: (event) => {
              onReady?.(event.target)
            },
            onStateChange: (event) => {
              onStateChange?.(event)
            },
          },
        })
      } catch (error) {
        console.error('YouTube 플레이어 초기화 중 오류 발생:', error)
      }
    }

    initializePlayer()

    return () => {
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy()
      }
    }
  }, [videoId, onReady, onStateChange])

  return { playerRef }
} 