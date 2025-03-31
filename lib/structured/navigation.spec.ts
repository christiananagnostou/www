import { describe, it, expect } from 'vitest'
import { BASE_URL } from '../constants'
import { getSiteNavigationStructuredData } from './navigation'
import { NavLinks } from '../../components/Nav'

const BASE_STRUCTURE = {
  '@context': 'https://schema.org',
  '@type': 'SiteNavigationElement',
  name: 'Main Navigation',
}

describe('getSiteNavigationStructuredData', () => {
  it('handles a link with an href', () => {
    const links = [{ title: 'Home', href: '/' }]
    const result = getSiteNavigationStructuredData(links)
    expect(result).toEqual({
      ...BASE_STRUCTURE,
      hasPart: [
        {
          '@type': 'WebPage',
          name: 'Home',
          url: `${BASE_URL}/`,
        },
      ],
    })
  })

  it('handles a link with subLinks', () => {
    const links = [{ title: 'Products', subLinks: [{ title: 'Product 1', href: '/products/1' }] }]
    const result = getSiteNavigationStructuredData(links)
    expect(result).toEqual({
      ...BASE_STRUCTURE,
      hasPart: [
        {
          '@type': 'WebPage',
          name: 'Products',
          hasPart: [
            {
              '@type': 'WebPage',
              name: 'Product 1',
              url: `${BASE_URL}/products/1`,
            },
          ],
        },
      ],
    })
  })

  it('handles a link with both href and subLinks, prioritizing sublinks', () => {
    const links = [{ title: 'Blog', href: '/blog', subLinks: [{ title: 'Post 1', href: '/blog/1' }] }]
    const result = getSiteNavigationStructuredData(links)
    expect(result).toEqual({
      ...BASE_STRUCTURE,
      hasPart: [
        {
          '@type': 'WebPage',
          name: 'Blog',
          hasPart: [
            {
              '@type': 'WebPage',
              name: 'Post 1',
              url: `${BASE_URL}/blog/1`,
            },
          ],
        },
      ],
    })
  })

  it('filters out links with neither href nor subLinks', () => {
    const links = [{ title: 'Contact' }]
    const result = getSiteNavigationStructuredData(links)
    expect(result).toEqual({
      ...BASE_STRUCTURE,
      hasPart: [],
    })
  })

  it('handles an empty links array', () => {
    const links: NavLinks = []
    const result = getSiteNavigationStructuredData(links)
    expect(result).toEqual({
      ...BASE_STRUCTURE,
      hasPart: [],
    })
  })

  it('handles a mix of different link types', () => {
    const links = [
      { title: 'Home', href: '/' },
      {
        title: 'Products',
        subLinks: [
          { title: 'Product 1', href: '/products/1' },
          { title: 'Product 2', href: '/products/2' },
        ],
      },
      { title: 'About', href: '/about' },
      { title: 'Contact' },
    ]
    const result = getSiteNavigationStructuredData(links)
    expect(result).toEqual({
      ...BASE_STRUCTURE,
      hasPart: [
        {
          '@type': 'WebPage',
          name: 'Home',
          url: `${BASE_URL}/`,
        },
        {
          '@type': 'WebPage',
          name: 'Products',
          hasPart: [
            {
              '@type': 'WebPage',
              name: 'Product 1',
              url: `${BASE_URL}/products/1`,
            },
            {
              '@type': 'WebPage',
              name: 'Product 2',
              url: `${BASE_URL}/products/2`,
            },
          ],
        },
        {
          '@type': 'WebPage',
          name: 'About',
          url: `${BASE_URL}/about`,
        },
      ],
    })
  })

  it('filters out links with empty subLinks', () => {
    const links = [{ title: 'Empty', subLinks: [] }]
    const result = getSiteNavigationStructuredData(links)
    expect(result).toEqual({
      ...BASE_STRUCTURE,
      hasPart: [],
    })
  })
})
