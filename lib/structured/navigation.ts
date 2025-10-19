import type { NavLinks } from '../../components/Nav'
import { BASE_URL } from '../constants'

export const getSiteNavigationStructuredData = (links: NavLinks) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: 'Main Navigation',
    hasPart: links
      .map((cat) => {
        // Sublinks
        if (cat.subLinks && cat.subLinks.length > 0) {
          return {
            '@type': 'WebPage',
            name: cat.title,
            hasPart: cat.subLinks.map((sub) => ({
              '@type': 'WebPage',
              name: sub.title,
              url: BASE_URL + sub.href,
            })),
          }
        }
        // Standard link
        else if (cat.href) {
          return {
            '@type': 'WebPage',
            name: cat.title,
            url: BASE_URL + cat.href,
          }
        }
        return null
      })
      .filter(Boolean),
  } as const
}
