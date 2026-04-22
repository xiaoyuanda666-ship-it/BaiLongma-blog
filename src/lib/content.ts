import { cache } from 'react'

import config from '@payload-config'
import { getPayload } from 'payload'

const getClient = cache(async () => getPayload({ config }))

const fallbackSite = {
  eyebrow: 'Tick-Driven · Memory-Injected · Tool-Acting',
  heroTitle: '不是一问一答，而是持续运行的 AI Agent',
  heroDescription:
    'BaiLongma 围绕“持续意识流”构建。它会在 TICK 驱动下继续运行，在有消息时优先响应，在空闲时继续基于任务、记忆与上下文推进下一步动作。现在，这套能力也被整理进一个可部署的官网、博客、文档与后台系统里。',
  primaryLabel: '进入文档中心',
  primaryHref: '/docs',
  secondaryLabel: '阅读最新博客',
  secondaryHref: '/blog',
}

export const getSiteSettings = cache(async () => {
  try {
    const payload = await getClient()
    return await payload.findGlobal({
      slug: 'site-settings',
    })
  } catch {
    return fallbackSite
  }
})

export const getPublishedPosts = cache(async () => {
  try {
    const payload = await getClient()
    const result = await payload.find({
      collection: 'posts',
      depth: 1,
      draft: false,
      limit: 100,
      sort: '-publishedAt',
      where: {
        _status: {
          equals: 'published',
        },
      },
    })

    return result.docs
  } catch {
    return []
  }
})

export const getFeaturedPosts = cache(async () => {
  try {
    const payload = await getClient()
    const result = await payload.find({
      collection: 'posts',
      depth: 1,
      draft: false,
      limit: 3,
      sort: '-publishedAt',
      where: {
        and: [
          {
            _status: {
              equals: 'published',
            },
          },
          {
            featured: {
              equals: true,
            },
          },
        ],
      },
    })

    return result.docs
  } catch {
    return []
  }
})

export const getPostBySlug = cache(async (slug: string) => {
  try {
    const payload = await getClient()
    const result = await payload.find({
      collection: 'posts',
      depth: 1,
      draft: false,
      limit: 1,
      where: {
        and: [
          {
            slug: {
              equals: slug,
            },
          },
          {
            _status: {
              equals: 'published',
            },
          },
        ],
      },
    })

    return result.docs[0] || null
  } catch {
    return null
  }
})

export const getPublishedDocs = cache(async () => {
  try {
    const payload = await getClient()
    const result = await payload.find({
      collection: 'docs',
      depth: 0,
      draft: false,
      limit: 100,
      sort: 'order',
      where: {
        _status: {
          equals: 'published',
        },
      },
    })

    return result.docs
  } catch {
    return []
  }
})

export const getDocBySlug = cache(async (slug: string) => {
  try {
    const payload = await getClient()
    const result = await payload.find({
      collection: 'docs',
      depth: 0,
      draft: false,
      limit: 1,
      where: {
        and: [
          {
            slug: {
              equals: slug,
            },
          },
          {
            _status: {
              equals: 'published',
            },
          },
        ],
      },
    })

    return result.docs[0] || null
  } catch {
    return null
  }
})
