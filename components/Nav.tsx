import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getBreadcrumbStructuredData } from '../lib/structured/breadcrumbs'
import { getSiteNavigationStructuredData } from '../lib/structured/navigation'
import { dropdown, fade, staggerFade } from './animation'
import A from './SVG/A'
import DownArrow from './SVG/DownArrow'

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
      { href: '/projects', title: 'Projects' },
      { href: '/fitness', title: 'Fitness' },
      { href: '/art', title: 'Photography' },
      { href: '/bookmarklets', title: 'Bookmarklets' },
      { href: '/articles', title: 'Articles' },
      { href: '/lab', title: 'Lab' },
    ],
  },
  { href: '/contact', title: 'Contact' },
]

const Nav: React.FC = () => {
  const router = useRouter()
  const { pathname } = router

  // Hide-on-scroll
  const [hidden, setHidden] = useState(false)

  // Menu toggles
  const [menuOpen, setMenuOpen] = useState(false)
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({})
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  // Track if user is on desktop
  const [isDesktop, setIsDesktop] = useState<boolean>(false)

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
    const handleResize = () => setIsDesktop(window.innerWidth >= 768)
    handleResize() // check on initial mount
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
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
      <SkipLink href="#main-content">Skip to main content</SkipLink>

      {/* Structured Data for Navigation */}
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationData) }} type="application/ld+json" />
      {/* Breadcrumb structured data */}
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} type="application/ld+json" />

      <StyledNav
        aria-label="Main Navigation"
        itemScope
        itemType="https://schema.org/SiteNavigationElement"
        style={hidden ? { top: '-10vh' } : { top: 0 }}
      >
        <motion.div
          animate="show"
          className="nav-inner max-w-screen"
          exit="exit"
          initial="hidden"
          variants={staggerFade}
        >
          <LogoWrapper aria-label="Home" href="/" variants={fade}>
            <A height="30px" width="30px" />
          </LogoWrapper>

          <AnimatePresence>
            {menuOpen || isDesktop ? (
              <Menu
                key="main-menu"
                animate="show"
                exit="exit"
                initial="hidden"
                style={{
                  height: isDesktop ? 'auto' : undefined,
                  opacity: isDesktop ? 1 : undefined,
                }}
                variants={menuAnimation}
              >
                {NAV_LINKS.map(({ href, title, subLinks }, index) => {
                  const active = href === pathname
                  const hasSub = subLinks && subLinks.length > 0

                  // On mobile, check `openSubmenus`; on desktop, check `hoverIndex`.
                  const isSubmenuOpen = isDesktop ? hoverIndex === index : !!openSubmenus[title]

                  return (
                    <MenuItem
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
                          <DropdownToggle
                            aria-expanded={isSubmenuOpen}
                            aria-haspopup="true"
                            type="button"
                            onClick={() => toggleSubmenu(title)}
                          >
                            {title}
                            <DownArrow />
                          </DropdownToggle>

                          {/* Animate submenu in/out */}
                          <AnimatePresence>
                            {isSubmenuOpen ? (
                              <Submenu
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
                              </Submenu>
                            ) : null}
                          </AnimatePresence>
                        </>
                      )}
                    </MenuItem>
                  )
                })}
              </Menu>
            ) : null}
          </AnimatePresence>

          {/* Hamburger (mobile) */}
          {!isDesktop && (
            <Hamburger
              aria-expanded={menuOpen}
              aria-label="Toggle navigation menu"
              variants={fade}
              onClick={toggleMenu}
            >
              <span />
              <span />
              <span />
            </Hamburger>
          )}
        </motion.div>
      </StyledNav>
    </>
  )
}

export default Nav

const SkipLink = styled.a`
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--accent);
  color: var(--text);
  padding: 8px 16px;
  border-radius: var(--border-radius-sm);
  z-index: 10000;
  transition: top 0.3s;
  &:focus {
    top: 0;
  }
`

