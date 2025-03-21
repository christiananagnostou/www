export const KM_TO_MI = 0.621371
export const M_TO_MI = KM_TO_MI / 1000
export const M_TO_FT = 3.28084
export const MPS_TO_MPH = 2.23694

export const convertDistance = (meters: number): string => {
  if (meters === 0) return ''
  const miles = meters * M_TO_MI
  return `${miles.toFixed(2)} mi`
}

export const convertElevation = (meters: number): string => {
  if (meters === 0) return ''
  const feet = meters * M_TO_FT
  return `${feet.toFixed(2)} ft`
}

export const convertSpeed = (mps: number): string => {
  if (mps === 0) return ''
  const mph = mps * MPS_TO_MPH
  return `${mph.toFixed(2)} mph`
}

export const formatTime = (seconds: number): string => {
  if (seconds === 0) return ''
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export const computePace = (movingTime: number, distanceMeters: number): string => {
  const distanceMiles = distanceMeters * M_TO_MI
  if (distanceMiles === 0) return ''
  const secondsPerMile = movingTime / distanceMiles
  const minutes = Math.floor(secondsPerMile / 60)
  const seconds = Math.round(secondsPerMile % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')} /mi`
}
