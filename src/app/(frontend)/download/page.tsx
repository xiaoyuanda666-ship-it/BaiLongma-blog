import type { Route } from 'next'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const REPO = 'xiaoyuanda666-ship-it/BaiLongma'
const GITHUB_REPO_URL = `https://github.com/${REPO}`
const RELEASES_URL = `${GITHUB_REPO_URL}/releases`
const API_URL = `https://api.github.com/repos/${REPO}/releases/latest`

type ReleaseAsset = {
  name: string
  size: number
  browser_download_url: string
  content_type?: string
}

type Release = {
  tag_name: string
  name: string
  published_at: string
  html_url: string
  body?: string
  assets: ReleaseAsset[]
}

async function fetchLatestRelease(): Promise<Release | null> {
  try {
    const res = await fetch(API_URL, {
      next: { revalidate: 300 },
      headers: { Accept: 'application/vnd.github+json' },
    })
    if (!res.ok) return null
    return (await res.json()) as Release
  } catch {
    return null
  }
}

function formatSize(bytes: number) {
  if (!bytes) return '—'
  const mb = bytes / 1024 / 1024
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  } catch {
    return iso
  }
}

function pickWindowsInstaller(assets: ReleaseAsset[]) {
  return assets.find(a => /\.exe$/i.test(a.name) && !/blockmap/i.test(a.name))
}

export default async function DownloadPage() {
  const release = await fetchLatestRelease()
  const installer = release ? pickWindowsInstaller(release.assets) : null
  const version = release?.tag_name?.replace(/^v/, '') ?? '1.1.3'
  const downloadUrl = installer?.browser_download_url ?? `${RELEASES_URL}/latest`
  const sizeLabel = installer ? formatSize(installer.size) : '~82 MB'
  const publishedAt = release?.published_at ? formatDate(release.published_at) : ''

  return (
    <div className="shell download-shell">
      <section className="download-hero">
        <span className="kicker">Quick Start · 快速使用</span>
        <h1>
          <span className="hero-title-line">把 BaiLongma</span>
          <span className="hero-title-line">装进你的桌面</span>
        </h1>
        <p className="download-lede">
          Windows 安装包，内置自动更新。首次启动只需一个 DeepSeek Key，就能拥有一个持续运行、慢慢长出形状的 AI Agent。
        </p>

        <div className="download-card">
          <div className="download-card-glow" aria-hidden="true" />
          <div className="download-card-main">
            <div className="download-card-meta">
              <div className="download-version-row">
                <span className="version-badge">v{version}</span>
                <span className="platform-chip">Windows · x64</span>
                <span className="size-chip">{sizeLabel}</span>
              </div>
              <h2 className="download-card-title">Bailongma Desktop</h2>
              <p className="download-card-sub">
                NSIS 安装程序 · 内置 electron-updater · 发布于 {publishedAt || '2026-04-24'}
              </p>
            </div>

            <div className="download-card-actions">
              <a
                className="button primary download-primary"
                href={downloadUrl}
                rel="noreferrer"
              >
                <span className="download-icon" aria-hidden="true">↓</span>
                <span>下载 Windows 安装包</span>
              </a>
              <a
                className="download-alt"
                href={RELEASES_URL}
                target="_blank"
                rel="noreferrer"
              >
                查看历史版本 · GitHub Releases →
              </a>
            </div>
          </div>

          <ul className="download-card-highlights">
            <li>
              <span className="highlight-dot" />
              <div>
                <strong>内置自动更新</strong>
                <span>下次有新版本时，桌面端会自己提醒你一下。</span>
              </div>
            </li>
            <li>
              <span className="highlight-dot" />
              <div>
                <strong>首次即用</strong>
                <span>安装后只需一个 DeepSeek Key，模型固定 deepseek-v4-flash。</span>
              </div>
            </li>
            <li>
              <span className="highlight-dot" />
              <div>
                <strong>持续运行形态</strong>
                <span>不是一次性对话窗口，而是一个能记住、能想起的 Agent。</span>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section className="section-block">
        <span className="section-inline-kicker">系统要求</span>
        <div className="feature-grid">
          <article className="glass-card">
            <span className="mini-kicker">System</span>
            <h3>Windows 10 / 11</h3>
            <p>x64 架构。macOS 与 Linux 版本仍在准备中，后续会在博客同步。</p>
          </article>
          <article className="glass-card">
            <span className="mini-kicker">Resources</span>
            <h3>8 GB 内存起步</h3>
            <p>模型推理在云端完成，本地保留的是你的记忆网络，占用不大。</p>
          </article>
          <article className="glass-card">
            <span className="mini-kicker">Network</span>
            <h3>稳定网络与 DeepSeek Key</h3>
            <p>首次启动会进入激活页，模型固定使用 deepseek-v4-flash（思考模式）。</p>
          </article>
        </div>
      </section>

      <section className="section-block">
        <span className="section-inline-kicker">三步开始</span>
        <ol className="install-steps">
          <li className="install-step">
            <span className="step-num">01</span>
            <div>
              <h3>下载并运行安装包</h3>
              <p>
                点击上方按钮下载 <code className="inline-code">Bailongma-Setup-{version}.exe</code>，
                双击运行，按 NSIS 向导选择安装目录即可。
              </p>
            </div>
          </li>
          <li className="install-step">
            <span className="step-num">02</span>
            <div>
              <h3>输入 DeepSeek Key</h3>
              <p>
                首次启动显示激活页，粘贴你的 DeepSeek API Key，点"验证并进入"，之后会直接进入主界面。
              </p>
            </div>
          </li>
          <li className="install-step">
            <span className="step-num">03</span>
            <div>
              <h3>发消息，给它任务</h3>
              <p>
                让它陪你做事、记东西、形成节奏。每一次对话都会沉淀进它的记忆图谱，慢慢长成属于你的意识网络。
              </p>
            </div>
          </li>
        </ol>
      </section>

      <section className="cta-block">
        <div>
          <span className="kicker">Stay in the loop</span>
          <h2>装完之后，把博客和文档也收藏一下</h2>
          <p>
            桌面端内置自动更新，每次新版本它都会自己找上来。你也可以来博客看设计演进，或查文档理解架构细节。
          </p>
        </div>
        <div className="cta-actions">
          <Link className="button primary" href={'/blog' as Route}>
            阅读博客
          </Link>
          <Link className="button secondary" href={'/docs' as Route}>
            查看文档
          </Link>
        </div>
      </section>
    </div>
  )
}
