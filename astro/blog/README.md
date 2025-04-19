# 使用 Astro 搭建博客的步骤

Astro 是一个现代化的静态站点生成器，特别适合搭建博客、文档和内容型网站。下面是使用 Astro 搭建博客的详细步骤：

## 1. 环境准备

确保你已经安装了 Node.js (推荐 v16.12.0 或更高版本)。

## 2. 创建 Astro 项目

在当前目录创建一个新的 Astro 项目：

```bash
npm create astro@latest .
```

在交互式提示中，你可以：
- 选择一个博客模板（如 `blog` 或 `minimal`）
- 选择是否使用 TypeScript
- 选择安装依赖项

## 3. 项目结构

创建完成后，你会得到类似这样的项目结构：

```
├── public/          # 静态资源目录
├── src/
│   ├── components/  # UI 组件
│   ├── layouts/     # 页面布局
│   ├── pages/       # 页面文件
│   └── styles/      # 样式文件
├── astro.config.mjs # Astro 配置
└── package.json     # 项目依赖
```

## 4. 开发服务器

启动开发服务器：

```bash
npm run dev
```

## 5. 创建博客内容

### 创建博客布局

首先，创建一个博客文章的布局：

```astro:c:\workspace\projects\demo\src\layouts\BlogPost.astro
---
// 导入需要的组件
import BaseLayout from './BaseLayout.astro';

// 定义接口
interface Props {
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  heroImage?: string;
}

const { title, description, pubDate, updatedDate, heroImage } = Astro.props;
---

<BaseLayout title={title} description={description}>
  <article>
    {heroImage && <img width="720" height="360" src={heroImage} alt="" />}
    <h1 class="title">{title}</h1>
    <time datetime={pubDate.toISOString()}>
      {pubDate.toLocaleDateString('zh-cn', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </time>
    {
      updatedDate && (
        <div>
          最后更新于 
          <time datetime={updatedDate.toISOString()}>
            {updatedDate.toLocaleDateString('zh-cn', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      )
    }
    <slot />
  </article>
</BaseLayout>

<style>
  .title {
    font-size: 2em;
    margin: 0.25em 0 0;
  }
</style>
```

### 创建基础布局

```astro:c:\workspace\projects\demo\src\layouts\BaseLayout.astro
---
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---

<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="generator" content={Astro.generator} />
    <meta name="description" content={description} />
    <title>{title}</title>
  </head>
  <body>
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

### 创建头部组件

```astro:c:\workspace\projects\demo\src\components\Header.astro
---
---

<header>
  <nav>
    <div class="logo">
      <a href="/">我的博客</a>
    </div>
    <div class="nav-links">
      <a href="/">首页</a>
      <a href="/blog">博客</a>
      <a href="/about">关于</a>
    </div>
  </nav>
</header>

<style>
  header {
    padding: 1rem;
    background-color: #f8f9fa;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .logo a {
    font-size: 1.5rem;
    font-weight: bold;
    text-decoration: none;
    color: #333;
  }
  
  .nav-links {
    display: flex;
    gap: 1.5rem;
  }
  
  .nav-links a {
    text-decoration: none;
    color: #555;
    transition: color 0.3s;
  }
  
  .nav-links a:hover {
    color: #000;
  }
</style>
```

### 创建页脚组件

```astro:c:\workspace\projects\demo\src\components\Footer.astro
---
const today = new Date();
---

<footer>
  <div>
    &copy; {today.getFullYear()} 我的博客. 保留所有权利.
  </div>
</footer>

<style>
  footer {
    padding: 2rem 1rem;
    background-color: #f8f9fa;
    text-align: center;
    margin-top: 2rem;
  }
</style>
```

### 创建全局样式

```css:c:\workspace\projects\demo\src\styles\global.css
:root {
  --font-size-base: 1rem;
  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  --color-text: #444;
  --color-bg: #fff;
  --color-primary: #4c6ef5;
}

html {
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  color: var(--color-text);
  background-color: var(--color-bg);
}

body {
  margin: 0;
  padding: 0;
  line-height: 1.6;
}

main {
  max-width: 65ch;
  margin: 0 auto;
  padding: 1rem;
}

h1, h2, h3, h4, h5, h6 {
  margin: 1.5em 0 0.5em;
  line-height: 1.2;
}

a {
  color: var(--color-primary);
}

img {
  max-width: 100%;
  height: auto;
}
```

### 创建博客首页

```astro:c:\workspace\projects\demo\src\pages\index.astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

const posts = (await getCollection('blog')).sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);

