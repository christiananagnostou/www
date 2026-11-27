import { chromium, firefox } from 'playwright-core'

export const origin = new URL(process.env.COMPARISON_ORIGIN || 'http://127.0.0.1:31843').origin
export const paths = {
  next: '/projects',
  react: '/framework-lab/react/projects.html',
  solid: '/framework-lab/solid/projects.html',
}
export const categoryNav = 'nav[aria-label="Project categories"]'
export const projectList = 'ul[aria-label="Projects"]'
export const category = (page, name) => page.locator(categoryNav).getByRole('link', { name, exact: true })
export const rows = (page) => page.locator(projectList).getByRole('heading', { level: 2 })
export const ready = (page) =>
  page.waitForFunction(
    () => document.querySelector('#directory')?.dataset.ready === 'true' || window.next?.router?.isReady
  )

export function launch(engine) {
  if (engine === 'firefox') return firefox.launch()
  if (process.env.COMPARISON_CDP) return chromium.connectOverCDP(process.env.COMPARISON_CDP)
  return chromium.launch(process.env.CHROME_CHANNEL ? { channel: process.env.CHROME_CHANNEL } : {})
}
