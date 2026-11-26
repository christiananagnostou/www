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

  await t.test('interpolates the letter contours on the same writing line', async () => {
    const name = page.getByRole('button', { name: 'Christian Anagnostou', exact: true })
    await page.evaluate(() => document.fonts.ready.then(() => true))
    const bounds = await name.boundingBox()
    const print = await name.locator('.print').boundingBox()
    await name.hover()
    // The first lowercase o marks the writing line without an ascender or descender.
    const drawing = await page.waitForFunction(() => {
      const o = document.querySelectorAll('h1 rect')[14]
      if (o?.getAnimations().some((a) => a.transitionProperty === 'clip-path')) return o
    })
    const frames = await drawing.evaluate((letter) => {
      const moves = letter.parentNode.getAnimations({ subtree: true })
      moves.forEach((a) => a.pause())
      const outline = document.createElementNS(letter.namespaceURI, 'path')
      letter.ownerSVGElement.append(outline)
      const samples = [0, 0.5, 1].map((progress) => {
        for (const a of moves) {
          const { delay, duration } = a.effect.getTiming()
          a.currentTime = delay + progress * duration
        }
        const shape = getComputedStyle(letter).clipPath
        outline.setAttribute('d', shape.split('"')[1])
        const { y, height } = outline.getBBox()
        const center = new DOMPoint(0, y + height / 2).matrixTransform(letter.getScreenCTM()).y
        return { shape, center }
      })
      outline.remove()
      return samples
    })
    assert.equal(new Set(frames.map((f) => f.shape)).size, 3, 'Midway the letter must be a third shape')
    for (const { center } of [frames[0], frames[2]]) {
      assert.ok(Math.abs(center - (print.y + print.height / 2)) < 3, 'Both outlines should meet the printed text')
    }
    assert.deepEqual(await name.boundingBox(), bounds, 'The name must not shift the bio')
  })

  await t.test('paints the grove from top to bottom without intercepting the homepage', async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.waitForFunction(() => {
      const canvas = document.querySelector('main canvas')
      if (!canvas || canvas.height < 600) return false
      const ctx = canvas.getContext('2d')
      return [0.12, 0.84].every((y) => {
        const strip = ctx.getImageData(0, Math.floor(canvas.height * y), canvas.width, 12)
        return strip.data.some((byte, i) => i % 4 === 3 && byte > 30)
      })
    })
    const canvas = page.locator('main canvas')
    assert.equal(await canvas.evaluate((el) => getComputedStyle(el).pointerEvents), 'none')
    assert.equal(await canvas.evaluate((el) => el.closest('[aria-hidden="true"]') !== null), true)
    await page
      .getByRole('navigation', { name: 'Main Navigation' })
      .getByRole('link', { name: 'Contact' })
      .first()
      .click()
    await canvas.waitFor({ state: 'detached' })
  })
})
