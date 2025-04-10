/**
 * 시간을 MM:SS 형식으로 포맷팅합니다.
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * 시간을 정규화합니다 (0 ~ duration 사이의 값으로).
 */
export function normalizeTime(time: number, duration: number): number {
  return Math.max(0, Math.min(duration, time))
}

/**
 * 볼륨을 정규화합니다 (0 ~ 100 사이의 값으로).
 */
export function normalizeVolume(volume: number): number {
  return Math.max(0, Math.min(100, volume))
} 