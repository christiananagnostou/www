import { NavLinks } from '../../components/Nav'
import { BASE_URL } from '../constants'

export const getSiteNavigationStructuredData = (NAV_LINKS: NavLinks) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: 'Main Navigation',
    hasPart: NAV_LINKS.map((cat) => {
      if (cat.href) {
        return {
          '@type': 'WebPage',
          name: cat.title,
          url: BASE_URL + cat.href,
        }
      } else if (cat.subLinks && cat.subLinks.length > 0) {
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
      return null
    }).filter(Boolean),
  }
}
