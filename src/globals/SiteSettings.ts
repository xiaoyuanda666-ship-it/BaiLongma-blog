import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Tick-Driven · Memory-Injected · Tool-Acting',
    },
    {
      name: 'heroTitle',
      type: 'text',
      defaultValue: '不是一问一答，而是持续运行的 AI Agent',
    },
    {
      name: 'heroDescription',
      type: 'textarea',
      defaultValue:
        'BaiLongma 围绕“持续意识流”构建。它会在 TICK 驱动下继续运行，在有消息时优先响应，在空闲时继续基于任务、记忆与上下文推进下一步动作。现在，这套能力也被整理进一个可部署的官网、博客、文档与后台系统里。',
    },
    {
      name: 'primaryLabel',
      type: 'text',
      defaultValue: '进入文档中心',
    },
    {
      name: 'primaryHref',
      type: 'text',
      defaultValue: '/docs',
    },
    {
      name: 'secondaryLabel',
      type: 'text',
      defaultValue: '阅读最新博客',
    },
    {
      name: 'secondaryHref',
      type: 'text',
      defaultValue: '/blog',
    },
  ],
}
