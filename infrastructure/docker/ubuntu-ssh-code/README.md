# 前端开箱即用 Docker Ubuntu 开发环境

本镜像是带 **Node.js 20 LTS**、**Git**、**pnpm** 的前端开发环境，支持 SSH 与 VSCode Remote-SSH，可在容器内直接跑 `npm install` / `pnpm install` 和 dev 服务器（Vite、Webpack、Next 等）。

更完整的 SSH 与 VSCode 连接说明可参考同目录下的 [../ubuntu-ssh/README.md](../ubuntu-ssh/README.md)。

---

## 一、前提条件

* 已安装 Docker（Mac / Win / Linux）
* 已安装 VSCode + Remote-SSH 插件
* 有一定终端与前端开发基础

---

## 二、构建与运行

### 方式一：使用 docker-compose（推荐）

在 **本目录**（`infrastructure/docker/ubuntu-ssh-code/`）下执行：

```bash
docker compose up -d
```

* 首次会先根据 Dockerfile 构建镜像 `ubuntu-ssh-code`，再启动容器。
* 若已构建过，可直接 `docker compose up -d` 启动。
* 容器名：`ubuntu-ssh-code`。

### 方式二：仅使用 Docker

```bash
docker build -t ubuntu-ssh-code .
docker run -d --name ubuntu-ssh-code \
  -p 2222:22 -p 5173:5173 -p 3000:3000 \
  -v "$(pwd)/../..:/workspace" \
  ubuntu-ssh-code
```

* `-p 2222:22`：SSH 端口
* `-p 5173:5173`、`-p 3000:3000`：Vite / Webpack 等 dev 端口
* `-v ...:/workspace`：将项目根目录挂载到容器内 `/workspace`（可按需改为其他路径）

---

## 三、SSH / VSCode 配置

1. 打开 VSCode → Command Palette → `Remote-SSH: Open SSH Configuration File…`，选择配置文件（通常是 `~/.ssh/config`）。

2. 添加：

```text
Host ubuntu-ssh-code
    HostName 127.0.0.1
    User root
    Port 2222
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
```

3. Command Palette → `Remote-SSH: Connect to Host…` → 选择 `ubuntu-ssh-code`，输入 root 密码：**root123**。

4. 连接成功后即可在容器内用 VSCode 开发。

> 提示：`root123` 为默认密码，可在 Dockerfile 中按需修改。

---

## 四、前端使用说明

### 挂载目录

使用本仓库提供的 docker-compose 时，**项目根目录**会挂载到容器内的 **`/workspace`**。在容器内进入该目录即可编辑代码并安装依赖、启动 dev 服务器。

### 安装依赖与启动 dev

在容器内（或 VSCode 连接后的终端）执行，例如：

```bash
cd /workspace/build-tools/vite/nginx-docker
pnpm install
pnpm run dev
```

或使用 npm：

```bash
cd /workspace/build-tools/webpack/create-react
npm install
npm run start
```

### 端口说明

| 端口  | 用途说明                    |
|-------|-----------------------------|
| 2222  | SSH（VSCode Remote-SSH）    |
| 5173  | Vite 默认 dev 端口          |
| 3000  | Webpack dev server / Next 等 |

在宿主机浏览器访问：

* Vite 项目：`http://localhost:5173`
* Webpack / Next 等：`http://localhost:3000`

---

## 五、常见问题

| 问题 | 解决方法 |
|------|----------|
| VSCode 提示 `Could not establish connection` | 确认容器在运行（`docker ps`），端口 2222 已映射 |
| 登录失败 | 确认 root 密码为 `root123`，SSH 配置中 Port 为 2222 |
| 第一次连接报 `host key verification failed` | 确认 SSH config 中已设置 `StrictHostKeyChecking no` 和 `UserKnownHostsFile /dev/null` |
| 宿主机访问不到 dev 页面 | 确认 dev 命令在容器内已启动，且 docker-compose/run 已映射 5173、3000 |
| 端口被占用 | 修改 docker-compose.yml 或 `docker run -p` 的宿主机端口（如 `3222:22`） |

---

## 六、可选

* **非 root 用户**：可与 [../ubuntu-ssh/README.md](../ubuntu-ssh/README.md) 中一样，在 Dockerfile 中增加 devuser，SSH 配置改为 `User devuser`。
* **Node 版本**：当前为 Node 20 LTS；若需 Node 22，将 Dockerfile 中 NodeSource 的 `setup_20.x` 改为 `setup_22.x` 即可。
