import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

import { getPostBySlug } from '@/lib/content'
import {
  formatDate,
  getStandaloneBilibiliEmbedUrl,
  getStandaloneImageUrl,
  getStandaloneYouTubeEmbedUrl,
  getMediaUrl,
  preprocessDocMarkdown,
} from '@/lib/format'

const getOnlyTextChild = (children: ReactNode) => {
  const items = Array.isArray(children) ? children : [children]
  if (items.length !== 1 || typeof items[0] !== 'string') return null
  return items[0].trim()
}

const MarkdownVideo = ({
  webm,
  mp4,
  poster,
}: {
  webm?: string
  mp4?: string
  poster?: string
}) => (
  <div className="article-media article-video">
    <video controls playsInline preload="metadata" poster={poster}>
      {webm ? <source src={webm} type="video/webm" /> : null}
      {mp4 ? <source src={mp4} type="video/mp4" /> : null}
      您的浏览器暂不支持 HTML5 视频播放。
    </video>
  </div>
)

const MarkdownEmbed = ({
  src,
  title,
  provider,
}: {
  src: string
  title: string
  provider: string
}) => (
  <div className={`article-media article-embed article-embed-${provider}`}>
    <iframe
      src={src}
      title={title}
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  </div>
)

const markdownComponents = {
  h1: (props: ComponentPropsWithoutRef<'h1'>) => <h1 className="markdown-h1" {...props} />,
  h2: (props: ComponentPropsWithoutRef<'h2'>) => <h2 className="markdown-h2" {...props} />,
  h3: (props: ComponentPropsWithoutRef<'h3'>) => <h3 className="markdown-h3" {...props} />,
  p: ({ children }: { children?: ReactNode }) => {
    const text = getOnlyTextChild(children)

    if (text) {
      const imageUrl = getStandaloneImageUrl(text)
      if (imageUrl) {
        return (
          <figure className="article-media article-image">
            <img src={imageUrl} alt="Post image" loading="lazy" />
          </figure>
        )
      }

      const youtubeUrl = getStandaloneYouTubeEmbedUrl(text)
      if (youtubeUrl) {
        return <MarkdownEmbed src={youtubeUrl} title="YouTube video" provider="youtube" />
      }

      const bilibiliUrl = getStandaloneBilibiliEmbedUrl(text)
      if (bilibiliUrl) {
        return <MarkdownEmbed src={bilibiliUrl} title="Bilibili video" provider="bilibili" />
      }
    }

    return <p>{children}</p>
  },
  img: ({ src, alt }: any) =>
    typeof src === 'string' ? (
      <figure className="article-media article-image">
        <img src={src} alt={alt || 'Post image'} loading="lazy" />
        {alt ? <figcaption>{alt}</figcaption> : null}
      </figure>
    ) : null,
  a: ({
    href,
    children,
  }: {
    href?: string
    children?: ReactNode
  }) =>
    href ? (
      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
        {children}
      </a>
    ) : (
      <>{children}</>
    ),
  ul: (props: ComponentPropsWithoutRef<'ul'>) => <ul className="markdown-list" {...props} />,
  ol: (props: ComponentPropsWithoutRef<'ol'>) => <ol className="markdown-list" {...props} />,
  li: (props: ComponentPropsWithoutRef<'li'>) => <li className="markdown-list-item" {...props} />,
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote className="markdown-quote" {...props} />
  ),
  code: ({
    inline,
    children,
    ...props
  }: ComponentPropsWithoutRef<'code'> & { inline?: boolean }) =>
    inline ? (
      <code className="markdown-inline-code" {...props}>
        {children}
      </code>
    ) : (
      <code className="markdown-code" {...props}>
        {children}
      </code>
    ),
  pre: (props: ComponentPropsWithoutRef<'pre'>) => <pre className="markdown-pre" {...props} />,
  'blm-video': ({ webm, mp4, poster }: any) => (
    <MarkdownVideo webm={webm} mp4={mp4} poster={poster} />
  ),
  'blm-embed': ({ src, title, provider }: any) =>
    typeof src === 'string' && typeof title === 'string' && typeof provider === 'string' ? (
      <MarkdownEmbed src={src} title={title} provider={provider} />
    ) : null,
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post: any = await getPostBySlug(slug)

  if (!post) notFound()

  return (
    <div className="shell article-shell">
      <article className="article-card">
        <div className="article-meta">
          <span>{post.category}</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span>{post.readingTime || '6 min read'}</span>
        </div>
        {getMediaUrl(post.coverImage) ? (
          <div className="article-cover">
            <img src={getMediaUrl(post.coverImage) || ''} alt={post.coverImage?.alt || post.title} loading="lazy" />
          </div>
        ) : null}
        <h1>{post.title}</h1>
        <p className="article-excerpt">{post.excerpt}</p>
        <div className="article-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={markdownComponents as any}
          >
            {preprocessDocMarkdown(post.body)}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  )
}
