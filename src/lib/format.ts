export const formatDate = (value?: string | null) => {
  if (!value) return '待发布'

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value))
}

type ContentBlock =
  | {
      type: 'paragraph'
      content: string
    }
  | {
      type: 'image'
      src: string
      alt: string
    }
  | {
      type: 'embed'
      provider: 'youtube' | 'bilibili'
      src: string
      title: string
    }

const imageMarkdownPattern = /^!\[(.*?)\]\((https?:\/\/[^\s)]+)\)$/
const imageUrlPattern = /^https?:\/\/\S+\.(?:png|jpe?g|gif|webp|avif|svg)(?:\?\S*)?$/i

const getYouTubeEmbedUrl = (value: string) => {
  try {
    const url = new URL(value)
    const host = url.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0]
      if (id) return `https://www.youtube.com/embed/${id}`
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (url.pathname === '/watch') {
        const id = url.searchParams.get('v')
        if (id) return `https://www.youtube.com/embed/${id}`
      }

      if (url.pathname.startsWith('/embed/')) {
        const id = url.pathname.split('/').filter(Boolean)[1]
        if (id) return `https://www.youtube.com/embed/${id}`
      }

      if (url.pathname.startsWith('/shorts/')) {
        const id = url.pathname.split('/').filter(Boolean)[1]
        if (id) return `https://www.youtube.com/embed/${id}`
      }
    }
  } catch {
    return null
  }

  return null
}

const getBilibiliEmbedUrl = (value: string) => {
  try {
    const url = new URL(value)
    const host = url.hostname.replace(/^www\./, '')

    if (host === 'player.bilibili.com') {
      return value
    }

    if (host === 'bilibili.com' || host === 'm.bilibili.com') {
      const match = url.pathname.match(/\/video\/(BV[\w]+|av\d+)/i)
      if (!match) return null

      const identifier = match[1]
      const page = url.searchParams.get('p') || '1'

      if (/^BV/i.test(identifier)) {
        return `https://player.bilibili.com/player.html?bvid=${identifier}&page=${page}`
      }

      const aid = identifier.replace(/^av/i, '')
      return `https://player.bilibili.com/player.html?aid=${aid}&page=${page}`
    }
  } catch {
    return null
  }

  return null
}

const getMediaBlock = (block: string): ContentBlock | null => {
  const imageMatch = block.match(imageMarkdownPattern)
  if (imageMatch) {
    return {
      type: 'image',
      alt: imageMatch[1] || 'Document image',
      src: imageMatch[2],
    }
  }

  if (imageUrlPattern.test(block)) {
    return {
      type: 'image',
      alt: 'Document image',
      src: block,
    }
  }

  const youtubeUrl = getYouTubeEmbedUrl(block)
  if (youtubeUrl) {
    return {
      type: 'embed',
      provider: 'youtube',
      src: youtubeUrl,
      title: 'YouTube video',
    }
  }

  const bilibiliUrl = getBilibiliEmbedUrl(block)
  if (bilibiliUrl) {
    return {
      type: 'embed',
      provider: 'bilibili',
      src: bilibiliUrl,
      title: 'Bilibili video',
    }
  }

  return null
}

export const parseContentBlocks = (value?: string | null): ContentBlock[] =>
  (value || '')
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((block) => getMediaBlock(block) || { type: 'paragraph', content: block })

export const splitParagraphs = (value?: string | null) =>
  (value || '')
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean)
