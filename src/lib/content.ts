import { cache } from 'react'

import config from '@payload-config'
import { getPayload } from 'payload'

const getClient = cache(async () => getPayload({ config }))

const fallbackSite = {
  eyebrow: 'Memory-Shaped · Continuous · Personal',
  heroTitle: '一个能记住、能按需想起的 AI Agent，一个只属于你的 AI 意识体',
  heroDescription:
    'BaiLongma 会围绕你、任务和长期目标持续运行，把记忆慢慢积累成自己的形状。它不只是对话工具，而是会越用越像你的那个 Agent。',
  primaryLabel: '阅读博客',
  primaryHref: '/blog',
  secondaryLabel: '查看文档',
  secondaryHref: '/docs',
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
