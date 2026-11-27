import dayjs from 'dayjs'
import Link from 'next/link'

import LeftArrow from '../SVG/LeftArrow'
import RightArrow from '../SVG/RightArrow'
import Twitter from '../SVG/Twitter'

import styles from './ArticleFooter.module.css'

interface ArticleFooterProps {
  prevArticle?: {
    slug: string
    title: string
  }
  nextArticle?: {
    slug: string
    title: string
  }
}

const YEAR = dayjs().year()

export const ArticleFooter = ({ prevArticle, nextArticle }: ArticleFooterProps) => {
  return (
    <footer className={styles.footer}>
      <nav className={styles.navLinks}>
        {prevArticle ? (
          <Link className={styles.footerLink} href={`/article/${prevArticle.slug}`}>
            <LeftArrow /> {prevArticle.title}
          </Link>
        ) : (
          <Link className={styles.footerLink} href="/articles">
            <LeftArrow /> All Articles
          </Link>
        )}
        {nextArticle ? (
          <Link className={styles.footerLink} href={`/article/${nextArticle.slug}`}>
            {nextArticle.title} <RightArrow />
          </Link>
        ) : null}
      </nav>

      <div className={styles.linkRows}>
        <a href="/api/article-rss" rel="noreferrer" target="_blank">
          RSS Feed
        </a>

        <a aria-label="X" href="https://x.com/javascramble" rel="noreferrer" target="_blank">
          Follow me on <Twitter />
        </a>

        <div className={styles.copyright}>© {YEAR} Christian Anagnostou. All rights reserved.</div>
      </div>
    </footer>
  )
}

export default ArticleFooter
