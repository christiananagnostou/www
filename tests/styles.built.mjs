import assert from 'node:assert/strict'
import { it } from 'node:test'
import { firefox } from 'playwright-core'

import { startBuiltApp } from './helpers/builtApp.mjs'

it('ships the site font and leaves the Gantt timeline scrollable with its scrollbar hidden', async (t) => {
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
})
