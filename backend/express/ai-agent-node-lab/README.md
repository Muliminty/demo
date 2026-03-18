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

5. 运行终端对话记账 Demo

```bash
npm run accounting
```

进入后可以持续聊天，输入消费描述、补充信息、追问分类都可以。

- 输入 `/exit` 退出
- 输入 `/clear` 清空上下文重新开始

也可以直接传入一段消费描述，走单轮模式：

```bash
npm run accounting -- "今天打车花了 35 元，赶时间有点着急"
```

6. 运行 Function Calling Demo

```bash
npm run function-calling
```

这个示例专门演示工具调用链路：

- 注册 `get_current_time` 和 `calculate_multiply` 两个工具
- 让模型自己决定何时触发 `tool_calls`
- 本地执行真实函数
- 把工具结果追加回 `messages`
- 再次请求模型生成最终答案

也可以单轮测试：

```bash
npm run function-calling -- "现在几点了？"
```

## 切换模型

在 `.env` 里改 **一行** 即可切换厂商和模型：

- **切换厂商**：`AI_PROVIDER=deepseek` 或 `AI_PROVIDER=aliyun`
- **指定模型**（可选）：`AI_MODEL=qwen-plus`、`AI_MODEL=qwen-turbo`、`AI_MODEL=deepseek-chat` 等，不填则使用该厂商默认模型

各厂商的 `API_KEY`、`BASE_URL` 在 `.env` 中按区块配置好即可，脚本会根据 `AI_PROVIDER` 自动选用。

## 当前文件

- `check-env.mjs`：最小模型连通性验证脚本
- `get-ai-config.mjs`：解析 `AI_PROVIDER` / `AI_MODEL`，供其他脚本复用
- `accounting-demo.mjs`：支持终端对话的记账助手示例
- `function-calling-demo.mjs`：最小可运行的 Function Calling 工具调用示例
- `.env.example`：环境变量模板
- `package.json`：项目依赖和脚本

## 记账 Demo 说明

这个示例支持终端多轮对话，会在自然回复的同时尽量提取结构化账单，并用 `zod` 做结果校验，适合继续往下面几个方向扩展：

- 接入数据库或本地账本文件
- 支持一段文本提取多条消费记录
- 增加时间、商家、支付方式等字段
- 继续演示函数调用或 Agent 工作流

## Function Calling Demo 说明

这个示例对应“工具调用”的最小闭环，重点不是工具本身，而是完整流程：

1. 程序在请求里注册工具列表 `tools`
2. 模型判断是否需要工具，并返回 `tool_calls`
3. 本地代码识别工具名和参数，执行真实函数
4. 程序把工具结果以 `role: "tool"` 的消息回填
5. 再次请求模型，让模型基于工具结果产出最终回答

你可以用它来理解为什么 Function Calling 是 Agent 工程化的重要基础。
