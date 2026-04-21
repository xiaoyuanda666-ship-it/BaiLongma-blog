import type { Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'

const links: Array<{ href: Route; label: string }> = [
  { href: '/', label: '官网' },
  { href: '/blog', label: '博客' },
  { href: '/docs', label: '文档' },
]

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell nav-shell">
        <Link className="brand" href="/">
          <Image
            src="/brand/logo.png"
            alt="BaiLongma logo"
            width={52}
            height={52}
            className="brand-logo"
          />
          <span className="brand-copy">
            <strong>BaiLongma</strong>
            <small>AI Agent Studio</small>
          </span>
        </Link>
        <nav className="main-nav" aria-label="主导航">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="nav-pill">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
