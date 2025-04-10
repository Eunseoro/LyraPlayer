import { useEffect, useRef, useState, useCallback } from 'react'
import { YouTubePlayer } from './components/youtube-player'
import { Playlist } from './components/playlist'
import { usePlayerStore } from './lib/store'
import { extractVideoId, getVideoInfo } from './lib/youtube'
import { Moon, Sun } from 'lucide-react'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  const playerRef = useRef<YT.Player | null>(null)
  const {
    currentTrack,
    tracks,
    setCurrentTrack,
    addTrack,
    removeTrack,
    reorderTracks,
  } = usePlayerStore()

  // 다크 모드 토글
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  // 다크 모드 적용
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // 플레이어 준비 시
  const handlePlayerReady = useCallback((player: YT.Player) => {
    try {
      playerRef.current = player
      if (currentTrack) {
        player.cueVideoById(currentTrack.videoId)
      }
    } catch (error) {
      console.error('플레이어 준비 중 오류 발생:', error)
    }
  }, [currentTrack])

  // 현재 트랙이 변경될 때 플레이어 업데이트
  useEffect(() => {
    if (playerRef.current && currentTrack) {
      try {
        playerRef.current.cueVideoById(currentTrack.videoId)
        playerRef.current.playVideo()
      } catch (error) {
        console.error('트랙 변경 중 오류 발생:', error)
      }
    }
  }, [currentTrack])

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          LyraPlayer
        </h1>
        <button
          onClick={toggleDarkMode}
          className="p-2 hover:bg-muted rounded-full transition-colors"
          aria-label={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* 플레이어 영역 */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden shadow-lg">
              {currentTrack ? (
                <YouTubePlayer
                  videoId={currentTrack.videoId}
                  onReady={handlePlayerReady}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-muted-foreground">재생할 트랙을 선택해주세요</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 재생목록 */}
        <div className="border-t border-border">
          <Playlist />
        </div>
      </main>
    </div>
  )
}

export default App
