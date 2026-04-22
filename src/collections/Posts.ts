import type { CollectionConfig } from 'payload'

import { formatSlug } from '@/lib/slug'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
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
      name: 'category',
      type: 'select',
      defaultValue: '产品思考',
      options: ['产品思考', '工程实践', '案例拆解', '发布日志'].map((value) => ({
        label: value,
        value,
      })),
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'readingTime',
      type: 'text',
      defaultValue: '6 min read',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      admin: {
        description: '支持 Markdown、图片、YouTube、Bilibili，以及 [video] 视频块，前台会按博客长文样式展示。',
      },
    },
    {
      name: 'seoDescription',
      type: 'textarea',
    },
  ],
}
