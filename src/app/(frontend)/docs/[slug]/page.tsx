import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

import { getDocBySlug } from '@/lib/content'
import {
  getStandaloneBilibiliEmbedUrl,
  getStandaloneImageUrl,
  getStandaloneYouTubeEmbedUrl,
  preprocessDocMarkdown,
} from '@/lib/format'
import { formatSlug } from '@/lib/slug'

type TocItem = {
  id: string
  title: string
}

type TocGroup = {
  id: string
  title: string
  items: TocItem[]
}

const getOnlyTextChild = (children: ReactNode) => {
  const items = Array.isArray(children) ? children : [children]
  if (items.length !== 1 || typeof items[0] !== 'string') return null
  return items[0].trim()
}

const getNodeText = (node: ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (!node) return ''
  if (Array.isArray(node)) return node.map(getNodeText).join('')
  if (typeof node === 'object' && 'props' in node) {
    return getNodeText((node as { props?: { children?: ReactNode } }).props?.children)
  }
  return ''
}

const stripMarkdown = (value: string) =>
  value
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*_~>#-]/g, '')
    .trim()

const buildHeadingMap = (markdown: string) => {
  const matches = Array.from(markdown.matchAll(/^(#{1,3})\s+(.+)$/gm))
  const used = new Map<string, number>()
  const idsByLevel = {
    h1: [] as string[],
    h2: [] as string[],
    h3: [] as string[],
  }
  const groups: TocGroup[] = []
  let currentGroup: TocGroup | null = null

  const createId = (title: string) => {
    const base = formatSlug(stripMarkdown(title)) || 'section'
    const seen = used.get(base) ?? 0
    used.set(base, seen + 1)
    return seen === 0 ? base : `${base}-${seen + 1}`
  }

  for (const match of matches) {
    const hashes = match[1]
    const rawTitle = match[2].trim()
    const title = stripMarkdown(rawTitle)

    if (!title) continue

    const id = createId(title)

    if (hashes === '#') {
      idsByLevel.h1.push(id)
      continue
    }

    if (hashes === '##') {
      idsByLevel.h2.push(id)
      currentGroup = {
        id,
        title,
        items: [],
      }
      groups.push(currentGroup)
      continue
    }

    idsByLevel.h3.push(id)

    if (!currentGroup) {
      currentGroup = {
        id,
        title: '本页概览',
        items: [],
      }
      groups.push(currentGroup)
    }

    currentGroup.items.push({ id, title })
  }

  return { groups, idsByLevel }
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

export default async function DocDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const doc = await getDocBySlug(slug)

  if (!doc) notFound()

  const markdown = preprocessDocMarkdown(doc.body)
  const { groups, idsByLevel } = buildHeadingMap(doc.body)
  const headingCursor = {
    h1: 0,
    h2: 0,
    h3: 0,
  }

  const getHeadingProps = (level: 'h1' | 'h2' | 'h3', children: ReactNode) => {
    const fallback = formatSlug(getNodeText(children)) || `${level}-${headingCursor[level] + 1}`
    const id = idsByLevel[level][headingCursor[level]] ?? fallback
    headingCursor[level] += 1

    return {
      id,
      className: `markdown-${level}`,
    }
  }

  const markdownComponents = {
    h1: ({ children, ...props }: ComponentPropsWithoutRef<'h1'>) => (
      <h1 {...props} {...getHeadingProps('h1', children)}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: ComponentPropsWithoutRef<'h2'>) => (
      <h2 {...props} {...getHeadingProps('h2', children)}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: ComponentPropsWithoutRef<'h3'>) => (
      <h3 {...props} {...getHeadingProps('h3', children)}>
        {children}
      </h3>
    ),
    p: ({ children }: { children?: ReactNode }) => {
      const text = getOnlyTextChild(children)

      if (text) {
        const imageUrl = getStandaloneImageUrl(text)
        if (imageUrl) {
          return (
            <figure className="article-media article-image">
              <img src={imageUrl} alt="Document image" loading="lazy" />
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
          <img src={src} alt={alt || 'Document image'} loading="lazy" />
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

  return (
    <div className="shell doc-detail-shell">
      <div className="doc-detail-frame">
        <aside className="doc-outline" aria-label="文档目录导航">
          <div className="doc-outline-inner">
            <div className="doc-outline-header">
              <span className="kicker">On this page</span>
              <h2>{doc.section}</h2>
            </div>

            {groups.length > 0 ? (
              <nav className="doc-outline-groups">
                {groups.map((group) => (
                  <div key={group.id} className="doc-outline-group">
                    <a className="doc-outline-group-link" href={`#${group.id}`}>
                      <span>{group.title}</span>
                    </a>
                    {group.items.length > 0 ? (
                      <div className="doc-outline-items">
                        {group.items.map((item) => (
                          <a key={item.id} className="doc-outline-item" href={`#${item.id}`}>
                            {item.title}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </nav>
            ) : null}
          </div>
        </aside>

        <article className="doc-article">
          <div className="article-meta">
            <span>{doc.section}</span>
            <span>{doc.keywords?.length || 0} 个关键词</span>
          </div>
          <h1>{doc.title}</h1>
          <p className="article-excerpt">{doc.summary}</p>
          <div className="article-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={markdownComponents as any}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  )
}