const recentPosts = posts.slice(0, 3);
---

<BaseLayout title="我的博客" description="欢迎来到我的个人博客">
  <section class="hero">
    <h1>欢迎来到我的博客</h1>
    <p>这里是我分享想法、经验和知识的地方</p>
  </section>
  
  <section>
    <h2>最新文章</h2>
    <ul class="post-list">
      {
        recentPosts.map((post) => (
          <li>
            <a href={`/blog/${post.slug}/`}>
              <h3>{post.data.title}</h3>
              <p>{post.data.description}</p>
              <time datetime={post.data.pubDate.toISOString()}>
                {post.data.pubDate.toLocaleDateString('zh-cn', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </a>
          </li>
        ))
      }
    </ul>
    <div class="all-posts-link">
      <a href="/blog">查看所有文章 &rarr;</a>
    </div>
  </section>
</BaseLayout>

<style>
  .hero {
    text-align: center;
    padding: 2rem 0;
    margin-bottom: 2rem;
  }
  
  .hero h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  
  .post-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .post-list li {
    margin-bottom: 2rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 1rem;
  }
  
  .post-list a {
    text-decoration: none;
    color: inherit;
    display: block;
  }
  
  .post-list h3 {
    margin-top: 0;
    color: var(--color-primary);
  }
  
  .all-posts-link {
    margin-top: 2rem;
    text-align: right;
  }
</style>
```

### 创建博客列表页

```astro:c:\workspace\projects\demo\src\pages\blog\index.astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

const posts = (await getCollection('blog')).sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
---

<BaseLayout title="博客文章" description="所有博客文章列表">
  <h1>博客文章</h1>
  <ul class="post-list">
    {
      posts.map((post) => (
        <li>
          <a href={`/blog/${post.slug}/`}>
            <div class="post-item">
              {post.data.heroImage && (
                <img 
                  width="240" 
                  height="135" 
                  src={post.data.heroImage} 
                  alt="" 
                  class="post-image"
                />
              )}
              <div class="post-content">
                <h2>{post.data.title}</h2>
                <p>{post.data.description}</p>
                <time datetime={post.data.pubDate.toISOString()}>
                  {post.data.pubDate.toLocaleDateString('zh-cn', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
            </div>
          </a>
        </li>
      ))
    }
  </ul>
</BaseLayout>

<style>
  .post-list {
    list-style: none;
    padding: 0;
  }
  
  .post-list li {
    margin-bottom: 2rem;
  }
  
  .post-list a {
    text-decoration: none;
    color: inherit;
  }
  
  .post-item {
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;
    border-bottom: 1px solid #eee;
    padding-bottom: 1.5rem;
  }
  
  .post-image {
    object-fit: cover;
    border-radius: 4px;
  }
  
  .post-content h2 {
    margin-top: 0;
    color: var(--color-primary);
  }
  
  @media (max-width: 768px) {
    .post-item {
      flex-direction: column;
    }
    
    .post-image {
      width: 100%;
      height: auto;
      margin-bottom: 1rem;
    }
  }
</style>
```

## 6. 设置内容集合

创建内容集合配置文件：

```typescript:c:\workspace\projects\demo\src\content\config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
```

## 7. 创建示例博客文章

```markdown:c:\workspace\projects\demo\src\content\blog\first-post.md
---
title: '我的第一篇博客文章'
description: '这是我使用Astro创建的第一篇博客文章'
pubDate: '2023-07-15'
heroImage: '/blog-placeholder-1.jpg'
tags: ['astro', '博客']
---

# 欢迎来到我的博客

这是我使用Astro创建的第一篇博客文章。Astro是一个很棒的静态站点生成器，它允许我使用我喜欢的任何前端框架。

## 为什么选择Astro？

- **性能优先**：Astro生成的网站默认不包含JavaScript，除非你明确需要它
- **组件岛屿**：只在需要交互的地方加载JavaScript
- **框架灵活**：可以使用React、Vue、Svelte等多种框架
- **内容为中心**：专为内容丰富的网站设计

## 代码示例

```js
// 这是一个简单的JavaScript函数
function greet(name) {
  return `你好，${name}！`;
}

console.log(greet('访客'));
```

希望你喜欢这个博客！
```

## 8. 创建动态路由处理博客文章

```astro:c:\workspace\projects\demo\src\pages\blog\[...slug].astro
---
import { getCollection } from 'astro:content';
import BlogPost from '../../layouts/BlogPost.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: post,
  }));
}

const post = Astro.props;
const { Content } = await post.render();
---

