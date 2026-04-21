import config from '@payload-config'
import { getPayload } from 'payload'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!process.env.SEED_TOKEN || token !== process.env.SEED_TOKEN) {
    return Response.json({ error: 'invalid token' }, { status: 401 })
  }

  const payload = await getPayload({ config })

  const posts = await payload.find({
    collection: 'posts',
    limit: 1,
  })

  if (posts.totalDocs > 0) {
    return Response.json({ ok: true, message: 'seed skipped, content already exists' })
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      eyebrow: 'White Dragon Horse · AI Agent Studio',
      heroTitle: '白龙马官网升级为可运营的内容平台',
      heroDescription:
        '前台延续东方高级感，后台用 Payload CMS 统一管理博客、产品文档与品牌主文案，适合持续更新与 Linux 部署。',
      primaryLabel: '查看文档中心',
      primaryHref: '/docs',
      secondaryLabel: '查看博客内容',
      secondaryHref: '/blog',
    },
  })

  await payload.create({
    collection: 'posts',
    data: {
      title: '为什么白龙马官网不该只停留在一张落地页',
      slug: 'why-baillongma-needs-a-content-platform',
      category: '产品思考',
      excerpt: '把官网升级成内容平台，才有机会承接品牌叙事、更新日志、搜索流量和用户教育。',
      featured: true,
      publishedAt: new Date().toISOString(),
      body:
        '一个有品牌感的首页，确实能在第一眼建立印象，但它很难承担长期增长任务。\n\n当你需要持续发布能力更新、解释产品逻辑、沉淀案例、服务搜索引擎时，官网就必须升级成“品牌站 + 博客 + 文档”的组合。\n\n对白龙马来说，这种升级尤其重要，因为产品本身有 AI Agent、工作流、持续运行等复杂概念，需要用更立体的内容系统来解释。',
      readingTime: '5 min read',
      seoDescription: '白龙马官网从展示页升级为博客和文档一体化内容平台的原因。',
      _status: 'published',
    },
  })

  await payload.create({
    collection: 'posts',
    data: {
      title: 'Payload CMS 为什么适合做白龙马的新官网后台',
      slug: 'why-payload-fits-baillongma',
      category: '工程实践',
      excerpt: '它既有漂亮的后台，也能跟 Next.js 前台直接做成一套项目，适合 Linux 自部署。',
      featured: true,
      publishedAt: new Date().toISOString(),
      body:
        'Payload CMS 的优势在于前后台一体。对于白龙马这样的品牌项目，我们不需要拆成多个仓库，也不需要为了后台再维护另一套服务。\n\n编辑可以在后台发布博客和文档，前台则保持你喜欢的品牌风格。后续如果访问量增长，也能再迁移数据库和增强权限体系。',
      readingTime: '4 min read',
      seoDescription: '说明为什么 Payload CMS 适合作为白龙马新官网的后台。',
      _status: 'published',
    },
  })

  await payload.create({
    collection: 'docs',
    data: {
      title: '快速开始',
      slug: 'quick-start',
      section: '快速开始',
      order: 1,
      summary: '本地运行白龙马博客系统的最短路径。',
      body:
        '1. 安装 Node.js 20.9 或更高版本。\n\n2. 在项目根目录复制 `.env.example` 为 `.env`。\n\n3. 执行 `npm install`，然后运行 `npm run dev`。\n\n4. 打开 `/admin` 创建第一个管理员账号。\n\n5. 如需示例内容，访问 `/api/seed?token=你的 SEED_TOKEN`。',
      keywords: [{ keyword: 'nextjs' }, { keyword: 'payload' }, { keyword: 'setup' }],
      _status: 'published',
    },
  })

  await payload.create({
    collection: 'docs',
    data: {
      title: 'Linux 部署',
      slug: 'linux-deploy',
      section: '部署手册',
      order: 2,
      summary: '使用 Node.js 或 Docker 在 Linux 服务器上部署。',
      body:
        '推荐环境为 Ubuntu 22.04 + Node.js 20 LTS。\n\n如果你使用 Node.js 直跑方式，建议通过 Nginx 反向代理到 3000 端口，并使用 PM2 守护进程。\n\n如果你使用 Docker，则可以基于项目里的 Dockerfile 构建镜像，再挂载持久化数据库目录和环境变量。',
      keywords: [{ keyword: 'linux' }, { keyword: 'docker' }, { keyword: 'pm2' }],
      _status: 'published',
    },
  })

  return Response.json({ ok: true, message: 'seed complete' })
}
