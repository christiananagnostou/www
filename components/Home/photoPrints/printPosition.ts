export function measureRail(rail: HTMLDivElement) {
  const width = rail.clientWidth
  return { width, end: rail.scrollWidth - width }
}

// The first stops are a frame apart; the last uses the space left in the actual rail.
export function printPosition(offset: number, count: number, { width, end }: ReturnType<typeof measureRail>) {
  if (!width) return 0
  const penultimate = count - 2
  const left = Math.max(0, Math.min(end, offset))
  if (end - left < 1 && end > 0) return count - 1
  const split = penultimate * width
  if (left <= split) return left / width
  return penultimate + (left - split) / Math.max(1, end - split)
}
