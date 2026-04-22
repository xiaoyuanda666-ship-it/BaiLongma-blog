import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'

import './globals.css'

export const metadata: Metadata = {
  title: 'BaiLongma',
  description: '白龙马官网、博客与文档系统。一个能记住、能按需想起、还能持续运行的 AI Agent。',
}

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return (
    <div className="page-shell">
      <div className="page-noise" />
      <div className="page-orbit" />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
