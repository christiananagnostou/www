// Bytes on disk with the Shareable JPEG preset at 75% quality and 50% dimensions.
export const IMG_PRESS_SAMPLES = [
  { file: 'sonoma_truck.jpg', title: 'Sonoma Truck', original: 208212, output: 74420 },
  { file: 'golden_gate.jpg', title: 'Golden Gate', original: 82211, output: 35465 },
  { file: 'hmb_chess.jpg', title: 'Half Moon Bay Chess', original: 275977, output: 118433 },
] as const

export const IMG_PRESS_BATCH = {
  count: IMG_PRESS_SAMPLES.length,
  original: IMG_PRESS_SAMPLES.reduce((sum, { original }) => sum + original, 0),
  output: IMG_PRESS_SAMPLES.reduce((sum, { output }) => sum + output, 0),
}

export const formatKilobytes = (bytes: number, decimals = 1) => (bytes / 1000).toFixed(decimals) + ' kB'
