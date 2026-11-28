import assert from 'node:assert/strict'
import { it } from 'node:test'
import { firefox } from 'playwright-core'

import { startBuiltApp } from './helpers/builtApp.mjs'

const isFocused = (locator) => locator.evaluate((el) => el === document.activeElement)

it('preserves no-JS styles and keyboard navigation across breakpoints', async (t) => {
  const site = await startBuiltApp()
  t.after(() => site.close())
  const browser = await firefox.launch()
  t.after(() => browser.close())
  const page = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })

  await page.goto(`${site.origin}/projects`)
  const heading = page.getByRole('heading', { name: 'Projects', exact: true })
  const family = await heading.evaluate((el) => getComputedStyle(el).fontFamily.replaceAll(/["']/g, '').split(/,\s*/))
  assert.deepEqual(family, ['Inter', 'Inter Fallback', 'system-ui', 'sans-serif'])

  await page.goto(`${site.origin}/lab`)
  const timeline = await page
    .locator('.gantt-bar[data-item-id]')
    .first()
    .evaluate((bar) => {
      for (let el = bar.parentElement; el; el = el.parentElement) {
        const css = getComputedStyle(el)
        if (css.overflowX === 'auto' && el.scrollWidth > el.clientWidth) {
          el.scrollLeft = 64
          return { scrollLeft: el.scrollLeft, scrollbar: css.scrollbarWidth }
        }
      }
      return null
    })
  assert.deepEqual(timeline, { scrollLeft: 64, scrollbar: 'none' })

  const interactive = await browser.newPage()
  for (const width of [1280, 390]) {
    await interactive.setViewportSize({ width, height: 844 })
    await interactive.goto(`${site.origin}/contact`)
    await interactive.waitForFunction(() => window.next?.router?.isReady)
    const nav = interactive.getByRole('navigation', { name: 'Main Navigation' })
    if (width === 390) await nav.getByRole('button', { name: 'Toggle navigation menu' }).click()
    const works = nav.getByRole('button', { name: 'Works' })
    await works.focus()
    await works.press('Tab')
    assert.ok(await isFocused(nav.getByRole('link', { name: 'Contact' })), 'Tab skips the closed submenu')
    await works.press('Enter')
    await interactive.keyboard.press('Tab')
    assert.ok(await isFocused(nav.getByRole('link', { name: 'Fitness' })), 'Tab enters the open submenu')
    await interactive.keyboard.press('Escape')
    assert.ok(await isFocused(works))
    assert.equal(await works.getAttribute('aria-expanded'), 'false')
  }
})
