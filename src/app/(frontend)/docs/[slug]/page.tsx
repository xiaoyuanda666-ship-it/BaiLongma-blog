import { notFound } from 'next/navigation'

import { getDocBySlug, getPublishedDocs } from '@/lib/content'
import { parseContentBlocks } from '@/lib/format'

export default async function DocDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [doc, docs] = await Promise.all([getDocBySlug(slug), getPublishedDocs()])

  if (!doc) notFound()

  const relatedDocs = docs.filter((item: any) => item.section === doc.section && item.slug !== doc.slug)

  return (
    <div className="shell doc-detail-shell">
      <aside className="doc-sidebar">
        <span className="kicker">同一分组</span>
        <h3>{doc.section}</h3>
        <div className="doc-sidebar-links">
          {relatedDocs.length > 0 ? (
            relatedDocs.map((item: any) => (
              <a key={item.id} href={`/docs/${item.slug}`}>
                {item.title}
              </a>
            ))
          ) : (
            <p>当前分组暂时只有这一篇文档。</p>
          )}
        </div>
      </aside>

      <article className="article-card">
        <div className="article-meta">
          <span>{doc.section}</span>
          <span>{doc.keywords?.length || 0} 个关键词</span>
        </div>
        <h1>{doc.title}</h1>
        <p className="article-excerpt">{doc.summary}</p>
        <div className="article-body">
          {parseContentBlocks(doc.body).map((block, index) => {
            if (block.type === 'image') {
              return (
                <figure key={`${doc.id}-${index}`} className="article-media article-image">
                  <img src={block.src} alt={block.alt} loading="lazy" />
                  {block.alt !== 'Document image' ? <figcaption>{block.alt}</figcaption> : null}
                </figure>
              )
            }

            if (block.type === 'embed') {
              return (
                <div
                  key={`${doc.id}-${index}`}
                  className={`article-media article-embed article-embed-${block.provider}`}
                >
                  <iframe
                    src={block.src}
                    title={block.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              )
            }

            return <p key={`${doc.id}-${index}`}>{block.content}</p>
          })}
        </div>
      </article>
    </div>
  )
}
