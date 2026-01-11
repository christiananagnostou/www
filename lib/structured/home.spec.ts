import { describe, expect, it } from 'vitest'
import type { ArticleType } from '../articles'
import type { BASE_URL } from '../constants'
import { getHomeStructuredData } from './home'

// Reusable Mock Articles
const mockArticles: ArticleType[] = [
  {
    title: 'Article 1',
    slug: 'article-1',
    dateCreated: '2023-01-01',
    summary: 'Summary of article 1',
    content: '',
  },
  {
    title: 'Article 2',
    slug: 'article-2',
    dateCreated: '2023-01-02',
    summary: 'Summary of article 2',
    content: '',
  },
  {
    title: 'Article 3',
    slug: 'article-3',
    dateCreated: '2023-01-03',
    summary: 'Summary of article 3',
    content: '',
  },
  {
    title: 'Article 4',
    slug: 'article-4',
    dateCreated: '2023-01-04',
    summary: 'Summary of article 4',
    content: '',
  },
]

const getExpectedItemListElement = (articles: ArticleType[]) =>
  articles.slice(0, 3).map((post, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${BASE_URL}/article/${post.slug}`,
      datePublished: post.dateCreated,
      description: post.summary,
    },
  }))

// Common Structured Data Parts
const commonStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Christian Anagnostou',
  url: `${BASE_URL}`,
  description: "Christian Anagnostou's Web Portfolio",
}

const personEntity = {
  '@type': 'Person',
  name: 'Christian Anagnostou',
  url: `${BASE_URL}`,
  sameAs: ['https://twitter.com/javascramble', 'https://github.com/ChristianAnagnostou'],
}

describe('getHomeStructuredData', () => {
  it('generates structured data for the home page with no articles', () => {
    const posts: ArticleType[] = []
    const result = getHomeStructuredData(posts)

    expect(result).toEqual({
      ...commonStructuredData,
      mainEntity: [
        {
          '@type': 'ItemList',
          name: 'Latest Articles',
          itemListElement: [],
        },
        personEntity,
      ],
    })
  })

  it('generates structured data with one article', () => {
    const posts = [mockArticles[0]]
    const result = getHomeStructuredData(posts)
    const expectedItemListElement = getExpectedItemListElement(posts)

    expect(result.mainEntity[0].itemListElement).toEqual(expectedItemListElement)
  })

  it('generates structured data with multiple articles, limited to three', () => {
    const posts = mockArticles
    const result = getHomeStructuredData(posts)
    const expectedItemListElement = getExpectedItemListElement(posts)

    expect(result.mainEntity[0].itemListElement).toEqual(expectedItemListElement)
    expect(result.mainEntity[0].itemListElement).toHaveLength(3)
  })

  it('correctly maps article properties to structured data', () => {
    const testArticle: ArticleType = {
      title: 'Test Article',
      slug: 'test-article',
      dateCreated: '2023-05-05',
      summary: 'This is a test article summary.',
      content: '',
    }
    const posts = [testArticle]
    const result = getHomeStructuredData(posts)
    const listItem = result.mainEntity[0].itemListElement[0]

    expect(listItem.item.headline).toBe(testArticle.title)
    expect(listItem.item.url).toBe(`${BASE_URL}/article/${testArticle.slug}`)
    expect(listItem.item.datePublished).toBe(testArticle.dateCreated)
    expect(listItem.item.description).toBe(testArticle.summary)
  })

  it('handles articles with missing optional properties', () => {
    const incompleteArticle: ArticleType = {
      title: 'Incomplete Article',
      slug: 'incomplete',
      dateCreated: '2023-06-01',
      content: '',
    }
    const posts = [incompleteArticle]
    const result = getHomeStructuredData(posts)
    const listItem = result.mainEntity[0].itemListElement[0]

    expect(listItem.item.description).toBeUndefined()
  })

  it('ensures the Person entity remains unchanged regardless of articles', () => {
    const posts: ArticleType[] = []
    const result = getHomeStructuredData(posts)

    expect(result.mainEntity[1]).toEqual(personEntity)
  })
})
