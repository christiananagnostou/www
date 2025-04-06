import dayjs from 'dayjs'
import Link from 'next/link'
import styled from 'styled-components'
import LeftArrow from '../SVG/LeftArrow'
import RightArrow from '../SVG/RightArrow'
import Twitter from '../SVG/Twitter'
import { BASE_URL } from '../../lib/constants'

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
    <Footer>
      <NavLinks>
        {prevArticle ? (
          <FooterLink href={`/article/${prevArticle.slug}`}>
            <LeftArrow /> {prevArticle.title}
          </FooterLink>
        ) : (
          <FooterLink href="/articles">
            <LeftArrow /> All Articles
          </FooterLink>
        )}
        {nextArticle && (
          <FooterLink href={`/article/${nextArticle.slug}`}>
            {nextArticle.title} <RightArrow />
          </FooterLink>
        )}
      </NavLinks>

      <LinkRows>
        <a href="/api/article-rss" target="_blank" rel="noreferrer">
          RSS Feed
        </a>

        <a href="https://x.com/javascramble" target="_blank" rel="noreferrer" aria-label="X">
          Follow me on <Twitter />
        </a>

        <Copyright>© {YEAR} Christian Anagnostou. All rights reserved.</Copyright>
      </LinkRows>
    </Footer>
  )
}

export default ArticleFooter

const Footer = styled.footer`
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--accent);
  text-align: center;
  font-size: 0.9rem;
  color: var(--text);
`

const NavLinks = styled.nav`
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  gap: 2rem;
`

const FooterLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

const LinkRows = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  a {
    color: var(--text);
    display: flex;
    align-items: start;
    gap: 0.25rem;
    width: fit-content;
    margin: 0 auto;
  }
`

const Copyright = styled.div`
  font-size: 0.8rem;
`
