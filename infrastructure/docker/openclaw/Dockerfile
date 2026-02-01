# OpenClaw 运行在 Ubuntu 容器内，与宿主机隔离
# 参考：https://github.com/openclaw/openclaw
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# 系统依赖 + Node.js 22 LTS（NodeSource）
RUN apt-get update && apt-get install -y \
    curl \
    git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# 安装 Bun（OpenClaw 构建脚本需要）
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

RUN corepack enable && corepack prepare pnpm@latest --activate

# 创建非 root 用户（与挂载目录一致，减少权限）
RUN groupadd --gid 1000 node \
    && useradd --uid 1000 --gid node --shell /bin/bash --create-home node

# 克隆 OpenClaw 源码并构建
WORKDIR /app
RUN git clone --depth 1 https://github.com/openclaw/openclaw.git . \
    && pnpm install --frozen-lockfile \
    && OPENCLAW_A2UI_SKIP_MISSING=1 pnpm build \
    && OPENCLAW_PREFER_PNPM=1 pnpm ui:build

ENV NODE_ENV=production

RUN chown -R node:node /app
USER node

CMD ["node", "dist/index.js"]
