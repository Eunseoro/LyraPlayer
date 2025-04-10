declare global {
  interface Window {
    YT: typeof YT
    onYouTubeIframeAPIReady: () => void
  }
}

declare namespace YT {
  interface Player {
    playVideo(): void
    pauseVideo(): void
    stopVideo(): void
    seekTo(seconds: number, allowSeekAhead: boolean): void
    getCurrentTime(): number
    getDuration(): number
    getPlayerState(): number
    getVolume(): number
    setVolume(volume: number): void
    isMuted(): boolean
    mute(): void
    unMute(): void
    loadVideoById(videoId: string, startSeconds?: number): void
    cueVideoById(videoId: string, startSeconds?: number): void
  }

  interface PlayerOptions {
    height: string
    width: string
    videoId: string
    playerVars?: {
      autoplay?: number
      controls?: number
      modestbranding?: number
      rel?: number
    }
    events?: {
      onReady?: (event: { target: Player }) => void
      onStateChange?: (event: OnStateChangeEvent) => void
    }
  }

  interface OnStateChangeEvent {
    data: number
    target: Player
  }

  const Player: {
    new (elementId: string | HTMLElement, options: PlayerOptions): Player
  }

  enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
  }
} 