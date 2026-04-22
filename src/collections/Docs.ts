import type { CollectionConfig } from 'payload'

import { formatSlug } from '@/lib/slug'

export const Docs: CollectionConfig = {
  slug: 'docs',
  admin: {
    defaultColumns: ['title', 'section', 'order', '_status'],
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.title && !data?.slug) {
          return {
            ...data,
            slug: formatSlug(data.title),
          }
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'section',
      type: 'select',
      defaultValue: '产品文档',
      options: ['快速开始', '产品文档', '部署手册', 'API 说明'].map((value) => ({
        label: value,
        value,
      })),
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 10,
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      admin: {
        description:
          '支持 Markdown。图片可写 ![说明](图片URL) 或直接贴图片链接；YouTube / Bilibili 可直接贴视频链接；双格式视频可写 [video] 后跟 webm: 和 mp4:。',
      },
    },
    {
      name: 'keywords',
      type: 'array',
      fields: [
        {
          name: 'keyword',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
