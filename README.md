# BaiLongma Blog

一个以 `Payload CMS + Next.js` 为核心的白龙马品牌站项目，包含：

- 品牌官网首页
- 博客系统
- 说明文档中心
- `/admin` 后台管理
- 面向 Linux 服务器的部署方案

## 为什么选 Payload

这次我没有继续把官网做成单个 `website.html`，而是升级为一套更适合长期运营的内容平台。

选择 Payload CMS 的原因：

- 它是开源的，可自部署
- 自带现代化后台
- 能和 Next.js 前台放在同一套项目里
- 很适合博客、文档、品牌站一体化
- 部署到 Linux 服务器比较直接

## 项目结构

```text
baillongma-blog/
├─ public/brand/logo.png
├─ payload.config.ts
├─ src/
│  ├─ app/
│  │  ├─ (frontend)/        # 官网、博客、文档
│  │  ├─ (payload)/         # Payload 官方推荐的后台与 API 路由
│  │  └─ api/seed/route.ts  # 示例内容初始化
│  ├─ collections/          # 博客、文档、用户
│  ├─ globals/              # 站点全局配置
│  └─ lib/                  # 内容读取与格式化
```

## 本地运行

### 1. 准备环境

- Node.js `20.9.0+`
- npm / pnpm / yarn

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
cp .env.example .env
```

Windows 下可以手动复制一份 `.env.example` 为 `.env`。

至少确认这些值：

```env
PAYLOAD_SECRET=一个足够长的随机字符串
DATABASE_URL=file:./data/baillongma.db
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SEED_TOKEN=baillongma-seed
```

### 4. 启动开发环境

```bash
npm run dev
```

然后打开：

- 前台首页: `http://localhost:3000`
- 后台管理: `http://localhost:3000/admin`

第一次进入后台时，Payload 会引导你创建第一个管理员账号。

如果本地使用的是全新数据库，且访问 `/admin` 时提示缺少表，可以先执行：

```bash
npm run migrate
```

再重新打开后台创建第一个管理员。

### 5. 可选：写入示例内容

创建好 `.env` 后，可以访问：

```text
http://localhost:3000/api/seed?token=你的 SEED_TOKEN
```

它会自动创建：

- 2 篇博客示例
- 2 篇文档示例
- 一份站点首页默认文案

## 可在后台管理的内容

### `Posts`

用于博客系统：

- 标题
- 分类
- 摘要
- 阅读时长
- 发布时间
- 正文
- 是否精选
- 草稿 / 发布状态

### `Docs`

用于说明文档：

- 标题
- 分组
- 排序
- 摘要
- 正文
- 关键词
- 草稿 / 发布状态

### `Site Settings`

用于首页主视觉文案：

- 顶部标语
- Hero 标题
- Hero 描述
- 主按钮文案与链接
- 次按钮文案与链接

## Linux 部署

### 方案一：直接用 Node.js 部署

适合单机 Linux 服务器：

```bash
cp .env.example .env
mkdir -p data
npm install
npm run build
npm run migrate
npm run start
```

建议配合：

- `Nginx` 反向代理到 `3000`
- `PM2` 托管进程
- `systemd` 做开机自启

示例 PM2：

```bash
pm2 start npm --name baillongma-blog -- run start
pm2 save
```

如果是第一次部署，务必先跑一次数据库迁移，再启动 PM2。否则会出现 SQLite 文件存在但 `users`、`posts`、`docs` 等表尚未创建，进而导致 `/admin` 或 SSR 页面报错。

### 方案二：Docker 部署

项目已包含 `Dockerfile`：

```bash
docker build -t baillongma-blog .
docker run -d -p 3000:3000 --env-file .env baillongma-blog
```

如果你要长期运行，建议把 SQLite 数据文件挂载到宿主机持久化目录。

## 下一步建议

这版已经把结构搭起来了，下一轮很适合继续做：

1. 把首页更多区块也改为后台可编排
2. 给博客增加封面图和标签系统
3. 给文档增加侧边栏树形导航与搜索
4. 把 SQLite 升级到 Postgres，做正式生产部署
5. 定制后台登录页和 Dashboard，让它更像“白龙马品牌控制台”

## 参考

这次项目结构参考了 Payload 官方关于 Next.js 集成、`(payload)` 路由结构和 SQLite 适配器的文档与模板。
