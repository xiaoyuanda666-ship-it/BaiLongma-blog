import type { Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'

const GITHUB_URL = 'https://github.com/xiaoyuanda666-ship-it/BaiLongma'

export function SiteHeader() {
  return (
    <header className="site-header site-header-open">
      <div className="shell nav-shell nav-shell-open">
        <Link className="brand brand-open" href={'/' as Route}>
          <Image
            src="/brand/logo.png"
            alt="BaiLongma logo"
            width={64}
            height={64}
            className="brand-logo brand-logo-open"
          />
          <span className="brand-copy brand-copy-open">
            <strong>BaiLongma</strong>
            <small>一个会长出形状的 AI Agent</small>
          </span>
        </Link>
        <nav className="main-nav main-nav-open" aria-label="主导航">
          <Link href={'/blog' as Route} className="nav-pill nav-pill-solid">
            博客
          </Link>
          <a href={GITHUB_URL} className="nav-pill nav-pill-solid" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}
