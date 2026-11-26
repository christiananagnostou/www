const TILE = 20
const LEVELS = 16
const GLYPHS = ['.', ':', '|', ',']

function surface(width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

// Stamp pre-rendered punctuation; no font measurement or text painting during motion.
function makeType() {
  const sheet = surface(GLYPHS.length * TILE, LEVELS * TILE)
  const ctx = sheet.getContext('2d')
  if (!ctx) return null
  ctx.font = '18px monospace'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#c4c0b7'
  for (const [col, glyph] of GLYPHS.entries()) {
    const { actualBoundingBoxAscent, actualBoundingBoxDescent } = ctx.measureText(glyph)
    const baseline = (TILE + actualBoundingBoxAscent - actualBoundingBoxDescent) / 2
    for (let level = 0; level < LEVELS; level++) {
      ctx.globalAlpha = (level / (LEVELS - 1)) * 0.68
      ctx.fillText(glyph, (col + 0.5) * TILE, level * TILE + baseline)
    }
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
  const glyphs = new Uint8Array(band / 4)
  for (let i = 0; i < glyphs.length; i++) {
    const choice = (Math.imul(i + 1, 2654435761) >>> 16) % 8
    // Flutes and trunks get short vertical strokes; the ground gets quiet points.
    glyphs[i] = data[i * 4 + 1] < 157 ? (choice < 4 ? 2 : choice < 6 ? 1 : 0) : choice === 7 ? 3 : 0
  }

  return (phase: number, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height)
    const from = Math.min(Math.floor(phase), 2)
    const t = phase - from
    const a = from * band
    const b = a + band
    const size = Math.min(16, Math.max(7, Math.sqrt((width * height) / glyphs.length)))
    // Crop into both flanks on a phone rather than squeezing a wide vista into a strip.
    const span = Math.max(width, Math.min(width * 1.18, height * 0.77))
    const left = (width - span) / 2
    // Pin the near left column. On wide screens the far bend sits to the right of the copy.
    const bias = Math.min(0.45, Math.max(0, (width - 800) / 1100))
    const horizon = 0.43 + 0.16 * Math.min(1, width / height)
    const stride = width < 580 ? 8 : 4

    for (let i = 0; i < band; i += stride) {
      const fa = a + i
      const fb = b + i
      const v = (data[fa + 1] + (data[fb + 1] - data[fa + 1]) * t) / 255
      const y = (v < 0.6 ? (v * horizon) / 0.6 : horizon + ((v - 0.6) / 0.4) * (1 - horizon)) * height
      const u = (data[fa] + (data[fb] - data[fa]) * t) / 255
      const right = Math.max(0, (u - 0.32) / 0.68)
      const x = left + (u + bias * right * (1 - right)) * span
      if (x < -size || x > width + size) continue
      const level = Math.round(data[fa + 2] + (data[fb + 2] - data[fa + 2]) * t)
      ctx.drawImage(type, glyphs[i >>> 2] * TILE, level * TILE, TILE, TILE, x - size / 2, y - size / 2, size, size)
    }
  }
}
