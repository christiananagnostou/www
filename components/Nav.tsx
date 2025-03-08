import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getBreadcrumbStructuredData } from '../lib/structured/breadcrumbs'
import { getSiteNavigationStructuredData } from '../lib/structured/navigation'
import Logo from '../public/A-circle.webp'
import { dropdown, fade, staggerFade } from './animation'
import DownArrow from './SVG/DownArrow'

interface SubLink {
  href: string
  title: string
}
export type NavLinks = {
  href?: string
  title: string
  subLinks?: SubLink[]
}[]

const NAV_LINKS: NavLinks = [
  { href: '/', title: 'Home' },
  {
    title: 'Works',
    subLinks: [
      { href: '/projects', title: 'Projects' },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationData) }} />
      {/* Breadcrumb structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />

      <StyledNav
        aria-label="Main Navigation"
        itemScope
        itemType="https://schema.org/SiteNavigationElement"
        style={hidden ? { top: '-10vh' } : { top: 0 }}
      >
        <motion.div
          className="nav-inner max-w-screen"
          variants={staggerFade}
          initial="hidden"
          animate="show"
          exit="exit"
        >
          <motion.a href="/" aria-label="Home" variants={fade}>
            <LogoWrapper>
              <Image src={Logo} alt="Logo" width={30} height={30} />
            </LogoWrapper>
          </motion.a>

          <AnimatePresence>
            {(menuOpen || isDesktop) && (
              <Menu
                key="main-menu"
                variants={menuAnimation}
                initial="hidden"
                animate="show"
                exit="exit"
                style={{
                  height: isDesktop ? 'auto' : undefined,
                  opacity: isDesktop ? 1 : undefined,
                }}
              >
                {NAV_LINKS.map(({ href, title, subLinks }, index) => {
                  const active = href === pathname
                  const hasSub = subLinks && subLinks.length > 0

                  // On mobile, check `openSubmenus`; on desktop, check `hoverIndex`.
                  const isSubmenuOpen = isDesktop ? hoverIndex === index : !!openSubmenus[title]

                  return (
                    <MenuItem
                      key={title}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={() => handleMouseLeave(index)}
                      variants={fade}
                    >
                      {!hasSub ? (
                        <Link href={href!} aria-current={active ? 'page' : undefined}>
                          {title}
                        </Link>
                      ) : (
                        <>
                          <DropdownToggle
                            type="button"
                            onClick={() => toggleSubmenu(title)}
                            aria-haspopup="true"
                            aria-expanded={isSubmenuOpen}
                          >
                            {title}
                            <DownArrow />
                          </DropdownToggle>

                          {/* Animate submenu in/out */}
                          <AnimatePresence>
                            {isSubmenuOpen && (
                              <Submenu
                                key={`${title}-submenu`}
                                variants={isDesktop ? desktopSubmenuAnimation : dropdown}
                                initial="hidden"
                                animate="show"
                                exit="exit"
                                aria-label={`${title} Submenu`}
                              >
                                {subLinks!.map((sub) => {
                                  const subActive = sub.href === pathname
                                  return (
                                    <li key={sub.href}>
                                      <Link href={sub.href} aria-current={subActive ? 'page' : undefined}>
                                        {sub.title}
                                      </Link>
                                    </li>
                                  )
                                })}
                              </Submenu>
                            )}
                          </AnimatePresence>
                        </>
                      )}
                    </MenuItem>
                  )
                })}
              </Menu>
            )}
          </AnimatePresence>

          {/* Hamburger (mobile) */}
          {!isDesktop && (
            <Hamburger
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              variants={fade}
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

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 1rem;

  img {
    border-radius: 50%;
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
    width: 1.75rem;
    height: 1px;
    background: var(--text);
    border-radius: 1px;
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
    border-radius: 5px;
    min-width: 120px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);

    li a {
      font-size: 0.95rem;
    }
  }

  /* Mobile dropdown */
  @media (max-width: 767px) {
    li a {
      padding: 0.5rem 2rem;
      position: relative;

      &:after {
        content: '';
        position: absolute;
        top: 0;
        right: 1rem;
        width: 1px;
        height: 100%;
        background: var(--accent);
      }
    }
  }
`
