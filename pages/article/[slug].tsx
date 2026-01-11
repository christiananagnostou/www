import Link from 'next/link'
import { useEffect, useState } from 'react'
import ArticleFooter from '../../components/Articles/ArticleFooter'
import ArticleHead from '../../components/Articles/ArticleHead'
import { ArticleContent, ArticleStyle, TitleWrap, TopBar, TopBarButton } from '../../components/Articles/ArticleStyles'
import ChainLink from '../../components/SVG/ChainLink'
import Checkmark from '../../components/SVG/Checkmark'
import HeartEmpty from '../../components/SVG/HeartEmpty'
import HeartFull from '../../components/SVG/HeartFull'
import LeftArrow from '../../components/SVG/LeftArrow'
import type { ArticleType } from '../../lib/articles'
import { getAllPosts, getPostBySlug } from '../../lib/articles'
import markdownToHtml from '../../lib/articles/markdownToHtml'
import { BASE_URL } from '../../lib/constants'

interface ArticleWithLikes extends ArticleType {
  likes: number
}

interface Props {
  post: ArticleWithLikes
  prevArticle?: { slug: string; title: string }
  nextArticle?: { slug: string; title: string }
}

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
  const PageUrl = `${BASE_URL}/article/${slug}`

  useEffect(() => {
    const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '{}')
    setLiked(!!likedArticles[slug])
    setLikeCount(likes)
  }, [slug, likes])

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
      <ArticleHead nextArticle={nextArticle} post={post} prevArticle={prevArticle} />

      <ArticleStyle animate="show" exit="exit" initial="hidden" variants={pageAnimation}>
        <TopBar>
          <Link href="/articles">
            <LeftArrow />
            All Articles
          </Link>

          <div className="top-bar__right-side">
            <p className="date">{dateCreated}</p>
            <div className="top-bar__right-side__buttons">
              <TopBarButton
                animate={copied ? 'copied' : 'notCopied'}
                aria-label="Copy URL"
                title="Copy URL"
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                variants={{ notCopied: { width: 30 }, copied: { width: 106 } }}
                onClick={copyUrl}
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

        <ArticleContent dangerouslySetInnerHTML={{ __html: content }} />

        <ArticleFooter nextArticle={nextArticle} prevArticle={prevArticle} />
      </ArticleStyle>
    </>
  )
}

export default ArticleSlug
