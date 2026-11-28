import { AnimatePresence } from 'framer-motion'
import * as m from 'framer-motion/m'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

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

const Nav: React.FC = () => {
  const router = useRouter()
  // Optional catch-all pages still belong to their index in the navigation and breadcrumbs.
  const pathname = router.pathname.split('/[[...')[0]

  // Hide-on-scroll
  const [hidden, setHidden] = useState(false)

  // Menu toggles
  const [menuOpen, setMenuOpen] = useState(false)
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({})
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  // Track if user is on desktop
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)

  // Hide on scroll logic
  useEffect(() => {
    let lastScrollY = window.pageYOffset
    let ticking = false

    const updateHidden = () => {
      const scrollY = window.pageYOffset
      setHidden(scrollY > lastScrollY)
      if (menuOpen) setMenuOpen(false) // close menu if user scrolls
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
    const handleBreakpointChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches)

    setIsDesktop(desktopQuery.matches)
    desktopQuery.addEventListener('change', handleBreakpointChange)
    return () => desktopQuery.removeEventListener('change', handleBreakpointChange)
  }, [])

  // Close all menus on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setMenuOpen(false)
      setOpenSubmenus({})
      setHoverIndex(null)
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router.events])

  const toggleMenu = () =>
    setMenuOpen((prev) => {
      if (prev) setOpenSubmenus({}) // Close all submenus
      return !prev
    })

  const toggleSubmenu = (title: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const handleMouseEnter = (idx: number) => {
    if (isDesktop) setHoverIndex(idx)
  }
  const handleMouseLeave = (idx: number) => {
    if (isDesktop && hoverIndex === idx) {
      setHoverIndex(null)
    }
  }

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
        itemScope
        itemType="https://schema.org/SiteNavigationElement"
        style={hidden ? { top: '-10vh' } : { top: 0 }}
      >
        <m.div animate="show" className="nav-inner max-w-screen" exit="exit" initial={false} variants={staggerFade}>
          <LogoLink className={styles.logoWrapper} aria-label="Home" href="/" variants={fade}>
            <A height="30px" width="30px" />
          </LogoLink>

          <AnimatePresence initial={false}>
            {menuOpen || isDesktop !== false ? (
              <m.ul
                className={styles.menu}
                key="main-menu"
                animate="show"
                data-menu-open={menuOpen}
                exit="exit"
                initial={isDesktop === false ? 'hidden' : false}
                variants={menuAnimation}
              >
                {NAV_LINKS.map(({ href, title, subLinks }, index) => {
                  const active = href === pathname
                  const hasSub = subLinks && subLinks.length > 0

                  // On mobile, check `openSubmenus`; on desktop, check `hoverIndex`.
                  const isSubmenuOpen = isDesktop ? hoverIndex === index : !!openSubmenus[title]

                  return (
                    <m.li
                      className={styles.menuItem}
                      key={title}
                      variants={fade}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={() => handleMouseLeave(index)}
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
                            aria-haspopup="true"
                            type="button"
                            onClick={() => toggleSubmenu(title)}
                          >
                            {title}
                            <DownArrow />
                          </button>

                          {/* Animate submenu in/out */}
                          <AnimatePresence>
                            {isSubmenuOpen ? (
                              <m.ul
                                className={styles.submenu}
                                key={`${title}-submenu`}
                                animate="show"
                                aria-label={`${title} Submenu`}
                                exit="exit"
                                initial="hidden"
                                variants={isDesktop ? desktopSubmenuAnimation : dropdown}
                              >
                                {subLinks.map((sub) => {
                                  const subActive = sub.href === pathname
                                  return (
                                    <li key={sub.href}>
                                      <Link aria-current={subActive ? 'page' : undefined} href={sub.href}>
                                        {sub.title}
                                      </Link>
                                    </li>
                                  )
                                })}
                              </m.ul>
                            ) : null}
                          </AnimatePresence>
                        </>
                      )}
                    </m.li>
                  )
                })}
              </m.ul>
            ) : null}
          </AnimatePresence>

          {/* Hamburger (mobile) */}
          <m.button
            className={styles.hamburger}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
            variants={fade}
            onClick={toggleMenu}
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
  hidden: { opacity: 0, y: -8, scaleY: 0.98 },
  show: { opacity: 1, y: 0, scaleY: 1, transition: { duration: 0.2, staggerChildren: 0.1 } },
  exit: { opacity: 0, y: -8, scaleY: 0.98, transition: { duration: 0.15 } },
} as const

const desktopSubmenuAnimation = {
  hidden: { opacity: 0, y: -5, pointerEvents: 'none' },
  show: { opacity: 1, y: 0, pointerEvents: 'auto', transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -5, pointerEvents: 'none', transition: { duration: 0.15 } },
} as const
