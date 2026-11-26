// Regenerate the compact coordinate map from the four artwork PNGs, in story order:
// node scripts/generate-grove.mjs colonnade.png bark.png grove.png turn.png
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const sources = process.argv.slice(2)
if (sources.length !== 4) throw new Error('Expected four keyframe image paths')

const columns = 156
const rows = 146
const mapWidth = 64
const mapHeight = 64
const count = mapWidth * mapHeight

// The same source cell always gets the same sampling priority in every frame.
function noise(index) {
  let bits = Math.imul(index + 1, 0x45d9f3b)
  bits = Math.imul(bits ^ (bits >>> 16), 0x45d9f3b)
  return ((bits >>> 0) + 1) / 0x100000001
}

async function sample(source) {
  const pixels = await sharp(source).removeAlpha().greyscale().resize(columns, rows, { fit: 'fill' }).raw().toBuffer()
  const points = []
  for (let i = 0; i < columns * rows; i++) {
    const x = i % columns
    const y = Math.floor(i / columns)
    // Keep connected strokes in either direction: both fluting and the curved
    // rim of the trail survive, while isolated flecks have little weight.
    const vertical = Math.min(pixels[y > 0 ? i - columns : i], pixels[y < rows - 1 ? i + columns : i])
    const horizontal = Math.min(pixels[x > 0 ? i - 1 : i], pixels[x < columns - 1 ? i + 1 : i])
    const light = (pixels[i] + Math.max(vertical, horizontal)) / 2 - 26
    if (light <= 4) continue
    // Let the road read as an opening, not as a carpet of gravel. Fade its
    // broadening foreground while leaving the flanking roots and bases intact.
    const depth = Math.max(0, (y / rows - 0.54) / 0.46)
    const fromCenter = Math.abs(x / columns - (0.72 - 0.28 * depth))
    const road = depth * Math.max(0, 1 - fromCenter / (0.045 + 0.65 * depth))
    const strength = light * (1 - 0.88 * road)
    points.push({
      cell: i,
      x,
      y,
      tone: Math.round(2 + 13 * Math.min(1, strength / 94)),
      rank: (0.45 + 0.55 * noise(i)) / strength,
    })
  }
  if (points.length < count) throw new Error('Not enough ink in ' + source)
  return points
    .toSorted((a, b) => a.rank - b.rank)
    .slice(0, count)
    .toSorted((a, b) => a.cell - b.cell)
}

// Pin shared marks exactly. Pair the rest within successively smaller spatial neighborhoods
// so a column grows roots locally instead of turning into a screen-wide particle shuffle.
function correspond(previous, next) {
  const available = new Map(next.map((p) => [p.cell, p]))
  const ordered = []
  const moving = []
  previous.forEach((p, index) => {
    if (available.has(p.cell)) {
      ordered[index] = available.get(p.cell)
      available.delete(p.cell)
    } else {
      moving.push({ ...p, index })
    }
  })
  function pair(a, b, depth = 0) {
    if (!a.length) return
    if (a.length === 1) {
      ordered[a[0].index] = b[0]
      return
    }
    const axis = depth % 2 ? 'y' : 'x'
    const compare = (p, q) => p[axis] - q[axis] || p.cell - q.cell
    a.sort(compare)
    b.sort(compare)
    const mid = a.length >>> 1
    pair(a.slice(0, mid), b.slice(0, mid), depth + 1)
    pair(a.slice(mid), b.slice(mid), depth + 1)
  }
  pair(moving, Array.from(available.values()))
  return ordered
}

const frames = await Promise.all(sources.map(sample))
const map = Buffer.alloc(count * 3 * frames.length)
let previous
for (const [n, points] of frames.entries()) {
  previous = previous ? correspond(previous, points) : points
  previous.forEach((p, i) => {
    const offset = (n * count + i) * 3
    map[offset] = Math.round(((p.x + 0.5) / columns) * 255)
    map[offset + 1] = Math.round(((p.y + 0.5) / rows) * 255)
    map[offset + 2] = p.tone
  })
}
// Store changes against the preceding band; the many stationary coordinates compress to zeros.
for (let i = map.length - 1; i >= count * 3; i--) map[i] ^= map[i - count * 3]
// Lossless RGB is data, not a display image: one texel = x, y, ink strength.
const output = fileURLToPath(new URL('../components/Home/grove/keyframes.png', import.meta.url))
console.log(
  await sharp(map, { raw: { width: mapWidth, height: mapHeight * frames.length, channels: 3 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(output)
)
