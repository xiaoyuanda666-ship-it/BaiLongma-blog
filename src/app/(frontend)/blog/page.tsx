import type { Route } from 'next'
import Link from 'next/link'

import { getPublishedPosts } from '@/lib/content'
import { formatDate } from '@/lib/format'

export default async function BlogPage() {
  const posts = await getPublishedPosts()

  return (
    <div className="shell listing-shell">
      <section className="page-heading">
        <span className="eyebrow">Brand Journal</span>
        <h1>博客</h1>
        <p>围绕产品、设计、AI Agent 实践与版本更新持续沉淀内容。</p>
      </section>

      <div className="listing-grid">
        {posts.map((post: any) => (
          <article key={post.id} className="listing-card">
            <div className="listing-meta">
              <span>{post.category}</span>
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <div className="listing-footer">
              <span>{post.readingTime || '6 min read'}</span>
              <Link href={`/blog/${post.slug}` as Route}>进入文章</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
