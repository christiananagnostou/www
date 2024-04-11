import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Logo from '../public/A-circle.webp'

const Links = [
  { href: '/', title: 'Home' },
  { href: '/works', title: 'Works' },
  { href: '/articles', title: 'Articles' },
  { href: '/art', title: 'Art' },
  { href: '/contact', title: 'Contact' },
]

const Nav = () => {
  const { pathname } = useRouter()

  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const threshold = 0
    let lastScrollY = window.pageYOffset
    let ticking = false

    const updatehidden = () => {
      const scrollY = window.pageYOffset

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false
        return
      }
      setHidden(scrollY > lastScrollY ? true : false)
      lastScrollY = scrollY > 0 ? scrollY : 0
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updatehidden)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [hidden])

  return (
    <StyledNav style={hidden ? { top: '-10vh' } : { top: 0 }}>
      <div className="nav-inner max-w-screen">
        <ImageContainer>
          <Link href="/" id="logo">
            <Image src={Logo} alt="Website logo that links to the home page" height={30} width={30} />
          </Link>
        </ImageContainer>
        <ul>
          {Links.map(({ href, title }) => (
            <li key={title}>
              <Link href={href}>
                {title}
                <Line
                  transition={{ duration: 0.3 }}
                  initial={{ width: '0%' }}
                  animate={{ width: pathname === href ? 'calc(100% - .5rem)' : '0%' }}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </StyledNav>
  )
}
export default Nav

const StyledNav = styled.nav`
  height: var(--nav-height);
  background: rgba(20, 20, 20, 0.6);
  display: flex;
  align-items: center;
  position: sticky;
  z-index: 10;
  transition: top 0.5s ease;

  .nav-inner {
    display: flex;
    margin: auto;
    justify-content: space-between;
    align-items: center;
    padding: 0.2rem 1rem;
  }

  ul {
    display: flex;
    list-style: none;
    align-items: center;
    justify-content: flex-end;

    li a {
      padding: 0.25rem 0.5rem;
      position: relative;
      font-size: 1rem;

      color: var(--heading);
      text-decoration: none !important;
      transition: color 0.3s ease;

      &:hover {
        color: white;
      }

      @media screen and (min-width: 768px) {
        padding: 0.25rem 0.5rem;
        margin-left: 1rem;
      }
    }
  }
`

const ImageContainer = styled.div`
  border-radius: 50%;
  overflow: hidden;

  img {
    object-fit: cover;
    display: block;
    border-radius: inherit;
    user-select: none;
    pointer-events: none;
  }
`

const Line = styled(motion.div)`
  height: 1px;
  background: var(--accent);
  width: 0%;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
`
