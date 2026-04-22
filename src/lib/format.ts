export const formatDate = (value?: string | null) => {
  if (!value) return '待发布'

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value))
}

const imageUrlPattern = /^https?:\/\/\S+\.(?:png|jpe?g|gif|webp|avif|svg)(?:\?\S*)?$/i
const videoUrlPattern = /^https?:\/\/\S+\.(?:webm|mp4)(?:\?\S*)?$/i

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

const escapeHtmlAttribute = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const getVideoTag = (block: string): string | null => {
  const lines = block
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  if (!lines.length) return null

  if (lines[0] === '[video]') {
    const payload = lines.slice(1)
    const entries = Object.fromEntries(
      payload
        .map((line) => {
          const separatorIndex = line.indexOf(':')
          if (separatorIndex === -1) return null

          const key = line.slice(0, separatorIndex).trim().toLowerCase()
          const value = line.slice(separatorIndex + 1).trim()
          return key && value ? [key, value] : null
        })
        .filter(Boolean) as Array<[string, string]>,
    )

    const webm = entries.webm
    const mp4 = entries.mp4
    const poster = entries.poster

    if (webm || mp4) {
      const attributes = [
        webm ? `webm="${escapeHtmlAttribute(webm)}"` : null,
        mp4 ? `mp4="${escapeHtmlAttribute(mp4)}"` : null,
        poster ? `poster="${escapeHtmlAttribute(poster)}"` : null,
      ]
        .filter(Boolean)
        .join(' ')

      return `<blm-video ${attributes}></blm-video>`
    }
  }

  if (lines.length === 1 && videoUrlPattern.test(lines[0])) {
    const source = lines[0]

    if (/\.webm(?:\?\S*)?$/i.test(source)) {
      return `<blm-video webm="${escapeHtmlAttribute(source)}"></blm-video>`
    }

    if (/\.mp4(?:\?\S*)?$/i.test(source)) {
      return `<blm-video mp4="${escapeHtmlAttribute(source)}"></blm-video>`
    }
  }

  return null
}

export const preprocessDocMarkdown = (value?: string | null) =>
  (value || '')
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((block) => {
      const videoTag = getVideoTag(block)
      if (videoTag) return videoTag

      const youtubeUrl = getYouTubeEmbedUrl(block)
      if (youtubeUrl) {
        return `<blm-embed provider="youtube" src="${escapeHtmlAttribute(youtubeUrl)}" title="YouTube video"></blm-embed>`
      }

      const bilibiliUrl = getBilibiliEmbedUrl(block)
      if (bilibiliUrl) {
        return `<blm-embed provider="bilibili" src="${escapeHtmlAttribute(bilibiliUrl)}" title="Bilibili video"></blm-embed>`
      }

      if (imageUrlPattern.test(block)) {
        return `![Document image](${block})`
      }

      return block
    })
    .join('\n\n')

export const getStandaloneImageUrl = (value: string) => (imageUrlPattern.test(value) ? value : null)

export const getStandaloneYouTubeEmbedUrl = (value: string) => getYouTubeEmbedUrl(value)

export const getStandaloneBilibiliEmbedUrl = (value: string) => getBilibiliEmbedUrl(value)

export const splitParagraphs = (value?: string | null) =>
  (value || '')
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean)

export const getMediaUrl = (
  media?: {
    url?: string | null
    filename?: string | null
  } | null,
) => {
  if (!media) return null
  if (media.url) return media.url
  if (media.filename) return `/api/media/file/${media.filename}`
  return null
}
