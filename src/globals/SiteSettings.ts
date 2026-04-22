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
      defaultValue: 'Memory-Shaped · Continuous · Personal',
    },
    {
      name: 'heroTitle',
      type: 'text',
      defaultValue: '一个能记住、能按需想起的 AI Agent，一个只属于你的 AI 意识体',
    },
    {
      name: 'heroDescription',
      type: 'textarea',
      defaultValue:
        'BaiLongma 会围绕你、任务和长期目标持续运行，把记忆慢慢积累成自己的形状。它不只是对话工具，而是会越用越像你的那个 Agent。',
    },
    {
      name: 'primaryLabel',
      type: 'text',
      defaultValue: '阅读博客',
    },
    {
      name: 'primaryHref',
      type: 'text',
      defaultValue: '/blog',
    },
    {
      name: 'secondaryLabel',
      type: 'text',
      defaultValue: '查看文档',
    },
    {
      name: 'secondaryHref',
      type: 'text',
      defaultValue: '/docs',
    },
  ],
}
