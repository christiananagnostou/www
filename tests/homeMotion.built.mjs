import assert from 'node:assert/strict'
import { it } from 'node:test'
import { firefox } from 'playwright-core'
import sharp from 'sharp'

import { startBuiltApp } from './helpers/builtApp.mjs'

async function nextPhotoPrint(page, tile) {
  // Skip the still frame; the reveal starts after the incoming image loads.
  await page.clock.fastForward(30_000)
  return tile.locator('[data-stage="printing"]')
}

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

  await t.test('keeps the Photos corner clean at rest and during a print', async () => {
    await page.clock.install()
    await page.reload()
    const tile = page.getByRole('link', { name: 'Photos', exact: true }).locator('..')
    await tile.getByRole('button', { name: 'Pause photo rotation' }).waitFor()
    await tile
      .locator('img')
      .first()
      .evaluate((img) => img.decode())
    // A white print makes a seam visible regardless of which photograph is featured.
    await tile.evaluate((el) => el.setAttribute('data-corner-test', ''))
    await page.addStyleTag({ content: '[data-corner-test] img { filter: brightness(0) invert(1) }' })
    const checkCorner = async () => {
      const corner = await sharp(await tile.screenshot({ scale: 'css' }))
        .extract({ left: 0, top: 0, width: 16, height: 16 })
        .removeAlpha()
        .greyscale()
        .raw()
        .toBuffer()
      const rim = corner.filter((_, i) => i % 16 < 9 && Math.floor(i / 16) < 9)
      assert.ok(Math.max(...rim) <= corner[15 * 16 + 15] + 5, 'The curved rim must not outshine the shaded print')
    }
    await checkCorner()
    const incoming = await nextPhotoPrint(page, tile)
    const curves = await incoming.evaluate((sheet) =>
      sheet.getAnimations({ subtree: true }).map((edge) => {
        edge.pause()
        edge.currentTime = Number(edge.effect.getTiming().duration) / 2
        return getComputedStyle(edge.effect.target).animationTimingFunction
      })
    )
    assert.equal(curves.length, 2)
    assert.equal(curves[0], curves[1], 'The halftone and clean print should ease together')
    assert.notEqual(curves[0], 'linear')
    await checkCorner()
  })

  await t.test('fills the phone tile with every print without changing its height', async (test) => {
    const phone = await browser.newPage({ viewport: { width: 390, height: 844 } })
    test.after(() => phone.close())
    await phone.clock.install()
    await phone.goto(site.origin)
    const gallery = phone.getByRole('link', { name: 'Photos', exact: true })
    await gallery.scrollIntoViewIfNeeded()
    await phone.getByRole('button', { name: 'Pause photo rotation' }).waitFor()
    const frame = await gallery.boundingBox()
    for (let index = 0; index < 4; index++) {
      if (index > 0) {
        const incoming = await nextPhotoPrint(phone, gallery)
        await incoming.evaluate((sheet) => sheet.getAnimations({ subtree: true }).forEach((edge) => edge.finish()))
        await incoming.waitFor({ state: 'detached' })
      }
      const image = gallery.locator('img')
      await image.evaluate((img) => img.decode())
      assert.deepEqual(await image.boundingBox(), frame, 'Each settled print should cover the same full frame')
    }
  })
})
