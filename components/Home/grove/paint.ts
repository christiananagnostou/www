const TILE = 20
const LEVELS = 16
const INKS = ['#84b0eb', '#e4d8c6', '#ffb25c']
const GLYPHS = ['.', ':', '|', '/', ',']

function surface(width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

// Stamp pre-rendered punctuation; no font measurement or text painting during motion.
function makeType() {
  const sheet = surface(GLYPHS.length * TILE, INKS.length * LEVELS * TILE)
  const ctx = sheet.getContext('2d')
  if (!ctx) return null
  ctx.font = 'bold 19px monospace'
  ctx.textAlign = 'center'
  for (const [col, glyph] of GLYPHS.entries()) {
    const { actualBoundingBoxAscent, actualBoundingBoxDescent } = ctx.measureText(glyph)
    const baseline = (TILE + actualBoundingBoxAscent - actualBoundingBoxDescent) / 2
    INKS.forEach((ink, hue) => {
      ctx.fillStyle = ink
      for (let level = 0; level < LEVELS; level++) {
        ctx.globalAlpha = level / (LEVELS - 1)
        ctx.fillText(glyph, (col + 0.5) * TILE, (hue * LEVELS + level) * TILE + baseline)
      }
    })
  }
  return sheet
}

// Each of the four bands in the lossless map contains the same marks, in the same
// order. Its RGB bytes are x, y and tone; the artwork itself is never downloaded.
export function makePainter(canvas: HTMLCanvasElement, map: HTMLImageElement) {
  const ctx = canvas.getContext('2d')
  const reader = surface(map.naturalWidth, map.naturalHeight).getContext('2d')
  const type = makeType()
  if (!ctx || !reader || !type) return null
  reader.drawImage(map, 0, 0)
  const { data } = reader.getImageData(0, 0, map.naturalWidth, map.naturalHeight)
  const band = data.length / 4
  for (let i = band; i < data.length; i++) data[i] ^= data[i - band]

  return (phase: number, width: number, height: number, pageHeight: number, offset: number) => {
    ctx.clearRect(0, 0, width, height)
    const from = Math.min(Math.floor(phase), 2)
    const t = phase - from
    const a = from * band
    const b = a + band
    const size = Math.min(14, Math.max(6, Math.sqrt((width * pageHeight) / (band / 4)) * 1.42))
    // Recompose for a tall surface. Keep the capitals legible and the vanishing
    // point near mid-page, leaving the foreground gravel below the bend.
    const horizon = 0.43 + 0.15 * Math.min(1, width / pageHeight)
    const stride = width < 310 ? 8 : 4

    for (let i = 0; i < band; i += stride) {
      const fa = a + i
      const fb = b + i
      const v = (data[fa + 1] + (data[fb + 1] - data[fa + 1]) * t) / 255
      const y = (v < 0.6 ? (v * horizon) / 0.6 : horizon + ((v - 0.6) / 0.4) * (1 - horizon)) * pageHeight - offset
      if (y < -size || y > height + size) continue
      const x = ((data[fa] + (data[fb] - data[fa]) * t) / 255) * width
      const first = data[fa + 2]
      const last = data[fb + 2]
      // Switch inks at slightly different times so the whole grove never flashes.
      const seed = Math.imul((i >>> 2) + 1, 2654435761) >>> 0
      const hue = (t > (seed & 255) / 256 ? last : first) >>> 4
      const level = Math.round((first & 15) * (1 - t) + (last & 15) * t)
      const choice = (seed >>> 16) % 8
      const glyph = choice < 3 ? 0 : choice < 6 ? 1 : data[i + 1] < 163 ? 2 : choice === 7 ? 3 : 4
      ctx.drawImage(
        type,
        glyph * TILE,
        (hue * LEVELS + level) * TILE,
        TILE,
        TILE,
        x - size / 2,
        y - size / 2,
        size,
        size
      )
    }
  }
}
