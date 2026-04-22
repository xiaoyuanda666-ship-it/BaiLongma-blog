import type { Route } from 'next'
import Link from 'next/link'

import { getFeaturedPosts, getPublishedDocs, getSiteSettings } from '@/lib/content'
import { getMediaUrl } from '@/lib/format'

export const dynamic = 'force-dynamic'

const toRoute = (href: string | null | undefined, fallback: Route) => (href || fallback) as Route

export default async function HomePage() {
  const [site, featuredPosts, docs] = await Promise.all([
    getSiteSettings(),
    getFeaturedPosts(),
    getPublishedDocs(),
  ])

  const featuredDocs = docs.slice(0, 4)

  return (
    <div className="shell home-shell">
      <section className="hero-grid">
        <div className="hero-panel hero-main">
          <span className="eyebrow">{site.eyebrow}</span>
          <h1>{site.heroTitle}</h1>
          <p className="hero-copy">{site.heroDescription}</p>
          <div className="hero-actions">
            <Link className="button primary" href={toRoute(site.primaryHref, '/docs')}>
              {site.primaryLabel || '进入文档中心'}
            </Link>
            <Link className="button secondary" href={toRoute(site.secondaryHref, '/blog')}>
              {site.secondaryLabel || '阅读最新博客'}
            </Link>
          </div>
          <div className="stat-row">
            <article className="stat-card">
              <span>运行方式</span>
              <strong>Continuous Loop</strong>
              <p>不是请求式聊天，而是一个持续运行的主循环。</p>
            </article>
            <article className="stat-card">
              <span>核心能力</span>
              <strong>Memory + Tools</strong>
              <p>支持记忆注入、任务状态、工具执行与恢复。</p>
            </article>
            <article className="stat-card">
              <span>可视化</span>
              <strong>Docs + Brain UI</strong>
              <p>既能展示系统结构，也能沉淀文档、博客和产品演进过程。</p>
            </article>
          </div>
        </div>

        <aside className="hero-panel hero-side">
          <div className="card-title-row">
            <strong>Runtime Pulse</strong>
            <span className="tag">Agent</span>
          </div>
          <div className="timeline">
            <article className="timeline-card">
              <span>01</span>
              <div>
                <strong>接收消息</strong>
                <p>外部消息进入队列后，会打断当前思考并立刻切回响应路径。</p>
              </div>
            </article>
            <article className="timeline-card">
              <span>02</span>
              <div>
                <strong>记忆注入</strong>
                <p>对话窗口、人物记忆、任务知识与行为约束会按需装配进系统提示。</p>
              </div>
            </article>
            <article className="timeline-card">
              <span>03</span>
              <div>
                <strong>工具执行</strong>
                <p>支持文件操作、命令执行、网页抓取、调度提醒等 Agent 行动能力。</p>
              </div>
            </article>
            <article className="timeline-card">
              <span>04</span>
              <div>
                <strong>持续推进</strong>
                <p>空闲时继续 TICK，自适应节奏，重启后还能恢复任务状态。</p>
              </div>
            </article>
          </div>
        </aside>
      </section>

      <section className="section-block">
        <div className="section-head">
          <div>
            <span className="kicker">Featured Writing</span>
            <h2>一个 Agent，不止会“回答”</h2>
          </div>
          <p>
            白龙马的重点不是把模型包成聊天框，而是把长期运行、工具行动、
            任务持久化和记忆结构真正组合起来。
          </p>
        </div>
        <div className="feature-grid">
          {featuredPosts.length > 0 ? (
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
                <span className="mini-kicker">{post.category}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <Link href={`/blog/${post.slug}` as Route}>阅读全文</Link>
              </article>
            ))
          ) : (
            <article className="glass-card">
              <span className="mini-kicker">内容入口</span>
              <h3>从后台创建第一篇博客后，这里会自动展示精选文章</h3>
              <p>当你开始发布内容后，这里会自动展示精选文章与最新的产品思考。</p>
            </article>
          )}
        </div>
      </section>

      <section className="section-block">
        <div className="section-head">
          <div>
            <span className="kicker">Documentation</span>
            <h2>把系统能力整理成可以持续演进的知识库</h2>
          </div>
          <p>适合放快速开始、部署手册、接口说明，以及对 Agent 架构与能力的完整解释。</p>
        </div>
        <div className="docs-grid">
          {featuredDocs.map((doc: any) => (
            <Link key={doc.id} href={`/docs/${doc.slug}` as Route} className="doc-card">
              <span>{doc.section}</span>
              <strong>{doc.title}</strong>
              <p>{doc.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="cta-block">
        <div>
          <span className="kicker">Deployment Ready</span>
          <h2>从实验框架，到真正可部署的白龙马官网</h2>
          <p>
            基于 Node.js、Next.js 和 Payload CMS，这套项目既保留了旧版官网的核心表达，
            也补上了博客、文档与后台管理能力，可以直接部署到 Linux 服务器。
          </p>
        </div>
        <div className="cta-actions">
          <Link className="button primary" href="/docs">
            查看文档结构
          </Link>
          <Link className="button secondary" href="/blog">
            阅读产品博客
          </Link>
        </div>
      </section>
    </div>
  )
}
