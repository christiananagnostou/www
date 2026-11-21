import { statSync } from 'node:fs'
import { join } from 'node:path'
import { expect, it } from 'vitest'

import { IMG_PRESS_BATCH, IMG_PRESS_SAMPLES } from './imgPressBatch'

it('matches the batch measurements to the original and exported JPEGs on disk', () => {
  const imageRoot = join(import.meta.dirname, '../../public/img')
  let original = 0
  let output = 0
  for (const sample of IMG_PRESS_SAMPLES) {
    const sourceBytes = statSync(join(imageRoot, 'art/photography', sample.file)).size
    const exportBytes = statSync(join(imageRoot, 'projects/imgpress', sample.file)).size
    expect([sample.original, sample.output]).toEqual([sourceBytes, exportBytes])
    original += sourceBytes
    output += exportBytes
  }
  expect(IMG_PRESS_BATCH).toEqual({ count: IMG_PRESS_SAMPLES.length, original, output })
})
