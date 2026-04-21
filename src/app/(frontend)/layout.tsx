import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'

import './globals.css'

export const metadata: Metadata = {
  title: 'BaiLongma Blog',
  description: '白龙马品牌官网、博客、文档与后台系统',
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
