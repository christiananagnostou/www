import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { beforeEach, describe, expect, it, vi } from 'vitest'

const script = readFileSync(join(process.cwd(), 'public/scripts/json-lens.js'), 'utf8')

describe('JSON Lens bookmarklet', () => {
  beforeEach(() => {
    document.head.replaceChildren()
    document.body.replaceChildren()
    document.title = 'API response'
    vi.restoreAllMocks()
  })

  it('renders fields, nested groups, arrays, booleans, and dates from the current response', () => {
    const response = {
      reference: 'EXAMPLE-123',
      ready: true,
      metadata: { createdAt: '2026-01-02T12:30:00.000Z' },
      events: [{ code: 'OPENED', complete: false }],
    }
    document.body.textContent = JSON.stringify(response)

    window.eval(script)
    ;(window as typeof window & { JSONLens: () => void }).JSONLens()

    expect(document.querySelector('#json-lens-root')).not.toBeNull()
    expect(document.body.textContent).toContain('EXAMPLE-123')
    expect(document.body.textContent).toContain('Metadata')
    expect(document.body.textContent).toContain('Events')
    expect(document.body.textContent).toContain('OPENED')
    expect(document.querySelector('.jl-bool-true')).not.toBeNull()
    expect(document.querySelector('.jl-bool-false')).not.toBeNull()
    expect(document.querySelector('.jl-date-source')?.textContent).toBe(response.metadata.createdAt)
  })

  it('leaves the page unchanged when its text is not valid JSON', () => {
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => undefined)
    document.body.textContent = 'Not a JSON response'

    window.eval(script)
    ;(window as typeof window & { JSONLens: () => void }).JSONLens()

    expect(alert).toHaveBeenCalledWith('JSON Lens could not find a valid JSON response on this page.')
    expect(document.body.textContent).toBe('Not a JSON response')
  })
})
