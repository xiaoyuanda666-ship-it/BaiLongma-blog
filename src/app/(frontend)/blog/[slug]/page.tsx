import { notFound } from 'next/navigation'

import { getPostBySlug } from '@/lib/content'
import { formatDate, splitParagraphs } from '@/lib/format'

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  return (
    <div className="shell article-shell">
      <article className="article-card">
        <div className="article-meta">
          <span>{post.category}</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span>{post.readingTime || '6 min read'}</span>
        </div>
        <h1>{post.title}</h1>
        <p className="article-excerpt">{post.excerpt}</p>
        <div className="article-body">
          {splitParagraphs(post.body).map((paragraph, index) => (
            <p key={`${post.id}-${index}`}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  )
}