const menuAnimation = {
  hidden: { height: 0 },
  show: { height: 'auto', transition: { duration: 0.2, staggerChildren: 0.1 } },
  exit: { height: 0, transition: { duration: 0.2 } },
} as const

const desktopSubmenuAnimation = {
  hidden: { opacity: 0, y: -5, pointerEvents: 'none' },
  show: { opacity: 1, y: 0, pointerEvents: 'auto', transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -5, pointerEvents: 'none', transition: { duration: 0.15 } },
} as const

const StyledNav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 9999;
  transition: top 0.4s ease;
  border-bottom: 1px solid var(--accent);
  background: var(--dark-bg);

  .nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
    margin: auto;
    height: var(--nav-height);
  }
`

const LogoWrapper = styled(motion.create(Link))`
  display: flex;
  align-items: center;
  padding: 0 1rem;
  fill: var(--text);

  svg {
    user-select: none;
    pointer-events: none;
  }
`

const Hamburger = styled(motion.button)`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: end;
  flex-direction: column;
  justify-content: center;
  gap: 0.4rem;
  flex: 1;
  height: 100%;
  padding: 0 1rem;

  span {
    display: block;
    width: 22px;
    height: 1px;
    background: var(--text-dark);
    border-radius: 1px;
    transition: all 0.3s ease;
  }

  &[aria-expanded='true'] {
    span:nth-child(1) {
      transform: rotate(45deg) translateY(5px) translateX(5px);
      transform-origin: center;
    }
    span:nth-child(2) {
      opacity: 0;
    }
    span:nth-child(3) {
      transform: rotate(-45deg) translateY(-5px) translateX(5px);
      transform-origin: center;
    }
  }
`

const Menu = styled(motion.ul)`
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;

  /* Desktop */
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    gap: 0rem;
    height: auto !important;
    opacity: 1 !important;
  }

  /* Mobile */
  @media (max-width: 767px) {
    position: absolute;
    top: var(--nav-height);
    left: 0;
    right: 0;
    background: var(--dark-bg);
    overflow: hidden;
    border-bottom: 1px solid var(--accent);
    border-top: 1px solid var(--accent);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`

const MenuItem = styled(motion.li)`
  position: relative;

  /* Mobile */
  @media (max-width: 767px) {
    &:last-child {
      margin-bottom: 0.5rem;
    }
  }

  & a,
  & button {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    text-decoration: none;
    color: var(--heading);
    font-size: 1rem;
    padding: 0.5rem 1rem;
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.3s;

    @media (max-width: 767px) {
      width: 100%;
      justify-content: end;
      flex-direction: row-reverse;
      padding: 0.75rem 1rem;
    }
  }
`

const DropdownToggle = styled.button`
  width: 100%;
  text-align: left;
  cursor: s-resize !important;

  /* Mobile */
  @media (max-width: 767px) {
    &[aria-expanded='true'] {
      svg {
        transform: rotate(180deg);
      }
    }
  }
`

const Submenu = styled(motion.ul)`
  /* Shared */
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: hidden;

  li a {
    text-decoration: none;
    color: var(--heading);

    @media (hover: hover) {
      &:hover,
      &:focus {
        background: var(--body-bg);
      }
    }
  }

  /* Desktop dropdown */
  @media (min-width: 768px) {
    position: absolute;
    top: 100%;
    left: -0rem;
    background: var(--dark-bg);
    border: 1px solid var(--accent);
    border-radius: var(--border-radius-sm);
    min-width: 120px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);

    li a {
      font-size: 0.95rem;
    }
  }

  /* Mobile dropdown */
  @media (max-width: 767px) {
    li a {
      padding: 0.5rem 3rem;
      position: relative;

      &:after {
        content: '';
        position: absolute;
        top: 0;
        right: 1.5rem;
        width: 1px;
        height: 100%;
        background: var(--accent);
      }
    }
  }
`
