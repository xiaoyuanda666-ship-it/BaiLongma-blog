import type { Route } from 'next'
import Link from 'next/link'

import { getPublishedDocs } from '@/lib/content'

export const dynamic = 'force-dynamic'

export default async function DocsPage() {
  const docs = await getPublishedDocs()
  const groups = docs.reduce<Record<string, any[]>>((acc, doc: any) => {
    const key = doc.section || '未分类'
    if (!acc[key]) acc[key] = []
    acc[key].push(doc)
    return acc
  }, {})

  return (
    <div className="shell listing-shell">
      <section className="page-heading">
        <span className="eyebrow">Documentation Center</span>
        <h1>说明文档</h1>
        <p>面向产品介绍、部署方式、接口说明和使用指引的统一知识库。</p>
      </section>

      <div className="docs-sections">
        {Object.keys(groups).length > 0 ? (
          Object.entries(groups).map(([section, sectionDocs]) => (
            <section key={section} className="docs-section">
              <div className="section-head">
                <div>
                  <span className="kicker">{section}</span>
                  <h2>{section}</h2>
                </div>
              </div>
              <div className="docs-grid">
                {sectionDocs.map((doc: any) => (
                  <Link key={doc.id} href={`/docs/${doc.slug}` as Route} className="doc-card">
                    <span>{doc.section}</span>
                    <strong>{doc.title}</strong>
                    <p>{doc.summary}</p>
                  </Link>
                ))}
              </div>
            </section>
          ))
        ) : (
          <section className="docs-section">
            <div className="docs-grid">
              <article className="doc-card">
                <span>Documentation</span>
                <strong>文档内容会在初始化数据库后自动出现</strong>
                <p>先创建管理员并写入内容，或调用 seed 接口生成示例文档。</p>
              </article>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
