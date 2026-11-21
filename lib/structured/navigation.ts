import type { NavLinks } from '../../components/Nav'
import { SITE_ORIGIN } from '../constants'

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
              url: SITE_ORIGIN + sub.href,
            })),
          }
        }
        // Standard link
        else if (cat.href) {
          return {
            '@type': 'WebPage',
            name: cat.title,
            url: SITE_ORIGIN + cat.href,
          }
        }
        return null
      })
      .filter(Boolean),
  } as const
}
