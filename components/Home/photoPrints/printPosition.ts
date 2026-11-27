// The first stops are a frame apart. Measure the shorter final stride from the
// actual scroll range so input and fallback rendering use the CSS layout.
export function printPosition(rail: HTMLDivElement, count: number) {
  const width = rail.clientWidth
  if (!width) return 0
  const penultimate = count - 2
  const end = rail.scrollWidth - width
  const left = Math.max(0, Math.min(end, rail.scrollLeft))
  if (end - left < 1 && end > 0) return count - 1
  const split = penultimate * width
  if (left <= split) return left / width
  return penultimate + (left - split) / Math.max(1, end - split)
}
