import Link from 'next/link'

const GITHUB_URL = 'https://github.com/xiaoyuanda666-ship-it/BaiLongma'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-shell">
        <div>
          <strong>BaiLongma</strong>
          <p>一个能记住、能按需想起、还能持续运行的 AI Agent 官网。</p>
        </div>
        <div className="footer-links">
          <Link href="/blog">博客</Link>
          <Link href="/docs">文档</Link>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
