# ai-agent-node-lab

这是一个最小可运行的 `Node.js` AI 学习实验目录，用来验证本地环境、API Key 和模型调用链路是否打通。

## 目标

- 使用 `Node.js` 跑通一次大模型调用
- 学会通过 `.env` 管理 API Key
- 为后续“结构化输出 / 工具调用 / Agent 实验”打基础

## 使用步骤

1. 安装依赖

```bash
npm install
```

2. 复制环境变量模板

```bash
cp .env.example .env
```

3. 在 `.env` 中填入对应厂商的 API Key（见下方「切换模型」）

4. 运行环境检查

```bash
npm run check
```

## 切换模型

在 `.env` 里改 **一行** 即可切换厂商和模型：

- **切换厂商**：`AI_PROVIDER=deepseek` 或 `AI_PROVIDER=aliyun`
- **指定模型**（可选）：`AI_MODEL=qwen-plus`、`AI_MODEL=qwen-turbo`、`AI_MODEL=deepseek-chat` 等，不填则使用该厂商默认模型

各厂商的 `API_KEY`、`BASE_URL` 在 `.env` 中按区块配置好即可，脚本会根据 `AI_PROVIDER` 自动选用。

## 当前文件

- `check-env.mjs`：最小模型连通性验证脚本
- `get-ai-config.mjs`：解析 `AI_PROVIDER` / `AI_MODEL`，供其他脚本复用
- `.env.example`：环境变量模板
- `package.json`：项目依赖和脚本

## 下一步

- 把对话结果改成结构化输出
- 增加一次简单工具调用
- 为后续 Agent 实验保留统一目录
