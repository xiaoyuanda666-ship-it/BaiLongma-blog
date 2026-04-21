import type { Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell nav-shell">
        <Link className="brand" href={'/' as Route}>
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
          <Link href={'/' as Route} className="nav-pill">官网</Link>
          <Link href={'/blog' as Route} className="nav-pill">博客</Link>
          <Link href={'/docs' as Route} className="nav-pill">文档</Link>
        </nav>
      </div>
    </header>
  )
}
