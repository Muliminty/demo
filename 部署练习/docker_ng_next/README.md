# Next.js + Docker + Nginx 部署项目

这是一个使用 Docker Compose 和 Nginx 部署 Next.js 应用的完整示例项目。

## 项目介绍

### 技术栈

- **Next.js 16+**：React 框架，使用 App Router
- **Docker**：容器化部署
- **Nginx**：反向代理服务器
- **TypeScript**：类型安全
- **Tailwind CSS**：样式框架

### 部署架构

```
用户请求 → Nginx (4041端口) → Next.js (3000端口，内部) → 响应
```

- **Nginx**：作为反向代理，对外暴露 4041 端口
- **Next.js**：运行在容器内部 3000 端口，不直接对外暴露
- **网络通信**：通过 Docker Compose 自定义网络，服务间通过服务名通信

## 项目结构

```
docker_ng_next/
├── app/                    # Next.js App Router 应用代码
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── globals.css        # 全局样式
├── public/                # 静态资源目录
├── doc/                   # 部署文档目录
│   ├── README.md         # 文档索引
│   ├── 部署指南.md        # 完整部署步骤
│   ├── 重新部署.md        # 重新部署指南
│   ├── 配置文件说明.md    # 配置文件详解
│   ├── 常用命令.md        # 命令参考
│   ├── 故障排查.md        # 问题排查
│   └── 注意事项.md        # 注意事项
├── nginx/                 # Nginx 配置目录
│   ├── nginx.conf         # Nginx 站点配置
│   └── logs/              # Nginx 日志目录（git 忽略）
├── docker-compose.yml     # Docker Compose 配置
├── Dockerfile             # Next.js 应用 Docker 构建文件
├── next.config.ts         # Next.js 配置（standalone 模式）
├── package.json           # 项目依赖
└── tsconfig.json          # TypeScript 配置
```

## 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### Docker 部署

```bash
# 构建并启动服务
docker compose up -d --build

# 查看容器状态
docker compose ps

# 查看日志
docker compose logs -f nextjs
docker compose logs -f nginx
```

访问：`http://localhost:4041`

## 部署文档

所有部署相关的详细文档已整理到 [`doc/`](./doc/) 文件夹：

- **[部署指南](./doc/部署指南.md)** - 完整的首次部署步骤，从项目创建到部署启动
- **[重新部署](./doc/重新部署.md)** - 修改代码后如何重新部署的指南
- **[配置文件说明](./doc/配置文件说明.md)** - 各个配置文件的详细说明
- **[常用命令](./doc/常用命令.md)** - 日常开发和运维常用命令参考
- **[故障排查](./doc/故障排查.md)** - 常见问题和解决方案
- **[注意事项](./doc/注意事项.md)** - 部署时需要注意的重要事项

## 常用命令

```bash
# 重新部署（修改代码后）
docker compose up -d --build

# 查看容器状态
docker compose ps

# 查看日志
docker compose logs -f nextjs
docker compose logs -f nginx

# 停止服务
docker compose down
```

更多命令请查看 [常用命令文档](./doc/常用命令.md)。

## 特性

- ✅ **Standalone 模式**：使用 Next.js standalone 输出，大幅减小镜像体积
- ✅ **多阶段构建**：优化 Docker 镜像大小和构建速度
- ✅ **Nginx 反向代理**：不直接暴露 Next.js 端口，提高安全性
- ✅ **服务间通信**：使用 Docker Compose 自定义网络
- ✅ **配置热更新**：修改 Nginx 配置无需重新构建镜像

## 访问地址

- **开发环境**：`http://localhost:3000`（本地开发）
- **生产环境**：`http://localhost:4041`（Docker 部署）

## 相关链接

- [Next.js 文档](https://nextjs.org/docs)
- [Docker 文档](https://docs.docker.com/)
- [Nginx 文档](https://nginx.org/en/docs/)

## License

MIT
