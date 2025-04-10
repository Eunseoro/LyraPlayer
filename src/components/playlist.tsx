import { useState, useRef, useEffect } from 'react'
import { usePlayerStore } from '../lib/store'
import { extractVideoId, getVideoInfo } from '../lib/youtube'
import { PlaylistItem } from './playlist-item'
import { Plus, X, Trash2 } from 'lucide-react'

export function Playlist() {
  const {
    playlists,
    currentPlaylistId,
    currentTrack,
    setCurrentPlaylistId,
    setCurrentTrack,
    addPlaylist,
    removePlaylist,
    renamePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    reorderTracksInPlaylist,
  } = usePlayerStore()

  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAddingPlaylist, setIsAddingPlaylist] = useState(false)
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)

  const currentPlaylist = playlists.find((p) => p.id === currentPlaylistId)

  useEffect(() => {
    if (isAddingPlaylist && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isAddingPlaylist])

  useEffect(() => {
    if (editingPlaylistId && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [editingPlaylistId])

  const handleAddPlaylist = () => {
    if (newPlaylistName.trim()) {
      addPlaylist(newPlaylistName.trim())
      setNewPlaylistName('')
      setIsAddingPlaylist(false)
    }
  }

  const handleRenamePlaylist = (playlistId: string) => {
    if (editingName.trim()) {
      renamePlaylist(playlistId, editingName.trim())
      setEditingPlaylistId(null)
      setEditingName('')
    }
  }

  const handleDeletePlaylist = () => {
    if (currentPlaylistId) {
      removePlaylist(currentPlaylistId)
      setShowDeleteConfirm(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const videoId = extractVideoId(url)
      if (!videoId) {
        throw new Error('유효한 YouTube URL을 입력해주세요.')
      }

      const videoInfo = await getVideoInfo(videoId)
      if (currentPlaylistId) {
        addTrackToPlaylist(currentPlaylistId, {
          id: videoId,
          videoId,
          title: videoInfo.title,
          thumbnailUrl: videoInfo.thumbnailUrl,
          duration: videoInfo.duration,
        })
      }
      setUrl('')
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* 재생목록 탭 */}
      <div className="flex items-center gap-0.5 overflow-x-auto pb-2 border-b border-border">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className={`group flex items-center gap-2 px-3 py-2 cursor-pointer whitespace-nowrap border-b-2 ${
              playlist.id === currentPlaylistId
                ? 'border-primary text-primary'
                : 'border-transparent hover:border-muted-foreground/20'
            }`}
            onClick={() => setCurrentPlaylistId(playlist.id)}
          >
            {editingPlaylistId === playlist.id ? (
              <input
                ref={editInputRef}
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="flex-1 px-1 py-0 text-sm border border-input rounded bg-background text-foreground"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRenamePlaylist(playlist.id)
                  } else if (e.key === 'Escape') {
                    setEditingPlaylistId(null)
                    setEditingName('')
                  }
                }}
                onBlur={() => {
                  if (editingName.trim()) {
                    handleRenamePlaylist(playlist.id)
                  } else {
                    setEditingPlaylistId(null)
                    setEditingName('')
                  }
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span
                className="truncate max-w-[150px]"
                onDoubleClick={(e) => {
                  e.stopPropagation()
                  setEditingPlaylistId(playlist.id)
                  setEditingName(playlist.name)
                }}
              >
                {playlist.name}
              </span>
            )}
          </div>
        ))}
        {/* 새 재생목록 추가 버튼 */}
        <div className={`flex items-center transition-all duration-200 ${isAddingPlaylist ? 'w-[200px]' : 'w-9'}`}>
          {isAddingPlaylist ? (
            <div className="flex items-center gap-2 w-full">
              <input
                ref={inputRef}
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="새 재생목록 이름"
                className="flex-1 px-2 py-1 text-sm border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddPlaylist()
                  } else if (e.key === 'Escape') {
                    setIsAddingPlaylist(false)
                    setNewPlaylistName('')
                  }
                }}
                onBlur={() => {
                  if (!newPlaylistName.trim()) {
                    setIsAddingPlaylist(false)
                  }
                }}
              />
              <button
                onClick={handleAddPlaylist}
                className="p-1 hover:bg-muted/50 rounded"
                disabled={!newPlaylistName.trim()}
                aria-label="재생목록 추가"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingPlaylist(true)}
              className="p-2 hover:bg-muted/50 rounded-lg"
              aria-label="재생목록 추가"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {currentPlaylist && (
        <>
          {/* URL 입력 폼 */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="YouTube URL을 입력하세요"
                className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
              >
                {isLoading ? '추가 중...' : '추가'}
              </button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </form>

          {/* 재생목록 트랙 목록 */}
          <div className="flex flex-col gap-2">
            {currentPlaylist.tracks.map((track) => (
              <PlaylistItem
                key={track.id}
                track={track}
                isSelected={track.id === currentTrack?.id}
                onSelect={() => setCurrentTrack(track)}
                onRemove={() => {
                  if (currentPlaylistId) {
                    removeTrackFromPlaylist(currentPlaylistId, track.id)
                  }
                }}
              />
            ))}
          </div>

          {/* 재생목록 삭제 버튼 */}
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              재생목록 삭제
            </button>
          </div>
        </>
      )}

      {/* 삭제 확인 팝업 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">재생목록 삭제</h3>
            <p className="text-muted-foreground mb-6">
              정말로 "{currentPlaylist?.name}" 재생목록을 삭제하시겠습니까?
              <br />
              이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm hover:bg-muted rounded-md transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDeletePlaylist}
                className="px-4 py-2 text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 