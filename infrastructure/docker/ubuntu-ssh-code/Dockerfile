# 基础镜像
FROM ubuntu:22.04

# 设置环境变量避免交互
ENV DEBIAN_FRONTEND=noninteractive

# 系统依赖：SSH、Git、CA 证书等
RUN apt-get update && apt-get install -y \
    openssh-server \
    sudo \
    vim \
    curl \
    git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# 安装 Node.js 20 LTS（NodeSource）
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# 启用 pnpm（Corepack）
RUN corepack enable && corepack prepare pnpm@latest --activate

# 创建 SSH 目录
RUN mkdir /var/run/sshd

# 设置 root 密码
RUN echo 'root:root123' | chpasswd

# 允许 root 登录
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config

# 防止 SSH 自动退出
RUN echo "PermitUserEnvironment yes" >> /etc/ssh/sshd_config

# 容器启动时运行 SSH 服务
CMD ["/usr/sbin/sshd","-D"]
