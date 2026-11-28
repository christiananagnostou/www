import assert from 'node:assert/strict'
import { after, before, it } from 'node:test'
import { JSDOM } from 'jsdom'
import { firefox } from 'playwright-core'

import { startBuiltApp } from './helpers/builtApp.mjs'

const focused = (el) => el === document.activeElement
const hasFocusRing = (el) => el === document.activeElement && getComputedStyle(el).outlineStyle !== 'none'

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

it('opens a photograph without selecting an arrow and returns focus without moving the grid', async (t) => {
  const browser = await firefox.launch()
  t.after(() => browser.close())
  const page = await browser.newPage({ hasTouch: true, viewport: { width: 390, height: 844 } })
  await page.goto(`${site.origin}/art`)
  await page.waitForFunction(() => window.next?.router?.isReady)
  const photo = page.getByRole('button', { name: /^Open full screen image:/ }).nth(4)
  const viewer = page.getByRole('dialog', { name: 'Full screen photograph' })
  const previous = viewer.getByRole('button', { name: 'Previous image' })

  await photo.scrollIntoViewIfNeeded()
  const y = await page.evaluate(() => scrollY)
  assert.ok(y > 0, 'Start partway down the gallery')
  await photo.tap({ position: { x: 12, y: 12 } })
  await viewer.waitFor()
  assert.ok(
    await viewer
      .getByRole('status')
      .evaluate(
        (el) => el.contains(document.activeElement) && getComputedStyle(document.activeElement).outlineStyle === 'none'
      ),
    'Open on the photo caption without drawing a ring'
  )
  await viewer.getByRole('button', { name: 'Close full screen view' }).tap()
  await viewer.waitFor({ state: 'detached' })
  assert.ok(await photo.evaluate(focused))
  assert.equal(await photo.evaluate(hasFocusRing), false)

  await page.keyboard.press('Enter')
  await viewer.waitFor()
  await page.keyboard.press('Tab')
  assert.ok(await previous.evaluate(hasFocusRing))
  const caption = await viewer.getByRole('status').textContent()
  await page.keyboard.press('ArrowRight')
  await page.waitForFunction(
    (oldCaption) => document.querySelector('dialog [role="status"]').textContent !== oldCaption,
    caption
  )
  await page.keyboard.press('Escape')
  await viewer.waitFor({ state: 'detached' })
  assert.ok(await photo.evaluate(hasFocusRing))
  assert.equal(await page.evaluate(() => scrollY), y)
})
