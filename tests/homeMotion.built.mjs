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

  await t.test('morphs on the same writing line and returns to print without overlapping it', async () => {
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

    const layers = () =>
      name.evaluate((button) => ({
        ink: getComputedStyle(button.querySelector('svg')).visibility,
        print: getComputedStyle(button.querySelector('.print')).opacity,
      }))
    const finishMorph = () =>
      name.evaluate((button) => button.getAnimations({ subtree: true }).forEach((a) => a.finish()))
    await finishMorph()
    await page.mouse.move(0, 0)
    await name.evaluate(async (button) => {
      const transitions = button.getAnimations({ subtree: true })
      const morph = transitions.find((a) => a.transitionProperty === 'clip-path')
      if (!morph) throw new Error('Pointer exit did not start a reverse morph')
      transitions.forEach((a) => a.pause())
      await Promise.all(transitions.map((a) => a.ready))
      const halfway = morph.effect.getTiming().duration / 2
      transitions.forEach((a) => (a.currentTime = halfway))
    })
    const onlyInk = { ink: 'visible', print: '0' }
    assert.deepEqual(await layers(), onlyInk, 'The printed name must stay hidden during the return')
    await name.hover()
    await finishMorph()
    assert.deepEqual(await layers(), onlyInk, 'Re-entering mid-return must keep the signature visible alone')
    await page.mouse.move(0, 0)
    await name.locator('svg').waitFor({ state: 'hidden' })
    assert.deepEqual(await layers(), { ink: 'hidden', print: '1' }, 'The native name must take over at rest')
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

  await t.test('opens photography only after releasing a full pull at the end of the reel', async () => {
    const gallery = page.getByRole('link', { name: 'Photos', exact: true })
    const icon = gallery.locator('svg')
    await page.getByRole('button', { name: 'Show B&W Baseball' }).click()
    await page.waitForFunction(() => {
      const rail = document.querySelector('[data-stop]').closest('[tabindex="-1"]')
      return Math.abs(rail.scrollWidth - rail.clientWidth - rail.scrollLeft) <= 1
    })
    const box = await gallery.boundingBox()
    const x = box.x + box.width * 0.8
    const y = box.y + box.height * 0.4
    for (const distance of [82, 184]) {
      let approach = 0
      if (distance === 184) {
        await page.getByRole('button', { name: 'Show Adobe B&W' }).click()
        const rail = gallery.locator('[tabindex="-1"]')
        await page.waitForFunction(() => {
          const r = document.querySelector('[data-stop]').closest('[tabindex="-1"]')
          return Math.abs(r.scrollLeft - 2 * r.clientWidth) < 2
        })
        approach = await rail.evaluate((r) => r.scrollWidth - r.clientWidth - r.scrollLeft)
        assert.ok(approach > 0 && approach < box.width / 2, 'Leave room to continue pulling in the same drag')
      }
      await page.mouse.move(x, y)
      await page.mouse.down()
      if (approach) {
        await page.mouse.move(x - approach / 2, y, { steps: 6 })
        const dot = await gallery
          .locator('..')
          .getByRole('group')
          .evaluate(
            (el) =>
              parseFloat(getComputedStyle(el, '::after').translate) /
              parseFloat(getComputedStyle(el).getPropertyValue('--dot-step'))
          )
        assert.ok(Math.abs(dot - 2.5) < 0.03, 'The dot tracks the shorter final transition')
        assert.equal(await icon.getAttribute('data-pull'), null, 'Finish revealing Baseball before showing the arrow')
      }
      await page.mouse.move(x - approach - distance, y, { steps: 12 })
      const remainingArc = await icon
        .locator('[pathLength]')
        .evaluate((circle) => parseFloat(getComputedStyle(circle).strokeDashoffset))
      if (distance === 82) {
        assert.ok(remainingArc > 0.5 && remainingArc < 0.6, 'The old trigger should now fill less than half the ring')
      } else {
        assert.equal(remainingArc, 0, 'The full 360° ring must be visible before navigation')
        const colorDurations = () =>
          icon.evaluate((svg) =>
            [
              [svg.querySelector('circle'), 'fill'],
              [svg.querySelector('path'), 'stroke'],
            ].map(([part, color]) => {
              const style = getComputedStyle(part)
              const i = style.transitionProperty.split(', ').indexOf(color)
              return i < 0 ? 0 : parseFloat(style.transitionDuration.split(', ')[i])
            })
          )
        assert.ok(
          (await colorDurations()).every((s) => s >= 0.16 && s <= 0.3),
          'The ready colors ease in'
        )
        const ready = await icon.boundingBox()
        await page.mouse.move(x - approach - distance - 40, y, { steps: 4 })
        const give = ready.x - (await icon.boundingBox()).x
        assert.ok(give > 1 && give < 8, 'The marker should still yield a few pixels under tension after 100%')
        await page.emulateMedia({ reducedMotion: 'reduce' })
        assert.deepEqual(await colorDurations(), [0, 0], 'Reduced motion shows the ready colors immediately')
      }
      assert.equal(new URL(page.url()).pathname, '/')
      await page.mouse.up()
      if (distance === 82) assert.equal(await icon.getAttribute('data-pull'), null)
    }
    await page.waitForURL('**/art')
  })

  await t.test('selects each full-frame phone print by tapping its compact dot', async (test) => {
    const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true })
    test.after(() => phone.close())
    await phone.goto(site.origin)
    const gallery = phone.getByRole('link', { name: 'Photos', exact: true })
    await gallery.scrollIntoViewIfNeeded()
    const frame = await gallery.boundingBox()
    const arrow = await gallery.locator('svg').boundingBox()
    assert.ok(arrow.x + arrow.width <= frame.x + frame.width + 1, 'The hidden arrow must rest inside the frame')
    assert.ok(
      await phone.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      'The reel must not widen the page'
    )
    const dots = await phone.getByRole('group', { name: 'Choose a photograph' }).evaluate((group) => {
      const { left, bottom } = group.getBoundingClientRect()
      return Array.from(group.children, (button) => {
        const ink = getComputedStyle(button, '::before')
        return {
          x: left + parseFloat(ink.left),
          y: bottom - parseFloat(ink.bottom) - parseFloat(ink.height) / 2,
          width: button.clientWidth,
          height: button.clientHeight,
        }
      })
    })
    assert.ok(
      dots.every((dot) => dot.width >= 24 && dot.height >= 44),
      'Keep the touch targets full size'
    )
    assert.ok(dots[1].x - dots[0].x < dots[0].width, 'The visible dots should sit closer than the touch targets')
    const titles = ['Stair Shadow', 'Satellite', 'Adobe B&W', 'B&W Baseball']
    for (const [index, title] of titles.entries()) {
      const button = phone.getByRole('button', { name: `Show ${title}` })
      await phone.touchscreen.tap(dots[index].x, dots[index].y)
      await phone.waitForFunction((i) => {
        const image = document.querySelector(`[data-print="${i}"][data-ready="true"]`)
        const rail = document.querySelector('[data-stop]').closest('[tabindex="-1"]')
        return (
          image && Math.abs(rail.scrollLeft - Math.min(i * rail.clientWidth, rail.scrollWidth - rail.clientWidth)) < 2
        )
      }, index)
      await button.and(phone.locator('[aria-current="true"]')).waitFor()
      const image = gallery.locator(`[data-print="${index}"] > picture img`)
      await image.evaluate((img) => img.decode())
      assert.deepEqual(await image.boundingBox(), frame, 'Each settled print should cover the same full frame')
    }
  })
})
