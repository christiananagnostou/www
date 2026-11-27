import assert from 'node:assert/strict'
import { it } from 'node:test'
import { firefox } from 'playwright-core'
import sharp from 'sharp'

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

  await t.test('blends prints while dragging and settles on a whole photograph after release', async () => {
    await page.reload()
    const gallery = page.getByRole('link', { name: 'Photos', exact: true })
    const tile = gallery.locator('..')
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
    const frame = await gallery.boundingBox()
    const sample = async () => {
      const { data, info } = await sharp(await gallery.screenshot({ scale: 'css' }))
        .removeAlpha()
        .greyscale()
        .raw()
        .toBuffer({ resolveWithObject: true })
      // Eight pixels cover two ink cells. Average the patch so dot phase and DPR don't pick the result.
      return [0.25, 0.5, 0.75].map((x) => {
        const left = Math.floor(info.width * x) - 4
        const top = Math.floor(info.height * 0.6)
        const patch = Array.from(
          { length: 64 },
          (_, i) => data[(top + Math.floor(i / 8)) * info.width + left + (i % 8)]
        )
        return { mean: patch.reduce((a, b) => a + b) / patch.length, contrast: Math.max(...patch) - Math.min(...patch) }
      })
    }
    const white = await sample()
    await page.addStyleTag({ content: '[data-corner-test] [data-print="0"] img { filter: brightness(0) }' })
    const black = await sample()
    const x = frame.x + frame.width * 0.8
    const y = frame.y + frame.height * 0.36
    const half = x - frame.width * 0.5
    const holdDrag = async (from, to) => {
      await page.mouse.move(from, y)
      await page.mouse.down()
      await page.mouse.move(to, y, { steps: 8 })
    }
    const release = async () => {
      await page.mouse.up()
      await page.waitForFunction(
        () => {
          const el = document.querySelector('[data-stop]').closest('[tabindex="-1"]')
          const slide = el.scrollLeft / el.clientWidth
          return Math.abs(slide - Math.round(slide)) < 0.005
        },
        undefined,
        { timeout: 3000 }
      )
    }
    await holdDrag(x, half)
    const second = gallery.locator('[data-print="1"][data-ready="true"]')
    await second.waitFor({ state: 'attached' })
    const halfPrint = await sample()
    const [left, middle, right] = halfPrint.map(
      ({ mean }, i) => (mean - black[i].mean) / (white[i].mean - black[i].mean)
    )
    assert.ok(
      left > 0.04 && middle > left + 0.12 && right > middle + 0.12 && right < 0.98,
      `Both prints must contribute across the transition, not meet at a cut: ${[left, middle, right]}`
    )
    assert.ok(halfPrint[1].contrast > 15, 'The midpoint should retain ink dots, not just a uniform crossfade')
    const rail = gallery.locator('[tabindex="-1"]')
    const position = () => rail.evaluate((el) => el.scrollLeft / el.clientWidth)
    const marker = () =>
      tile.getByRole('group').evaluate((el) => {
        const ink = getComputedStyle(el, '::after')
        return {
          position: parseFloat(ink.translate) / parseFloat(getComputedStyle(el).getPropertyValue('--dot-step')),
          stretch: parseFloat(ink.scale),
        }
      })
    assert.ok(Math.abs((await position()) - 0.5) < 0.02, 'The held drag should track the pointer halfway')
    const between = await marker()
    assert.ok(Math.abs(between.position - (await position())) < 0.025 && between.stretch > 1.1)
    assert.equal(await rail.evaluate((el) => getComputedStyle(el).overscrollBehaviorX), 'none')
    await page.addStyleTag({ content: '[data-corner-test] [data-print="0"] img { filter: brightness(0) invert(1) }' })
    await checkCorner()
    await page.mouse.move(x - frame.width * 0.58, y)
    await release()
    const landed = await marker()
    assert.ok(Math.abs(landed.position - 1) < 0.02 && Math.abs(landed.stretch - 1) < 0.02)
    await holdDrag(half, x)
    assert.ok(Math.abs((await position()) - 0.5) < 0.02, 'The same blend should be reachable in reverse')
    // Either neighbor may win the exact tie, but the blend must not remain at rest.
    await release()
    assert.equal(new URL(page.url()).pathname, '/')
  })

  await t.test('fills the phone tile with every print without changing its height', async (test) => {
    const phone = await browser.newPage({ viewport: { width: 390, height: 844 } })
    test.after(() => phone.close())
    await phone.goto(site.origin)
    const gallery = phone.getByRole('link', { name: 'Photos', exact: true })
    await gallery.scrollIntoViewIfNeeded()
    const frame = await gallery.boundingBox()
    const titles = ['B&W Baseball', 'Adobe B&W', 'Stair Shadow', 'Satellite']
    for (const [index, title] of titles.entries()) {
      const button = phone.getByRole('button', { name: `Show ${title}` })
      await button.click()
      await phone.waitForFunction((i) => {
        const image = document.querySelector(`[data-print="${i}"][data-ready="true"]`)
        const rail = image?.closest('[tabindex="-1"]')
        return rail && Math.abs(rail.scrollLeft - i * rail.clientWidth) < 2
      }, index)
      await button.and(phone.locator('[aria-current="true"]')).waitFor()
      const image = gallery.locator(`[data-print="${index}"] > picture img`)
      await image.evaluate((img) => img.decode())
      assert.deepEqual(await image.boundingBox(), frame, 'Each settled print should cover the same full frame')
    }
  })
})
