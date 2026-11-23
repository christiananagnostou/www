import assert from 'node:assert/strict'
import { it } from 'node:test'
import { firefox } from 'playwright-core'

import { startBuiltApp } from './helpers/builtApp.mjs'

// Start on Contact so the browser sees the very first frame of the Home entrance.
function observeHomeEntrance() {
  const peak = new Map()
  const fading = new Set()
  const replayed = new Set()

  return new Promise((resolve) => {
    function sample() {
      const panel = document.getElementById('link-ledger')
      const links = Array.from(panel?.querySelectorAll('a') ?? [])
      const visible = links.map((link) => {
        const name = link.getAttribute('aria-label') || link.textContent.trim()
        // Social icons fade via their list; project links also have an individual entrance.
        let opacity = 1
        for (let node = link; node !== panel.parentElement; node = node.parentElement) {
          opacity *= Number(getComputedStyle(node).opacity)
        }
        const previous = peak.get(name) ?? 0
        if (opacity > 0 && opacity < 1) fading.add(name)
        if (opacity < previous - 0.02) replayed.add(name)
        peak.set(name, Math.max(previous, opacity))
        return opacity === 1
      })
      if (
        links.length &&
        visible.every(Boolean) &&
        !panel.getAnimations({ subtree: true }).some((a) => a.playState === 'running')
      ) {
        const cssOpacity = links.filter((link) => /\b(all|opacity)\b/.test(getComputedStyle(link).transitionProperty))
        resolve({
          neverFaded: [...peak.keys()].filter((name) => !fading.has(name)),
          replayed: [...replayed],
          cssOpacity: cssOpacity.map((a) => a.href),
        })
      } else {
        requestAnimationFrame(sample)
      }
    }
    requestAnimationFrame(sample)
  })
}

it('preserves homepage motion after client navigation in Firefox', { timeout: 30_000 }, async (t) => {
  const site = await startBuiltApp()
  t.after(() => site.close())
  const browser = await firefox.launch()
  t.after(() => browser.close())
  const page = await browser.newPage({ reducedMotion: 'no-preference' })
  await page.goto(`${site.origin}/contact`)
  await page.waitForFunction(() => window.next?.router?.isReady)

  const [entry] = await Promise.all([
    page.evaluate(observeHomeEntrance),
    page
      .getByRole('navigation', { name: 'Main Navigation' })
      .getByRole('link', { name: 'Home', exact: true })
      .first()
      .click(),
  ])
  await t.test('reveals the project and social links only once', () => {
    assert.deepEqual(entry.replayed, [], 'No link should grow fainter again during its entrance')
    assert.deepEqual(entry.cssOpacity, [], 'Link hover CSS must not take over entrance opacity from Motion')
    assert.deepEqual(entry.neverFaded, [], 'Every link should still participate in the entrance')
  })

  await t.test('interpolates the letter contours instead of swapping images', async () => {
    const name = page.getByRole('button', { name: 'Christian Anagnostou', exact: true })
    const bounds = await name.boundingBox()
    await name.hover()
    const drawing = await page.waitForFunction(() =>
      document
        .querySelector('h1 rect')
        ?.getAnimations()
        .find((a) => a.transitionProperty === 'clip-path')
    )
    const shapes = await drawing.evaluate((animation) => {
      animation.pause()
      const { duration, delay } = animation.effect.getTiming()
      return [0, 0.5, 1].map((progress) => {
        animation.currentTime = delay + progress * duration
        return getComputedStyle(animation.effect.target).clipPath
      })
    })
    assert.ok(shapes.every((shape) => shape.startsWith('path(')))
    assert.equal(new Set(shapes).size, 3, 'Midway the letter must be a third shape, not either endpoint')
    assert.deepEqual(await name.boundingBox(), bounds, 'The name must not shift the bio')
  })
})
