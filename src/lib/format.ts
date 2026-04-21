export const formatDate = (value?: string | null) => {
  if (!value) return '待发布'

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value))
}

export const splitParagraphs = (value?: string | null) =>
  (value || '')
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean)
