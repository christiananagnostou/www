const KM_TO_MI = 0.621371
const M_TO_FT = 3.28084

export const convertDistance = (meters: number): string => {
  const miles = meters * 0.000621371
  return `${miles.toFixed(2)} mi`
}

export const convertElevation = (meters: number): string => {
  const feet = meters * M_TO_FT
  return `${feet.toFixed(2)} ft`
}

export const convertSpeed = (mps: number): string => {
  const mph = mps * 2.23694
  return `${mph.toFixed(2)} mph`
}

export const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export const computePace = (movingTime: number, distanceMeters: number): string => {
  const distanceMiles = distanceMeters * 0.000621371
  if (distanceMiles === 0) return '0:00 /mi'
  const secondsPerMile = movingTime / distanceMiles
  const minutes = Math.floor(secondsPerMile / 60)
  const seconds = Math.round(secondsPerMile % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')} /mi`
}