<BlogPost {...post.data}>
  <Content />
</BlogPost>
```

## 9. 添加关于页面

```astro:c:\workspace\projects\demo\src\pages\about.astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="关于我" description="了解更多关于我和这个博客的信息">
  <h1>关于我</h1>
  
  <p>
    欢迎来到我的博客！我是[你的名字]，这个博客是我分享想法、经验和知识的地方。
  </p>
  
  <h2>我的背景</h2>
  <p>
    在这里介绍一下你的背景、专业领域或兴趣爱好。这有助于读者了解你是谁，以及为什么他们应该关注你的内容。
  </p>
  
  <h2>这个博客</h2>
  <p>
    这个博客使用Astro构建，主要关注[你的博客主题]。我计划定期发布关于[主题1]、[主题2]和[主题3]的文章。
  </p>
  
  <h2>联系我</h2>
  <p>
    如果你有任何问题或想法，欢迎通过以下方式联系我：
  </p>
  <ul>
    <li>邮箱：<a href="mailto:your.email@example.com">your.email@example.com</a></li>
    <li>GitHub：<a href="https://github.com/yourusername" target="_blank">@yourusername</a></li>
    <li>Twitter：<a href="https://twitter.com/yourusername" target="_blank">@yourusername</a></li>
  </ul>
</BaseLayout>
```

## 10. 构建和部署

构建你的网站：

```bash
npm run build
```

构建完成后，你可以将 `dist` 目录部署到任何静态网站托管服务，如：
- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages

## 11. 进阶功能（可选）

### 添加标签功能

```astro:c:\workspace\projects\demo\src\pages\tags\index.astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

const posts = await getCollection('blog');
const tags = [...new Set(posts.flatMap((post) => post.data.tags || []))];
---

<BaseLayout title="标签" description="所有博客文章标签">
  <h1>标签</h1>
  <div class="tags">
    {tags.map((tag) => (
      <a href={`/tags/${tag}`} class="tag">
        {tag}
      </a>
    ))}
  </div>
</BaseLayout>

<style>
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 2rem 0;
  }
  
  .tag {
    display: inline-block;
    padding: 0.5rem 1rem;
    background-color: #f0f0f0;
    border-radius: 4px;
    text-decoration: none;
    color: var(--color-text);
    transition: background-color 0.2s;
  }
  
  .tag:hover {
    background-color: #e0e0e0;
  }
</style>
```

```astro:c:\workspace\projects\demo\src\pages\tags\[tag].astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  const uniqueTags = [...new Set(posts.flatMap((post) => post.data.tags || []))];

  return uniqueTags.map((tag) => {
    const filteredPosts = posts.filter((post) => 
      post.data.tags?.includes(tag)
    );
    return {
      params: { tag },
      props: { posts: filteredPosts },
    };
  });
}

const { tag } = Astro.params;
const { posts } = Astro.props;
---

<BaseLayout title={`标签: ${tag}`} description={`所有带有 ${tag} 标签的文章`}>
  <h1>标签: {tag}</h1>
  <ul class="post-list">
    {posts.map((post) => (
      <li>
        <a href={`/blog/${post.slug}/`}>
          <h2>{post.data.title}</h2>
          <p>{post.data.description}</p>
        </a>
      </li>
    ))}
  </ul>
</BaseLayout>

<style>
  .post-list {
    list-style: none;
    padding: 0;
  }
  
  .post-list li {
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 1rem;
  }
  
  .post-list a {
    text-decoration: none;
    color: inherit;
  }
  
  .post-list h2 {
    color: var(--color-primary);
    margin-bottom: 0.5rem;
  }
</style>
```

### 添加搜索功能

你可以使用 Pagefind 添加静态搜索功能：

```bash
npm install pagefind
```

在 `astro.config.mjs` 中添加配置：

```javascript:c:\workspace\projects\demo\astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://your-domain.com',
  integrations: [],
  build: {
    format: 'directory'
  },
  vite: {
    plugins: [],
  },
});
```

然后在构建后运行：

```bash
npx pagefind --site dist
```

## 总结

通过以上步骤，你已经成功搭建了一个基于 Astro 的博客网站，包含了：

1. 首页展示最新文章
2. 博客文章列表页
3. 单篇博客文章页面
4. 关于页面
5. 标签功能（可选）
6. 搜索功能（可选）

你可以根据自己的需求进一步定制样式、添加更多功能，如评论系统、分析工具等。Astro 的生态系统非常丰富，可以通过集成各种插件来扩展功能。