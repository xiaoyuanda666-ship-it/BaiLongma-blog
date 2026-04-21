import slugify from 'slugify'

export const formatSlug = (value: string) =>
  slugify(value, {
    lower: true,
    strict: true,
    trim: true,
    locale: 'zh-CN',
  })
