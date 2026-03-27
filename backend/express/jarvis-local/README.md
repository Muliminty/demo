# Jarvis Local

`Jarvis Local` 是一个从“最小本地聊天 demo”继续演进成“你电脑里的 Jarvis”的起点项目。

当前阶段，它还是一个本地网页聊天应用：

- 前端：本地网页聊天界面
- 后端：Node 原生 HTTP 服务
- 模型：直接走你本机的 Ollama
- 依赖：零第三方依赖，不需要额外 `npm install`

长期目标不是只做一个聊天框，而是做一个：

- 本地优先
- 有长期记忆
- 会调用工具
- 越用越懂你
- 更像长期搭档的个人 AI 助手

## 当前状态

当前版本已具备：

- 自动读取本地 Ollama 模型列表
- 支持模型切换
- 支持多轮聊天
- 支持服务端流式转发
- 支持基本的思考过程展示
- 支持新建会话

当前还未完成：

- 会话持久化
- 长期记忆系统
- 文件 / 系统工具调用
- 本地知识库检索
- 记忆管理界面

## 运行

在目录 [`backend/express/jarvis-local`](/Users/muliminty/project/demo/backend/express/jarvis-local) 下执行：

```bash
npm run dev
```

默认会启动在：

- App: [http://127.0.0.1:3232](http://127.0.0.1:3232)
- Ollama: `http://127.0.0.1:11434`

## 可选环境变量

```bash
HOST=127.0.0.1
PORT=3232
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen3.5:4b
SYSTEM_PROMPT=你是一个简洁、靠谱的本地 AI 助手。
```

例如：

```bash
OLLAMA_MODEL=llama3.1:8b npm run dev
```

## 项目目标

这个项目的最终方向不是“聊天机器人”，而是“电脑里的 Jarvis”。我建议演进目标分成 5 层：

1. 可用聊天：先让本地对话体验稳定、顺手。
2. 基础记忆：记住你、记住项目、记住当前任务。
3. 工具能力：让它读取文件、搜索项目、调用本地工具。
4. 知识系统：让它能检索你的笔记、文档、代码。
5. 长期成长：通过反思和记忆治理，让它越来越像同一个搭档。

## 技术路线建议

当前代码为了尽快跑通，采用了最轻量方案：

- Node 原生 HTTP 服务
- 原生前端 HTML / CSS / JS
- Ollama REST API

后续建议升级为：

- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + TypeScript
- Database: SQLite
- Search: SQLite FTS
- Later: 向量检索 / 工具系统 / 桌面壳

## 推荐架构

未来建议把系统拆成这几个核心模块：

- Chat System：负责流式对话、会话管理、输出体验
- Memory System：负责长期记忆与短期上下文
- Tool System：负责文件、命令、系统能力
- Knowledge System：负责本地资料检索
- Orchestrator：负责每轮对话的编排
- Learning System：负责反思、偏好学习、记忆合并

## 记忆系统方向

建议从一开始就按分层记忆设计，而不是把所有聊天记录都直接塞给模型：

- Working Memory：当前会话上下文
- Profile Memory：关于你的稳定事实
- Relationship Memory：你和助手之间的互动偏好
- Task Memory：当前项目、任务和进度
- Episodic Memory：历史关键事件
- Reflection Memory：它如何更好帮助你的总结

## 文档

- 全量需求整理见：
  [`docs/REQUIREMENTS.md`](/Users/muliminty/project/demo/backend/express/jarvis-local/docs/REQUIREMENTS.md)
- 系统架构设计见：
  [`docs/ARCHITECTURE.md`](/Users/muliminty/project/demo/backend/express/jarvis-local/docs/ARCHITECTURE.md)
- 记忆结构设计见：
  [`docs/MEMORY_SCHEMA.md`](/Users/muliminty/project/demo/backend/express/jarvis-local/docs/MEMORY_SCHEMA.md)
- 详细计划与任务拆解见：
  [`docs/PLAN.md`](/Users/muliminty/project/demo/backend/express/jarvis-local/docs/PLAN.md)

## 当前代码结构

- [`server.mjs`](/Users/muliminty/project/demo/backend/express/jarvis-local/server.mjs)
  负责静态文件、模型列表接口、聊天接口，以及把 Ollama 的流式输出转发给前端。
- [`public/index.html`](/Users/muliminty/project/demo/backend/express/jarvis-local/public/index.html)
  页面骨架。
- [`public/styles.css`](/Users/muliminty/project/demo/backend/express/jarvis-local/public/styles.css)
  聊天界面样式。
- [`public/app.js`](/Users/muliminty/project/demo/backend/express/jarvis-local/public/app.js)
  前端状态、消息渲染、请求流式聊天。

后续建议演进为：

```text
jarvis-local/
  src/
    server/
      routes/
      orchestrator/
      memory/
      tools/
      knowledge/
      db/
    web/
      components/
      pages/
      hooks/
      stores/
  data/
    memory/
    sessions/
    knowledge/
    logs/
```

## 下一步建议

最值得优先做的 6 件事：

1. 会话持久化
2. 设计 memory schema
3. 做 prompt builder
4. 做 memory extractor
5. 接入文件读取工具
6. 做本地知识检索

## 如果页面显示 Ollama 未连接

先确认本机 Ollama 已经启动，例如：

```bash
ollama serve
```

然后再刷新页面。
