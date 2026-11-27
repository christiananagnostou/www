// Both standalone pages use the same progressively enhanced site header and normal document links.
export function wireHeader() {
  const nav = document.querySelector<HTMLElement>('nav[aria-label="Main Navigation"]')!
  const toggle = nav.querySelector<HTMLButtonElement>('button[aria-label="Toggle navigation menu"]')!
  const menu = nav.querySelector<HTMLElement>('[data-menu-open]')!
  const works = nav.querySelector<HTMLButtonElement>('button[aria-haspopup]')!
  const submenu = nav.querySelector<HTMLElement>('[data-lab-submenu]')!
  const desktop = matchMedia('(min-width: 768px)')
  function expandWorks(open: boolean) {
    works.setAttribute('aria-expanded', String(open))
    submenu.hidden = !open
  }
  function expandMenu(open: boolean) {
    toggle.setAttribute('aria-expanded', String(open))
    menu.dataset.menuOpen = String(open)
    if (!open) expandWorks(false)
  }
  toggle.addEventListener('click', () => expandMenu(menu.dataset.menuOpen !== 'true'))
  works.addEventListener('click', () => expandWorks(submenu.hidden === true))
  works.parentElement!.addEventListener('pointerenter', (e) => {
    if (desktop.matches && e.pointerType === 'mouse') expandWorks(true)
  })
  works.parentElement!.addEventListener('pointerleave', () => {
    if (desktop.matches && !works.parentElement!.contains(document.activeElement)) expandWorks(false)
  })
  nav.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return
    if (!submenu.hidden) {
      expandWorks(false)
      works.focus()
    } else if (menu.dataset.menuOpen === 'true') {
      expandMenu(false)
      toggle.focus()
    }
  })
  document.addEventListener('pointerdown', (e) => {
    if (!nav.contains(e.target as Node)) expandMenu(false)
  })
  desktop.addEventListener('change', () => expandMenu(false))
  let last = scrollY
  let pending = false
  addEventListener(
    'scroll',
    () => {
      if (pending) return
      pending = true
      requestAnimationFrame(() => {
        nav.style.top = scrollY > last && !nav.contains(document.activeElement) ? '-10vh' : '0'
        if (menu.dataset.menuOpen === 'true') expandMenu(false)
        last = Math.max(0, scrollY)
        pending = false
      })
    },
    { passive: true }
  )
}
