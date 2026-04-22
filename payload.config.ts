import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Docs } from './src/collections/Docs'
import { Media } from './src/collections/Media'
import { Posts } from './src/collections/Posts'
import { Users } from './src/collections/Users'
import { SiteSettings } from './src/globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' | BaiLongma Studio',
      description: '白龙马品牌官网、博客、文档与内容后台',
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: '/brand/logo.png',
        },
      ],
    },
  },
  collections: [Users, Media, Posts, Docs],
  globals: [SiteSettings],
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./data/baillongma.db',
    },
    wal: true,
  }),
  secret: process.env.PAYLOAD_SECRET || 'baillongma-dev-secret',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
})
