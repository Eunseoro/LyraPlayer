interface VideoInfo {
  id: string
  title: string
  thumbnailUrl: string
  duration: number
}

export function extractVideoId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[7].length === 11 ? match[7] : null
}

export async function getVideoInfo(videoId: string): Promise<VideoInfo> {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
  )
  const data = await response.json()

  if (!data.items || data.items.length === 0) {
    throw new Error('Video not found')
  }

  const video = data.items[0]
  const duration = parseDuration(video.contentDetails.duration)

  return {
    id: videoId,
    title: video.snippet.title,
    thumbnailUrl: video.snippet.thumbnails.default.url,
    duration,
  }
}

function parseDuration(duration: string): number {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
  if (!match) return 0

  const hours = (match[1] || '').replace('H', '')
  const minutes = (match[2] || '').replace('M', '')
  const seconds = (match[3] || '').replace('S', '')

  return (
    (parseInt(hours) || 0) * 3600 +
    (parseInt(minutes) || 0) * 60 +
    (parseInt(seconds) || 0)
  )
} 