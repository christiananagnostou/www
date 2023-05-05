import dayjs from 'dayjs'
import fs from 'fs'
import matter from 'gray-matter'
import { join } from 'path'

export interface ArticleType {
  slug: string
  title: string
  content: string
  dateCreated: string
  lastUpdated?: string
  coverImg?: string
  summary?: string
  hidden?: boolean
  categories?: string[]
}

const postsDirectory = join(process.cwd(), 'lib/articles')

export function getPostSlugs(): string[] {
  return fs.readdirSync(postsDirectory)
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(postsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const items = {
    ...data,
    categories: data.categories?.split(',') || [],
    slug: realSlug,
    content: content,
  } as ArticleType

  return items
}

export function getAllPosts() {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post) => !post.hidden)
    // sort posts newest to oldest
    .sort((post1, post2) => (dayjs(post1.dateCreated).isBefore(dayjs(post2.dateCreated)) ? 1 : -1))
  return posts
}
