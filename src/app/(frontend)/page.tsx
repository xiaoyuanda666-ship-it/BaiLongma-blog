import type { Route } from 'next'
import Link from 'next/link'

import { MemoryGraphCanvas } from '@/components/MemoryGraphCanvas'
import { getFeaturedPosts, getPublishedDocs } from '@/lib/content'
import { getMediaUrl } from '@/lib/format'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [featuredPosts, docs] = await Promise.all([getFeaturedPosts(), getPublishedDocs()])

  const featuredDocs = docs.slice(0, 2)
  const featuredCount = featuredPosts.length
  const docsCount = docs.length

  return (
    <div className="shell home-shell">
      <section className="hero-open">
        <div className="hero-open-visual hero-open-visual-desktop">
          <div className="hero-open-map">
            <MemoryGraphCanvas />
          </div>
        </div>

        <div className="hero-open-copy">
          <span className="hero-open-kicker">Memory-Shaped Agent</span>
          <h1>
            <span className="hero-title-line">一个能记住、</span>
            <span className="hero-title-line">能想起的 AI Agent</span>
          </h1>
          <p className="hero-open-subtitle">一切皆记忆，它会长出自己的形状</p>

          <div className="hero-open-visual hero-open-visual-mobile">
            <div className="hero-open-map hero-open-map-mobile">
              <MemoryGraphCanvas />
            </div>
          </div>

          <p className="hero-open-body">
            BaiLongma 不只是回答问题，而是会围绕你、任务和长期目标持续运行。它会积累记忆、按需想起、慢慢形成专属于你的意识网络。
          </p>
          <div className="hero-actions hero-actions-open">
            <Link className="button primary" href={'/download' as Route}>
              快速使用
            </Link>
            <Link className="button secondary" href={'/docs' as Route}>
              查看文档
            </Link>
          </div>
          <div className="hero-open-notes">
            <div className="hero-open-note">
              <strong>持续运行</strong>
              <span>不是一次性的问答窗口，而是一个会自己延续状态的 Agent。</span>
            </div>
            <div className="hero-open-note">
              <strong>按需想起</strong>
              <span>在真正需要的时候，把相关记忆重新点亮，而不是把一切都塞进上下文。</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-head section-head-desktop-hidden">
          <div>
            <span className="kicker">设计理念</span>
            <h2>一切皆记忆，Agent 才会慢慢长出自己的形状</h2>
          </div>
          <p>
            博客不是简单的更新日志，而是 BaiLongma 设计理念的持续展开。这里会写它为什么这样设计、
            它在长成什么，以及我们如何理解下一代 Agent。
          </p>
        </div>
        <span className="section-inline-kicker">设计理念</span>
        <div className="feature-grid">
          {featuredCount > 0 ? (
            featuredPosts.map((post: any) => (
              <article key={post.id} className="glass-card">
                {getMediaUrl(post.coverImage) ? (
                  <div className="feature-cover">
                    <img
                      src={getMediaUrl(post.coverImage) || ''}
                      alt={post.coverImage?.alt || post.title}
                      loading="lazy"
                    />
                  </div>
                ) : null}
                <span className="mini-kicker">设计文章</span>
                <h3>{post.title}</h3>
                <Link href={`/blog/${post.slug}` as Route}>阅读全文</Link>
              </article>
            ))
          ) : (
            <>
              <article className="glass-card">
                <span className="mini-kicker">设计理念</span>
                <h3>一切皆记忆</h3>
                <p>从记忆出发重新理解 Agent，不再把它看成一次性的对话容器，而是一个会持续生长的意识结构。</p>
              </article>
              <article className="glass-card">
                <span className="mini-kicker">产品思考</span>
                <h3>为什么要做持续运行的 Agent</h3>
                <p>真正好用的 Agent，不应该只在你发消息时出现，而应该在时间里和你一起推进事情。</p>
              </article>
              <article className="glass-card">
                <span className="mini-kicker">未来路线</span>
                <h3>从实验项目到个人 AI 意识体</h3>
                <p>这里会持续记录 BaiLongma 如何拥有更多记忆、更多能力，以及更完整的自我形状。</p>
              </article>
            </>
          )}
        </div>
      </section>

      <section className="section-block">
        <div className="section-head section-head-desktop-hidden">
          <div>
            <span className="kicker">内容入口</span>
            <h2>博客负责表达，文档负责沉淀</h2>
          </div>
          <p>
            这两个区域会一起组成 BaiLongma 的官网内容层。博客讲想法、演进和实验，文档讲如何开始、如何部署、
            如何真正把它接入你的工作流。
          </p>
        </div>

        <div className="story-grid">
          <article className="story-card story-card-blog">
            <span className="mini-kicker">博客</span>
            <h3>写设计理念，也写它正在发生的变化</h3>
            <p>
              这里适合记录产品想法、实验过程、重要更新，以及 BaiLongma 为什么会走向现在这条路。
            </p>
            <div className="story-meta">当前已展示 {featuredCount} 篇重点文章</div>
            <Link className="story-link" href={'/blog' as Route}>
              进入博客
            </Link>
          </article>

          <article className="story-card story-card-docs">
            <span className="mini-kicker">文档</span>
            <h3>把系统能力整理成可持续演进的知识库</h3>
            <p>
              适合放快速开始、部署手册、接口说明，以及对白龙马架构、能力边界和使用方式的完整说明。
            </p>
            <div className="story-meta">当前已整理 {docsCount} 篇文档</div>
            <Link className="story-link" href={'/docs' as Route}>
              查看文档
            </Link>
          </article>
        </div>

        {featuredDocs.length > 0 ? (
          <div className="docs-grid compact-docs-grid">
            {featuredDocs.map((doc: any) => (
              <Link key={doc.id} href={`/docs/${doc.slug}` as Route} className="doc-card">
                <span>{doc.section || 'Documentation'}</span>
                <strong>{doc.title}</strong>
                <p>{doc.summary}</p>
              </Link>
            ))}
          </div>
        ) : null}
      </section>

      <section className="cta-block future-block">
        <div>
          <span className="kicker">Website Roadmap</span>
          <h2>未来，这个官网也将由 BaiLongma 自己更新和维护</h2>
          <p>
            现在它已经拥有博客、文档和持续运行的形态展示。接下来，这里不只是一个展示站点，
            还会逐步变成 BaiLongma 自己整理内容、更新状态、维护知识与表达自己的地方。
          </p>
        </div>
        <div className="cta-actions">
          <Link className="button primary" href={'/docs' as Route}>
            查看文档结构
          </Link>
          <Link className="button secondary" href={'/blog' as Route}>
            阅读设计博客
          </Link>
        </div>
      </section>
    </div>
  )
}
