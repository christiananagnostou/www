import assert from 'node:assert/strict'
import { once } from 'node:events'
import { createServer } from 'node:http'
import { after, before, it } from 'node:test'
import { JSDOM } from 'jsdom'
import next from 'next'

// Exercise the real rewrite and prerendered HTML, before any client-side filtering.
const app = next({ dev: false, hostname: '127.0.0.1' })
const server = createServer(app.getRequestHandler())
let origin

before(async () => {
  await app.prepare()
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  origin = `http://127.0.0.1:${server.address().port}`
})

after(async () => {
  await new Promise((resolve) => server.close(resolve))
  await app.close()
})

for (const tag of [null, 'Cars', 'B&W']) {
  it(`serves the ${tag ?? 'All'} gallery in the first response`, async () => {
    const response = await fetch(`${origin}/art${tag ? `?tag=${encodeURIComponent(tag)}` : ''}`)
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
