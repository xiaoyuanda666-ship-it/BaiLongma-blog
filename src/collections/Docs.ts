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
