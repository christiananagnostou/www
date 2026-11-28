import * as m from 'framer-motion/m'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

import { getBreadcrumbStructuredData } from '../lib/structured/breadcrumbs'
import { getSiteNavigationStructuredData } from '../lib/structured/navigation'
import { dropdown, fade, staggerFade } from './animation'
import A from './SVG/A'
import DownArrow from './SVG/DownArrow'

import styles from './Nav.module.css'

const LogoLink = m.create(Link)

interface SubLink {
  href: string
  title: string
}
export type NavLinks = Array<{
  href?: string
  title: string
  subLinks?: SubLink[]
}>

const NAV_LINKS: NavLinks = [
  { href: '/', title: 'Home' },
  {
    title: 'Works',
    subLinks: [
      { href: '/fitness', title: 'Fitness' },
      { href: '/articles', title: 'Articles' },
      { href: '/projects', title: 'Projects' },
      { href: '/art', title: 'Photography' },
      { href: '/bookmarklets', title: 'Bookmarklets' },
      { href: '/lab', title: 'Lab' },
    ],
  },
  { href: '/contact', title: 'Contact' },
]

const Nav = () => {
  const router = useRouter()
  // Optional catch-all pages still belong to their index in the navigation and breadcrumbs.
  const pathname = router.pathname.split('/[[...')[0]

  // Hide-on-scroll
  const [hidden, setHidden] = useState(false)

  // Menu toggles
  const [menuOpen, setMenuOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const hamburger = useRef<HTMLButtonElement>(null)

  // Track if user is on desktop
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)

  // Hide on scroll logic
  useEffect(() => {
    let lastScrollY = window.pageYOffset
    let ticking = false

    const updateHidden = () => {
      const scrollY = window.pageYOffset
      setHidden(scrollY > lastScrollY)
      if (menuOpen) {
        setMenuOpen(false)
        setOpenSubmenu(null)
      }
      lastScrollY = scrollY > 0 ? scrollY : 0
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHidden)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [menuOpen])

  // Track screen size for desktop vs mobile
  useEffect(() => {
    const desktopQuery = window.matchMedia('(width >= 768px)')
    const handleBreakpointChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches)
      setMenuOpen(false)
      setOpenSubmenu(null)
    }

    setIsDesktop(desktopQuery.matches)
    desktopQuery.addEventListener('change', handleBreakpointChange)
    return () => desktopQuery.removeEventListener('change', handleBreakpointChange)
  }, [])

  // Close all menus on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setMenuOpen(false)
      setOpenSubmenu(null)
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router.events])

  const mobileMenuClosed = isDesktop === false && !menuOpen

  const siteNavigationData = getSiteNavigationStructuredData(NAV_LINKS)
  const breadcrumbData = getBreadcrumbStructuredData(NAV_LINKS, pathname)

  return (
    <>
      {/* Skip link for accessibility */}
      <a className={styles.skipLink} href="#main-content">
        Skip to main content
      </a>

      {/* Structured Data for Navigation */}
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationData) }} type="application/ld+json" />
      {/* Breadcrumb structured data */}
      {breadcrumbData.itemListElement.length > 1 && (
        <script dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} type="application/ld+json" />
      )}

      <nav
        className={styles.nav}
        aria-label="Main Navigation"
        onKeyDown={(event) => {
          if (event.key === 'Escape' && menuOpen) {
            setMenuOpen(false)
            hamburger.current?.focus()
          }
        }}
        itemScope
        itemType="https://schema.org/SiteNavigationElement"
        style={hidden ? { top: '-10vh' } : { top: 0 }}
      >
        <m.div animate="show" className="nav-inner max-w-screen" exit="exit" initial={false} variants={staggerFade}>
          <LogoLink className={styles.logoWrapper} aria-label="Home" href="/" variants={fade}>
            <A height="30px" width="30px" />
          </LogoLink>

          <m.ul
            className={styles.menu}
            id="main-navigation-list"
            animate={mobileMenuClosed ? 'exit' : 'show'}
            data-menu-open={menuOpen}
            inert={mobileMenuClosed}
            initial={false}
            variants={menuAnimation}
          >
            {NAV_LINKS.map(({ href, title, subLinks }) => {
              const active = href === pathname
              const hasSub = subLinks && subLinks.length > 0
              const isSubmenuOpen = openSubmenu === title
              const submenuId = `nav-${title.toLowerCase()}-links`

              return (
                <m.li
                  className={styles.menuItem}
                  key={title}
                  variants={fade}
                  onPointerEnter={(event) => {
                    if (hasSub && isDesktop && event.pointerType === 'mouse') setOpenSubmenu(title)
                  }}
                  onPointerLeave={(event) => {
                    if (
                      isDesktop &&
                      event.pointerType === 'mouse' &&
                      !event.currentTarget.contains(document.activeElement)
                    ) {
                      setOpenSubmenu(null)
                    }
                  }}
                  onBlur={(event) => {
                    if (isSubmenuOpen && !event.currentTarget.contains(event.relatedTarget)) setOpenSubmenu(null)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape' && isSubmenuOpen) {
                      event.stopPropagation()
                      setOpenSubmenu(null)
                      event.currentTarget.querySelector('button')?.focus()
                    }
                  }}
                >
                  {!hasSub ? (
                    <Link aria-current={active ? 'page' : undefined} href={href!}>
                      {title}
                    </Link>
                  ) : (
                    <>
                      <button
                        className={styles.dropdownToggle}
                        aria-expanded={isSubmenuOpen}
                        aria-controls={submenuId}
                        type="button"
                        onClick={() => setOpenSubmenu(isSubmenuOpen ? null : title)}
                      >
                        {title}
                        <DownArrow />
                      </button>

                      <m.ul
                        className={styles.submenu}
                        id={submenuId}
                        animate={isSubmenuOpen ? 'show' : 'exit'}
                        aria-label={`${title} Submenu`}
                        inert={!isSubmenuOpen}
                        initial={false}
                        variants={isDesktop ? desktopSubmenuAnimation : dropdown}
                      >
                        {subLinks.map((sub) => {
                          const subActive = sub.href === pathname
                          return (
                            <li key={sub.href}>
                              <Link
                                aria-current={subActive ? 'page' : undefined}
                                href={sub.href}
                                prefetch={isSubmenuOpen ? undefined : false}
                              >
                                {sub.title}
                              </Link>
                            </li>
                          )
                        })}
                      </m.ul>
                    </>
                  )}
                </m.li>
              )
            })}
          </m.ul>

          {/* Hamburger (mobile) */}
          <m.button
            className={styles.hamburger}
            ref={hamburger}
            aria-controls="main-navigation-list"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
            onClick={() => {
              setMenuOpen(!menuOpen)
              setOpenSubmenu(null)
            }}
            variants={fade}
          >
            <span />
            <span />
            <span />
          </m.button>
        </m.div>
      </nav>
    </>
  )
}

export default Nav

const menuAnimation = {
  show: { opacity: 1, y: 0, scaleY: 1, transition: { duration: 0.2, staggerChildren: 0.1 } },
  exit: { opacity: 0, y: -8, scaleY: 0.98, transition: { duration: 0.15 } },
} as const

const desktopSubmenuAnimation = {
  show: { height: 'auto', opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { height: 'auto', opacity: 0, y: -5, transition: { duration: 0.15 } },
} as const
