import { describe, expect, it } from 'vitest'
import type { NavLinks } from '../../components/Nav'
import { BASE_URL } from '../constants'
import { getBreadcrumbStructuredData } from './breadcrumbs'

// Helper function to generate expected BreadcrumbList structured data
const getExpectedBreadcrumbList = (items: Array<{ name: string; item: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.item,
  })),
})

// Mock data constants
const HOME_ITEM = {
  name: 'Home',
  item: `${BASE_URL}/`,
}

const MOCK_NAV_LINKS: NavLinks = [
  { title: 'Home', href: '/' },
  { title: 'About', href: '/about' },
  {
    title: 'Services',
    subLinks: [
      { title: 'Consulting', href: '/services/consulting' },
      { title: 'Development', href: '/services/development' },
    ],
  },
  { title: 'Contact', href: '/contact' },
]

// Test cases
const breadcrumbTestCases = [
  {
    description: 'returns only "Home" when pathname is the homepage',
    pathname: '/',
    expectedItems: [HOME_ITEM],
  },
  {
    description: 'includes "Home" and the active top-level link for a matching pathname',
    pathname: '/about',
    expectedItems: [HOME_ITEM, { name: 'About', item: `${BASE_URL}/about` }],
  },
  {
    description: 'includes "Home" and the active sublink for a matching sublink pathname',
    pathname: '/services/consulting',
    expectedItems: [HOME_ITEM, { name: 'Consulting', item: `${BASE_URL}/services/consulting` }],
  },
  {
    description: 'returns only "Home" when pathname does not match any navLinks or sublinks',
    pathname: '/non-existent',
    expectedItems: [HOME_ITEM],
  },
  {
    description: 'handles empty navLinks array by returning only "Home"',
    pathname: '/about',
    navLinks: [] as NavLinks,
    expectedItems: [HOME_ITEM],
  },
]

describe('getBreadcrumbStructuredData', () => {
  breadcrumbTestCases.forEach(({ description, pathname, expectedItems, navLinks = MOCK_NAV_LINKS }) => {
    it(description, () => {
      const result = getBreadcrumbStructuredData(navLinks, pathname)
      const expected = getExpectedBreadcrumbList(expectedItems)
      expect(result).toEqual(expected)
    })
  })
})
