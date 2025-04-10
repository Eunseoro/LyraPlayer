import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Track } from '../types'

interface Playlist {
  id: string
  name: string
  tracks: Track[]
}

interface PlayerState {
  // 재생목록
  playlists: Playlist[]
  currentPlaylistId: string | null
  currentTrack: Track | null

  // 액션
  setCurrentPlaylistId: (playlistId: string | null) => void
  setCurrentTrack: (track: Track | null) => void
  addPlaylist: (name: string) => void
  removePlaylist: (playlistId: string) => void
  renamePlaylist: (playlistId: string, newName: string) => void
  addTrackToPlaylist: (playlistId: string, track: Track) => void
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void
  reorderTracksInPlaylist: (playlistId: string, tracks: Track[]) => void
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      // 초기 상태
      playlists: [],
      currentPlaylistId: null,
      currentTrack: null,

      // 액션
      setCurrentPlaylistId: (currentPlaylistId) => set({ currentPlaylistId }),
      setCurrentTrack: (currentTrack) => set({ currentTrack }),
      addPlaylist: (name) =>
        set((state) => ({
          playlists: [
            ...state.playlists,
            {
              id: crypto.randomUUID(),
              name,
              tracks: [],
            },
          ],
        })),
      removePlaylist: (playlistId) =>
        set((state) => ({
          playlists: state.playlists.filter((playlist) => playlist.id !== playlistId),
          currentPlaylistId:
            state.currentPlaylistId === playlistId ? null : state.currentPlaylistId,
        })),
      renamePlaylist: (playlistId, newName) =>
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId ? { ...playlist, name: newName } : playlist
          ),
        })),
      addTrackToPlaylist: (playlistId, track) =>
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId
              ? { ...playlist, tracks: [...playlist.tracks, track] }
              : playlist
          ),
        })),
      removeTrackFromPlaylist: (playlistId, trackId) =>
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId
              ? {
                  ...playlist,
                  tracks: playlist.tracks.filter((track) => track.id !== trackId),
                }
              : playlist
          ),
          currentTrack:
            state.currentTrack?.id === trackId ? null : state.currentTrack,
        })),
      reorderTracksInPlaylist: (playlistId, tracks) =>
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId ? { ...playlist, tracks } : playlist
          ),
        })),
    }),
    {
      name: 'player-storage',
    }
  )
) 