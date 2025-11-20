# Demo 技术栈项目总览

> 本仓库收录了多种前端及全栈技术的实战示例，旨在帮助开发者快速了解和上手不同技术栈的核心用法。每个子项目均配有详细说明文档，欢迎查阅和实践。

## 📋 目录

- [项目简介](#项目简介)
- [技术栈分类](#技术栈分类)
  - [前端框架](#前端框架)
  - [构建工具](#构建工具)
  - [后端框架](#后端框架)
  - [桌面应用](#桌面应用)
  - [工程化工具](#工程化工具)
  - [Web 服务器](#web-服务器)
  - [原生 HTML/JS 示例](#原生-htmljs-示例)
  - [游戏项目](#游戏项目)
- [快速开始](#快速开始)
- [项目统计](#项目统计)
- [贡献指南](#贡献指南)

---

## 项目简介

这是一个综合性的技术演示仓库，涵盖了从基础到进阶的多种前端和全栈技术栈。每个项目都是独立可运行的示例，包含完整的代码和文档说明，适合：

- 🎓 **学习新技术**：快速上手各种主流技术栈
- 🔍 **技术选型参考**：了解不同技术栈的适用场景
- 💡 **最佳实践**：学习工程化和开发规范
- 🚀 **项目模板**：作为新项目的起始模板

---

## 技术栈分类

### 前端框架

#### 1. [Astro 博客](./astro/blog/README.md)
使用 Astro 框架搭建的现代化静态博客网站，适合内容型网站快速开发。

**技术栈**：Astro、TypeScript、Tailwind CSS

#### 2. [Svelte 待办事项清单](./Svelte/svelte-todolist/README.md)
基于 Svelte 框架的待办事项应用，适合新手学习 Svelte 组件化与状态管理。

**技术栈**：Svelte、JavaScript

#### 3. [Umi 框架 Demo](./umi/umi-demo/)
基于 Umi 的前端项目示例，展示路由配置与工程化实践。

**技术栈**：Umi、React、TypeScript

#### 4. [Vue3 + Vite 学习项目](./vite/vue3-learn/README.md)
Vue3 结合 Vite 的开发实践，包含组件、路由、状态管理等核心功能。

**技术栈**：Vue3、Vite、JavaScript

---

### 构建工具

#### 5. [Webpack 构建 React 项目](./webpack/webpack_create_react/README.md)
Webpack 5 搭建 React 19 项目指南，涵盖配置、打包与代码分割。

**技术栈**：Webpack 5、React 19、JavaScript

#### 6. [Vite + Nginx + Docker 部署流程](./vite/Vite_Nginx_Docker_deployment/README.md)
完整演示前端项目生产部署，包含 Docker 容器化与 Nginx 反向代理配置。

**技术栈**：Vite、React、Docker、Nginx

---

### 后端框架

#### 7. [NestJS 快速入门](./NestJS/README.md)
基于 TypeScript 的渐进式 Node.js 框架示例，包含 Controller、Service、DTO 等核心概念。

**技术栈**：NestJS、TypeScript、Node.js

#### 8. [AI Chat 流式对话](./ai-chat/README.md)
基于 Node.js 的流式响应聊天应用，演示前后端流式数据处理与实时聊天界面实现。

**技术栈**：Node.js、原生 JavaScript、Fetch API

#### 9. [图片代理服务](./server/)
基于 Express 的图片代理服务，支持跨域图片访问和代理转发。

**技术栈**：Node.js、Express、CORS

---

### 桌面应用

#### 10. [Electron 桌面应用](./Electron/my-electron-app/README.md)
基于 Electron 的跨平台桌面应用开发入门示例，涵盖窗口管理与生命周期。

**技术栈**：Electron、Node.js、HTML/CSS/JS

---

### 工程化工具

#### 11. [工程化脚手架 my-cli](./engineering/my-cli/README.md)
前端脚手架工具开发流程详解，包含脚手架原理、开发流程与常用工具。

**技术栈**：Node.js、CLI 工具

---

### Web 服务器

#### 12. [Nginx 配置与使用](./nginx-1.26.3/README.md)
Nginx 配置文件、常用场景、日志管理等详细文档，适合 Web 服务部署参考。

**技术栈**：Nginx、反向代理、负载均衡

---

### 原生 HTML/JS 示例

#### 13. [原生 HTML 组件化](./single-file/HTML%20组件化/README.md)
原生 JavaScript 实现的 HTML 组件化开发方案，包含 `<object>` 与 `fetch` 动态加载两种方式，以及组件通信机制。

**技术栈**：原生 HTML、JavaScript、postMessage API

#### 14. [H5 功能示例](./single-file/)
包含多个实用的 H5 功能演示：
- **H5 离开页面检测**：页面离开前的提示与拦截
- **IntersectionObserver**：元素可见性检测 API 使用示例
- **mini-react**：React 核心原理简化实现
- **snapDOM 抽签图保存**：DOM 转图片功能演示
- **长按保存图片**：移动端长按保存图片功能

**技术栈**：原生 HTML、JavaScript、Web API

---

### 动画与交互

#### 15. [GSAP 动画 Demo](./gsap/gsap_demo/README.md)
基于 GSAP 的动画效果演示，适合学习现代网页动画开发。

**技术栈**：GSAP、React、Vite

---

### 游戏项目

#### 16. [营销游戏集合](./game/)
包含多个营销类小游戏：
- **老虎机**：经典老虎机游戏实现
- **大转盘**：抽奖转盘游戏
- **摇摇乐**：摇一摇互动游戏
- **宝可梦主题 2048**：经典 2048 游戏的宝可梦主题版本

**技术栈**：HTML5、CSS3、JavaScript

---

## 快速开始

### 环境要求

- **Node.js**：>= 14.0.0（推荐使用 LTS 版本）
- **包管理工具**：npm / yarn / pnpm（推荐使用 pnpm）
- **现代浏览器**：支持 ES6+ 和现代 Web API

### 使用步骤

1. **克隆仓库**
   ```bash
   git clone <repository-url>
   cd demo
   ```

2. **选择项目**
   进入对应的子项目目录，查看该项目的 README.md 了解具体使用方法。

3. **安装依赖**
   ```bash
   cd <project-name>
   npm install
   # 或
   pnpm install
   ```

4. **启动项目**
   根据项目 README 中的说明启动项目，通常为：
   ```bash
   npm run dev
   # 或
   npm start
   ```

### 项目结构

```
demo/
├── ai-chat/              # AI 聊天流式响应
├── astro/                # Astro 博客框架
├── Electron/             # Electron 桌面应用
├── engineering/          # 工程化工具
├── game/                 # 游戏项目集合
├── gsap/                 # GSAP 动画演示
├── NestJS/               # NestJS 后端框架
├── nginx-1.26.3/         # Nginx 配置示例
├── server/               # 图片代理服务
├── single-file/          # 原生 HTML/JS 示例
├── Svelte/               # Svelte 框架示例
├── umi/                  # Umi 框架示例
├── vite/                 # Vite 相关项目
└── webpack/              # Webpack 构建示例
```

---

## 项目统计

- **总项目数**：16+ 个独立项目
- **技术栈覆盖**：
  - 前端框架：React、Vue3、Svelte、Astro
  - 构建工具：Webpack、Vite
  - 后端框架：NestJS、Express
  - 桌面应用：Electron
  - 服务器：Nginx
  - 原生技术：HTML5、CSS3、JavaScript

---

## 贡献指南

欢迎提交 Issue 和 Pull Request 来完善这个项目集合！

### 贡献方式

1. **发现问题**：提交 Issue 描述问题或建议
2. **改进文档**：完善项目 README 或代码注释
3. **新增示例**：添加新的技术栈示例项目
4. **修复 Bug**：修复现有项目中的问题

### 提交规范

- 使用清晰的提交信息
- 确保代码可以正常运行
- 更新相关的 README 文档

---

## 许可证

本项目采用 MIT 许可证，详见各子项目的 LICENSE 文件。

---

## 相关链接

- [GitHub Repository](https://github.com/Muliminty/demo)
- 各子项目详细文档请查看对应目录下的 README.md

---

**最后更新**：2025

**维护者**：Muliminty
