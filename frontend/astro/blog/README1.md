# Astro 博客入门套件

```sh
npm create astro@latest -- --template blog
```

[![在 StackBlitz 中打开](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/blog)
[![在 CodeSandbox 中打开](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/blog)
[![在 GitHub Codespaces 中打开](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/blog/devcontainer.json)

> 🧑‍🚀 **已经是经验丰富的宇航员了？** 删除这个文件吧。开始创作！

![博客](https://github.com/withastro/astro/assets/2244813/ff10799f-a816-4703-b967-c78997e8323d)

特性：

- ✅ 极简风格（可以按照自己的喜好定制！）
- ✅ 100/100 Lighthouse 性能评分
- ✅ SEO 友好，支持规范链接和 OpenGraph 数据
- ✅ 支持站点地图
- ✅ 支持 RSS 订阅
- ✅ 支持 Markdown 和 MDX

## 🚀 项目结构

在你的 Astro 项目中，你会看到以下文件夹和文件：

```text
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro 会在 `src/pages/` 目录中查找 `.astro` 或 `.md` 文件。每个页面都会根据其文件名暴露为一个路由。

`src/components/` 目录没有什么特别之处，但这是我们喜欢存放 Astro/React/Vue/Svelte/Preact 组件的地方。

`src/content/` 目录包含了相关的 Markdown 和 MDX 文档的"集合"。使用 `getCollection()` 从 `src/content/blog/` 中获取文章，并使用可选的模式来类型检查你的 frontmatter。查看 [Astro 的内容集合文档](https://docs.astro.build/en/guides/content-collections/) 了解更多。

任何静态资源，如图片，都可以放在 `public/` 目录中。

## 🧞 命令

所有命令都从项目根目录的终端中运行：

| 命令                     | 操作                                           |
| :----------------------- | :--------------------------------------------- |
| `npm install`            | 安装依赖                                      |
| `npm run dev`            | 在 `localhost:4321` 启动本地开发服务器        |
| `npm run build`          | 将你的网站构建到 `./dist/`                    |
| `npm run preview`        | 在部署之前本地预览你的构建                    |
| `npm run astro ...`      | 运行 CLI 命令，如 `astro add`、`astro check`   |
| `npm run astro -- --help`| 获取 Astro CLI 的帮助                         |

## 👀 想了解更多？

查看 [我们的文档](https://docs.astro.build) 或加入我们的 [Discord 服务器](https://astro.build/chat)。

## 致谢

这个主题基于优秀的 [Bear Blog](https://github.com/HermanMartinus/bearblog/) 开发。
