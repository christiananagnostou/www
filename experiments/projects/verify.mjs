import assert from 'node:assert/strict'
import sharp from 'sharp'
import { category, launch, origin, paths, projectList, ready, rows } from './browser.mjs'

const exercise = process.argv.includes('--exercise')
const browsers = process.env.COMPARISON_BROWSERS?.split(',') ?? ['chromium', 'firefox']
const expected = ['Electriq Dashboard', 'Soylent', 'Scentfill', "Electriq's Website"]
const geometry = () =>
  [...document.querySelectorAll('main h1, main nav, main li:not([hidden]) > a')].map((el) => {
    const { x, y, width, height } = el.getBoundingClientRect()
    return [x, y, width, height]
  })
async function waitFilter(page, label) {
  await category(page, label).and(page.locator('[aria-current="page"]')).waitFor()
}
async function pixels(a, b) {
  const [x, y] = await Promise.all([a, b].map((buf) => sharp(buf).removeAlpha().raw().toBuffer()))
  assert.equal(x.length, y.length)
  let different = 0
  for (let i = 0; i < x.length; i += 3) {
    if (Math.max(...[0, 1, 2].map((c) => Math.abs(x[i + c] - y[i + c]))) > 8) different++
  }
  return different / (x.length / 3)
}
for (const name of browsers) {
  const browser = await launch(name)
  try {
    for (const [width, height] of [
      [390, 844],
      [820, 1180],
      [1440, 900],
    ]) {
      let baseline
      for (const [engine, path] of Object.entries(paths)) {
        const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' })
        try {
          const page = await ctx.newPage()
          const errors = []
          page.on('pageerror', (error) => errors.push(error.message))
          page.on('console', (m) => {
            if (m.type() === 'error' && /hydrat|Minified React error/i.test(m.text())) errors.push(m.text())
          })
          assert.equal((await page.goto(origin + path)).status(), 200)
          await ready(page)
          await page.evaluate(() => document.fonts.ready)
          await page.waitForFunction(() => {
            const h = document.querySelector('main h1')
            if (!h) return false
            for (let el = h; el; el = el.parentElement) if (Number(getComputedStyle(el).opacity) < 1) return false
            return true
          })
          assert.equal(await rows(page).count(), 13)
          const current = {
            rects: await page.evaluate(geometry),
            shot: await page.screenshot({ animations: 'disabled' }),
          }
          if (!baseline) baseline = current
          else {
            assert.deepEqual(current.rects, baseline.rects, 'identical heading/filter/row geometry')
            const delta = await pixels(baseline.shot, current.shot)
            console.log(name, width, engine, 'viewport pixels differing by >8/255:', (100 * delta).toFixed(3) + '%')
            assert.ok(delta < 0.01, 'viewport capture differs by more than 1% of pixels')
          }
          if (exercise) {
            await category(page, 'Tools').click()
            await waitFilter(page, 'Tools')
            assert.deepEqual(await rows(page).allTextContents(), ['Skillbox', 'ImgPress', 'Knip HTML Reporter'])
            assert.ok(await category(page, 'Tools').locator('svg path').getAttribute('d'))
            continue
          }
          const active = await page
            .locator(projectList + ' li')
            .first()
            .evaluate((e) => getComputedStyle(e).animationName)
          assert.equal(active, 'none', 'reduced motion disables row entrances')
          await page.keyboard.press('Tab')
          await category(page, 'Commercial').focus()
          assert.ok(
            await category(page, 'Commercial').evaluate(
              (a) => a.matches(':focus-visible') && getComputedStyle(a).outlineStyle !== 'none'
            )
          )
          await page.keyboard.press('Enter')
          await waitFilter(page, 'Commercial')
          assert.deepEqual(await rows(page).allTextContents(), expected)
          const selectedUrl = page.url()
          await page.reload()
          await ready(page)
          await waitFilter(page, 'Commercial')
          assert.deepEqual(await rows(page).allTextContents(), expected)
          await category(page, 'Open source').click()
          await waitFilter(page, 'Open source')
          assert.equal(await rows(page).count(), 3)
          await page.goBack()
          await waitFilter(page, 'Commercial')
          assert.equal(page.url(), selectedUrl)
          await page.goForward()
          await waitFilter(page, 'Open source')
          await category(page, 'All').click()
          await waitFilter(page, 'All')
          if (width >= 768) {
            await page.emulateMedia({ reducedMotion: 'no-preference' })
            const disc = page.locator('a[href="/work/jukebox"] g[class*="disc"]')
            await page.locator('a[href="/work/jukebox"]').hover()
            await page.waitForFunction((el) => getComputedStyle(el).transform !== 'none', await disc.elementHandle())
            await page.emulateMedia({ reducedMotion: 'reduce' })
            assert.equal(await disc.evaluate((el) => getComputedStyle(el).transform), 'none')
          } else if (engine !== 'next') {
            const menu = page.getByRole('button', { name: 'Toggle navigation menu' })
            await menu.click()
            const works = page.getByRole('button', { name: 'Works' })
            await works.click()
            assert.equal(await works.getAttribute('aria-expanded'), 'true')
            await works.press('Escape')
            assert.equal(await works.getAttribute('aria-expanded'), 'false')
            await works.press('Escape')
            assert.equal(await menu.getAttribute('aria-expanded'), 'false')
          }
          await page.locator('a[href="/work/liftclub"]').click()
          await page.getByRole('heading', { level: 1, name: 'Lift Club', exact: true }).waitFor()
          assert.equal(new URL(page.url()).pathname, '/work/liftclub')
          assert.deepEqual(errors, [], 'no uncaught errors or hydration recovery')
        } finally {
          await ctx.close()
        }
      }
      console.log(
        name,
        width,
        exercise ? 'category exercise passed' : 'visual, navigation and interaction checks passed'
      )
    }
    if (!exercise) {
      const nojs = await browser.newContext({ javaScriptEnabled: false })
      try {
        for (const path of Object.values(paths).slice(1)) {
          const page = await nojs.newPage()
          await page.goto(origin + path)
          assert.equal(await rows(page).count(), 13)
          await category(page, 'Commercial').click()
          assert.deepEqual(await rows(page).allTextContents(), expected)
          await page.close()
        }
      } finally {
        await nojs.close()
      }
    }
  } finally {
    await browser.close()
  }
}
