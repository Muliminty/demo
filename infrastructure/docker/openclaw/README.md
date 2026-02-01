# OpenClaw 体验环境（Docker）

本配置用于在 **Docker 的 Ubuntu 容器内**运行 [OpenClaw](https://docs.openclaw.ai/)（个人 AI Agent），格式参考同目录 [ubuntu-ssh-code](../ubuntu-ssh-code/README.md)。镜像基于 **Ubuntu 22.04**，从 OpenClaw 官方仓库源码构建；**仅挂载本目录下 `data/`**，并启用容器隔离选项，**避免 OpenClaw 影响宿主机**。

---

## 安全与隔离（不影响宿主机）

- **运行环境**：OpenClaw 运行在 **Ubuntu 22.04 容器**内，不直接接触宿主机系统。
- **挂载范围**：只挂载本目录下的 `./data/config` 和 `./data/workspace`，用于配置与 Agent 工作区。**请勿**将 `OPENCLAW_CONFIG_DIR`、`OPENCLAW_WORKSPACE_DIR` 设为宿主机敏感路径（如 `~`、`/home`、项目根目录等），否则 OpenClaw 可读写宿主机文件。
- **容器加固**：根文件系统只读（`read_only: true`），仅 data 挂载和 tmpfs（`/tmp`、`/run`）可写；已关闭特权与多余能力（`cap_drop: ALL`、`no-new-privileges`），容器内以非 root 用户运行。
- **建议**：仅在本目录内使用默认的 `./data` 挂载，不额外挂载宿主机目录，这样 OpenClaw 无法修改宿主机上的任何文件。

---

## 宿主机能否直接和 Docker 容器里的 OpenClaw 聊天？

**可以。** Gateway 启动后，在宿主机浏览器打开：

- **http://127.0.0.1:18789/**

即 OpenClaw 的 **Control UI**。首次使用需完成 onboarding 并在此页面 **Settings → token** 中粘贴 Gateway Token，之后即可在网页里与容器内的 OpenClaw 对话（发消息、看回复、管理频道/技能等）。无需进入容器内部，宿主机和容器通过该端口通信。

---

## 一、前提条件

- 已安装 Docker 与 Docker Compose v2
- 网络可访问 GitHub（构建时会克隆 openclaw/openclaw 仓库）
- 首次构建会拉取源码并编译，耗时较长，请耐心等待

---

## 二、构建与运行

### 1. 准备环境变量（可选）

```bash
cp .env.example .env
# 按需修改 .env 中的端口等；请勿将 OPENCLAW_CONFIG_DIR、OPENCLAW_WORKSPACE_DIR 设为宿主机敏感路径
```

不复制也可：compose 会使用默认值（`./data/config`、`./data/workspace`、端口 18789/18790）。为保持隔离，**不要**将配置或工作区指向宿主机目录（如 `$HOME`、项目根等）。

### 2. 构建并启动

在本目录（`infrastructure/docker/openclaw/`）下执行：

```bash
docker compose up -d --build
```

- **首次构建**：会从 GitHub 克隆 OpenClaw 源码、执行 `pnpm install` 与 `pnpm build`，可能需 5～15 分钟，视网络与机器而定。构建完成后会生成镜像 `openclaw:local` 并启动 `openclaw-gateway` 容器。
- **后续启动**：若镜像已存在，直接 `docker compose up -d` 即可，几秒内完成。
- 构建/启动成功后，Gateway 在容器内监听 18789（Control UI）和 18790（Bridge），宿主机通过 `127.0.0.1:18789` 访问。

确认容器在运行：

```bash
docker compose ps
# 应看到 openclaw-gateway 状态为 running，端口 0.0.0.0:18789->18789
```

### 3. 首次使用：Onboarding（生成 Token）

首次运行需要完成 onboarding，在宿主机执行：

```bash
docker compose run --rm openclaw-cli onboard
```

- 按提示选择语言、确认配置目录等；向导会生成 **Gateway Token**（一长串字符串）。
- **务必复制并保存该 token**，后续在 Control UI 的 Settings 里粘贴，用于认证。
- 若未保存，可再次执行上述命令重新走一遍 onboarding，或到 `./data/config/` 下查看生成的配置文件（内含 token 相关信息，具体字段见 OpenClaw 文档）。

### 4. 在宿主机与 OpenClaw 聊天

1. 在宿主机浏览器打开 **http://127.0.0.1:18789/**，进入 OpenClaw **Control UI**。
2. 若首次打开会提示未连接或需认证：
   - 点击页面上的 **Settings**（或齿轮图标），找到 **Token** 或 **Gateway Token** 输入框。
   - 将第 3 步得到的 **Gateway Token** 粘贴进去并保存。
3. 连接成功后，主界面会显示聊天区域。在输入框输入文字发送，即可与容器内的 OpenClaw 对话；回复会以流式或卡片形式展示。
4. 若需使用模型（如 Claude、GPT），需在 OpenClaw 中配置对应 API Key，见下文「进阶使用」。

---

## 三、Control UI 使用说明

Control UI 是宿主机与容器内 OpenClaw 交互的主要界面，常用操作如下。

| 功能 | 说明 |
|------|------|
| **发消息** | 在底部输入框输入内容回车发送；支持多行与 Markdown。 |
| **停止回复** | 回复过程中可点击 **Stop** 或输入 `/stop` 中止当前回复。 |
| **Settings** | 设置 Gateway Token、修改 UI 选项；首次使用必须在此粘贴 token 才能连接。 |
| **会话 / Sessions** | 查看与管理当前会话；可切换会话或查看历史。 |
| **频道 / Channels** | 查看 WhatsApp、Telegram、Discord 等频道状态；需在 CLI 或配置中先完成频道登录。 |
| **技能 / Skills** | 查看、启用或禁用技能；部分技能需额外配置。 |
| **配置 / Config** | 高级用户可查看或编辑 `openclaw.json` 等配置（谨慎修改）。 |
| **日志 / Logs** | 查看 Gateway 日志，便于排查连接或运行问题。 |

若页面打不开或连接失败，先确认 `openclaw-gateway` 已启动（`docker compose ps`），且本机防火墙未拦截 18789 端口。

### 跨域（CORS）说明

浏览器里出现跨域 / CORS 报错时，多半是**页面来源和请求目标不一致**：

- **`localhost` 和 `127.0.0.1` 在浏览器里算不同来源**：若用 `http://localhost:18789/` 打开页面，但页面里的 WebSocket/请求指向 `ws://127.0.0.1:18789`，会被视为跨域并可能被拦截。
- **做法**：**全程只用一种地址**。建议始终用 **http://127.0.0.1:18789/** 打开 Control UI（书签、地址栏都统一用 `127.0.0.1`）；若习惯用 `localhost`，则始终用 **http://localhost:18789/**，不要混用。
- 不要从其他域名或端口（如 `file://`、其他站点）打开页面再去连 18789，否则也会跨域。本环境下 Control UI 与 Gateway 同源访问即可避免 CORS 问题。

---

## 四、端口与目录说明

| 端口  | 用途                               |
| ----- | ---------------------------------- |
| 18789 | Control UI（网页聊天、配置、状态） |
| 18790 | Bridge（内部协议）                 |

| 目录（默认）        | 用途                                        |
| ------------------- | ------------------------------------------- |
| `./data/config`     | OpenClaw 配置（含 token、openclaw.json 等） |
| `./data/workspace`  | Agent 工作区（可被 OpenClaw 读写）          |

---

## 五、常用命令

### 容器与 Gateway

```bash
# 启动（后台）
docker compose up -d

# 停止
docker compose down

# 重启 Gateway（不删数据）
docker compose restart openclaw-gateway

# 查看运行状态
docker compose ps

# 查看 Gateway 日志（实时）
docker compose logs -f openclaw-gateway
```

### CLI 子命令示例

所有 CLI 命令均通过 `docker compose run --rm openclaw-cli <子命令>` 执行，常用示例：

```bash
# 首次配置：生成 Token（仅首次需要）
docker compose run --rm openclaw-cli onboard

# 查看 Gateway 状态与健康
docker compose run --rm openclaw-cli status
docker compose run --rm openclaw-cli health

# 配置频道（如 Telegram、Discord，按提示输入 token 等）
docker compose run --rm openclaw-cli channels add --channel telegram --token "<你的 bot token>"
docker compose run --rm openclaw-cli channels add --channel discord --token "<你的 bot token>"

# 查看已配置的频道
docker compose run --rm openclaw-cli channels status

# 技能：列出、启用、禁用
docker compose run --rm openclaw-cli skills list
docker compose run --rm openclaw-cli skills enable <技能名>

# 从终端发一条消息（可选，一般用 Control UI 即可）
docker compose run --rm openclaw-cli message "你好"

# 查看/编辑配置（高级）
docker compose run --rm openclaw-cli configure
```

更多子命令见 OpenClaw 官方 [CLI Reference](https://docs.openclaw.ai/cli)。

---

## 六、进阶使用

### 配置模型 API（Claude、OpenAI 等）

OpenClaw 需要模型 API 才能正常回复。常用方式：

1. **通过 Control UI**：Settings 或 Config 中可配置 Provider、API Key 等（具体字段见 [Model Providers](https://docs.openclaw.ai/providers)）。
2. **通过环境变量**：在 `docker-compose.yml` 的 `openclaw-gateway` 的 `environment` 下增加例如 `ANTHROPIC_API_KEY`、`OPENAI_API_KEY` 等（需自行查阅 OpenClaw 文档对应变量名），或使用 `.env` 传入，避免写死在 compose 里。
3. **通过配置文件**：`./data/config/` 下的 `openclaw.json` 等由 OpenClaw 管理，可在 Control UI 的 Config 中编辑，或关闭容器后直接编辑该目录下文件。

配置完成后重启 Gateway：`docker compose restart openclaw-gateway`。

### 备份与恢复

- **备份**：直接复制本目录下的 `./data` 文件夹（含 `config` 与 `workspace`）到其他位置即可保留配置、Token 与工作区内容。
- **恢复**：将备份的 `data` 放回本目录，覆盖现有 `data`，然后执行 `docker compose up -d`。

### 更新 OpenClaw 版本

若官方仓库有更新，希望用新版本时：

```bash
# 重新构建镜像（会重新克隆源码并构建）
docker compose build --no-cache

# 重启 Gateway 使用新镜像
docker compose up -d
```

注意：大版本升级后若配置不兼容，需参考 OpenClaw 官方升级说明调整 `./data/config`。

---

## 七、常见问题

| 问题                      | 解决方法                                                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 打开 18789 无法访问       | 确认 `openclaw-gateway` 已启动（`docker compose ps`），且端口未被占用                                              |
| 首次连接提示需要 token    | 先执行 `docker compose run --rm openclaw-cli onboard` 获取 token，在 Control UI Settings 中粘贴                    |
| 构建失败或很慢            | 确保能访问 GitHub；首次构建需下载并编译 OpenClaw 源码，可多等几分钟                                                |
| 配置/工作区丢失           | 确认 `OPENCLAW_CONFIG_DIR`、`OPENCLAW_WORKSPACE_DIR` 指向本目录下 `data/`，不要用临时目录                          |
| 启用 read_only 后启动报错 | 可能是 OpenClaw 需要写系统目录；可暂时在 docker-compose.yml 中去掉 `read_only`、`tmpfs` 排查（会降低与宿主机隔离） |
| 发消息无回复或报错        | 检查是否已配置模型 API（Claude、OpenAI 等）；在 Control UI Config 或 `./data/config` 中配置 API Key 后重启 Gateway |
| CLI 命令报错「找不到服务」 | 使用 `docker compose run --rm openclaw-cli <子命令>`，不要漏掉 `openclaw-cli`；确保镜像已构建（`docker compose build`） |
| 浏览器报跨域 / CORS       | 统一用同一地址打开 Control UI：始终用 **http://127.0.0.1:18789/** 或始终用 **http://localhost:18789/**，不要混用 `localhost` 与 `127.0.0.1` |

---

## 八、参考

- OpenClaw 官方文档：[docs.openclaw.ai](https://docs.openclaw.ai/)
- Docker 安装说明：[Docker (optional)](https://docs.openclaw.ai/install/docker)
- Control UI 说明：[Control UI](https://docs.openclaw.ai/web/control-ui)
