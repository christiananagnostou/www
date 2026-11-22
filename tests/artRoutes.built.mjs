import assert from 'node:assert/strict'
import { after, before, it } from 'node:test'
import { JSDOM } from 'jsdom'

import { startBuiltApp } from './helpers/builtApp.mjs'

let site
before(async () => {
  site = await startBuiltApp()
})
after(() => site?.close())

// Exercise the real rewrite and prerendered HTML, before any client-side filtering.
for (const tag of [null, 'Cars', 'B&W']) {
  it(`serves the ${tag ?? 'All'} gallery in the first response`, async () => {
    const response = await fetch(`${site.origin}/art${tag ? `?tag=${encodeURIComponent(tag)}` : ''}`)
    assert.equal(response.status, 200)
    const document = new JSDOM(await response.text()).window.document
    const selected = document.querySelector('[aria-label="Filter photographs"] [aria-pressed="true"]')
    assert.equal(selected?.textContent, tag ?? 'All')
    const tiles = document.querySelectorAll('button[aria-label^="Open full screen image:"]')
    assert.ok(tiles.length > 0)
    if (tag) {
      for (const tile of tiles) {
        assert.ok(
          Array.from(tile.parentElement.querySelectorAll('.tags button')).some((button) => button.textContent === tag)
        )
      }
    }
  })
}
