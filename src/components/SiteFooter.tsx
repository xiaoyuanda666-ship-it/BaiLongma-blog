import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-shell">
        <div>
          <strong>BaiLongma Blog</strong>
          <p>官网、博客、产品文档与内容后台的一体化品牌站。</p>
        </div>
        <div className="footer-links">
          <Link href="/blog">博客</Link>
          <Link href="/docs">文档</Link>
        </div>
      </div>
    </footer>
  )
}
