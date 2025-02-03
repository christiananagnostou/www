import { NavLinks } from '../../components/Nav'
import { BASE_URL } from '../constants'

const getActiveNavItem = (navLinks: NavLinks, pathname: string) => {
  // Determine the active navigation item for breadcrumb markup.
  let activeNavItem: { title: string; href: string } | null = null
  if (pathname) {
    for (let link of navLinks) {
      if (link.href && link.href === pathname) {
        activeNavItem = { title: link.title, href: link.href }
        break
      }
      if (link.subLinks) {
        for (let sub of link.subLinks) {
          if (sub.href === pathname) {
            activeNavItem = { title: sub.title, href: sub.href }
            break
          }
        }
      }
      if (activeNavItem) break
    }
  }

  return activeNavItem
}

// Breadcrumb: always starts with Home; add active page if not on the homepage.
export const getBreadcrumbStructuredData = (navLinks: NavLinks, pathname: string) => {
  const activeNavItem = getActiveNavItem(navLinks, pathname)
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL + '/',
      },
      ...(activeNavItem && pathname !== '/'
        ? [
            {
              '@type': 'ListItem',
              position: 2,
              name: activeNavItem.title,
              item: BASE_URL + activeNavItem.href,
            },
          ]
        : []),
    ],
  }
}
