import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArticleType, getAllPosts, getPostBySlug } from '../../lib/articles'
import markdownToHtml from '../../lib/articles/markdownToHtml'
import { BASE_URL } from '../../lib/constants'
import { pageAnimation } from '../../components/animation'
import LeftArrow from '../../components/SVG/LeftArrow'
import ArticleFooter from '../../components/Articles/ArticleFooter'
import ChainLink from '../../components/SVG/ChainLink'
import Checkmark from '../../components/SVG/Checkmark'
import HeartEmpty from '../../components/SVG/HeartEmpty'
import ArticleHead from '../../components/Articles/ArticleHead'
import { ArticleStyle, TopBar, TopBarButton, TitleWrap, ArticleContent } from '../../components/Articles/ArticleStyles'
import HeartFull from '../../components/SVG/HeartFull'
import { getLikes } from '../../lib/articles/likes'

interface ArticleWithLikes extends ArticleType {
  likes: number
}

interface Props {
  post: ArticleWithLikes
  prevArticle?: { slug: string; title: string }
  nextArticle?: { slug: string; title: string }
}

const TOC_HIGHLIGHT_PADDING_RATIO = 0.1

export async function getStaticPaths() {
  const posts = getAllPosts({ allowNoList: true })
  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  const content = await markdownToHtml(post.content || '')

  const likes = await getLikes(params.slug)

  const posts = getAllPosts()
  const currentIndex = posts.findIndex((p) => p.slug === params.slug)
  const prevArticle =
    currentIndex > 0 ? { slug: posts[currentIndex - 1].slug, title: posts[currentIndex - 1].title } : null
  const nextArticle =
    currentIndex < posts.length - 1
      ? { slug: posts[currentIndex + 1].slug, title: posts[currentIndex + 1].title }
      : null

  return {
    props: {
      post: { ...post, content, likes },
      prevArticle,
      nextArticle,
    },
    revalidate: 60 * 60, // Revalidate every hour
  }
}

const ArticleSlug = ({ post, prevArticle, nextArticle }: Props) => {
  const { title, content, dateCreated, slug, likes } = post
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(likes)
  const contentRef = useRef<HTMLElement | null>(null)
  const PageUrl = `${BASE_URL}/article/${slug}`

  useEffect(() => {
    const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '{}')
    setLiked(!!likedArticles[slug])
    setLikeCount(likes)
  }, [slug, likes])

  useEffect(() => {
    const contentEl = contentRef.current
    if (!contentEl) return

    const tocNav = contentEl.querySelector('nav')
    if (!tocNav) return

    const links = Array.from(tocNav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'))
    if (!links.length) return

    const targets = links
      .map((link) => {
        const href = link.getAttribute('href')
        if (!href) return null
        const id = decodeURIComponent(href.replace('#', ''))
        if (!id) return null
        const heading = document.getElementById(id)
        if (!heading) return null
        return { id, link, heading }
      })
      .filter(Boolean) as { id: string; link: HTMLAnchorElement; heading: HTMLElement }[]

    if (!targets.length) return

    const targetsById = new Map(targets.map((target) => [target.id, target]))

    const updateHighlight = () => {
      const activeLinks = links.filter((link) => link.getAttribute('data-active') === 'true')
      if (!activeLinks.length) {
        tocNav.style.removeProperty('--toc-highlight-top')
        tocNav.style.removeProperty('--toc-highlight-height')
        tocNav.style.removeProperty('--toc-highlight-gradient-start')
        tocNav.style.removeProperty('--toc-highlight-gradient-end')
        tocNav.removeAttribute('data-has-highlight')
        return
      }

      const positions = activeLinks.map((link) => {
        const top = link.offsetTop
        const height = link.offsetHeight
        return { top, bottom: top + height }
      })
      const top = Math.min(...positions.map((rect) => rect.top))
      const bottom = Math.max(...positions.map((rect) => rect.bottom))
      const height = bottom - top
      const padding = height * TOC_HIGHLIGHT_PADDING_RATIO
      const gradientStart = TOC_HIGHLIGHT_PADDING_RATIO * 100
      const gradientEnd = 100 - gradientStart
      const navPadding = Number.parseFloat(window.getComputedStyle(tocNav).paddingTop) || 0

      tocNav.style.setProperty('--toc-highlight-top', `${top - padding - navPadding}px`)
      tocNav.style.setProperty('--toc-highlight-height', `${height + padding * 2 + navPadding * 2}px`)

      tocNav.style.setProperty('--toc-highlight-gradient-start', `${gradientStart}%`)
      tocNav.style.setProperty('--toc-highlight-gradient-end', `${gradientEnd}%`)
      tocNav.setAttribute('data-has-highlight', 'true')
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = targetsById.get(entry.target.id)
          if (!target) return
          if (entry.isIntersecting) {
            target.link.setAttribute('data-active', 'true')
          } else {
            target.link.removeAttribute('data-active')
          }
        })
        updateHighlight()
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -25% 0px',
      }
    )

    const setInitialActive = () => {
      const viewportBottom = window.innerHeight * 0.75
      targets.forEach((target) => {
        const rect = target.heading.getBoundingClientRect()
        const inView = rect.top < viewportBottom && rect.bottom > 0
        if (inView) {
          target.link.setAttribute('data-active', 'true')
        } else {
          target.link.removeAttribute('data-active')
        }
      })
      updateHighlight()
    }

    const onResize = () => {
      updateHighlight()
    }

    targets.forEach((target) => observer.observe(target.heading))
    setInitialActive()
    window.addEventListener('resize', onResize)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [content])

  const copyUrl = () => {
    navigator.clipboard
      .writeText(PageUrl)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch((err) => console.error('Failed to copy URL:', err))
  }

  const handleLike = async () => {
    if (!liked) {
      const res = await fetch(`/api/articles/likes/${slug}`, { method: 'POST' })
      const data = await res.json()
      setLikeCount(data.likes)
      setLiked(true)

      const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '{}')
      likedArticles[slug] = true
      localStorage.setItem('likedArticles', JSON.stringify(likedArticles))
    }
  }

  return (
    <>
      <ArticleHead post={post} prevArticle={prevArticle} nextArticle={nextArticle} />

      <ArticleStyle variants={pageAnimation} initial="hidden" animate="show" exit="exit">
        <TopBar>
          <Link href="/articles">
            <LeftArrow />
            All Articles
          </Link>

          <div className="top-bar__right-side">
            <p className="date">{dateCreated}</p>
            <div className="top-bar__right-side__buttons">
              <TopBarButton
                onClick={copyUrl}
                aria-label="Copy URL"
                title="Copy URL"
                variants={{ notCopied: { width: 30 }, copied: { width: 106 } }}
                animate={copied ? 'copied' : 'notCopied'}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {copied ? (
                  <>
                    <Checkmark /> <span>Copied URL</span>
                  </>
                ) : (
                  <ChainLink />
                )}
              </TopBarButton>
              <TopBarButton aria-label="Like" title="Like" onClick={handleLike}>
                {liked ? <HeartFull /> : <HeartEmpty />}
                <span>{likeCount}</span>
              </TopBarButton>
            </div>
          </div>
        </TopBar>

        <TitleWrap>
          <h1 className="heading-gradient">{title}</h1>
        </TitleWrap>

        <ArticleContent ref={contentRef} dangerouslySetInnerHTML={{ __html: content }} />

        <ArticleFooter prevArticle={prevArticle} nextArticle={nextArticle} />
      </ArticleStyle>
    </>
  )
}

export default ArticleSlug
