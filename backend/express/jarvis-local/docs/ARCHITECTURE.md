# Jarvis Local 架构设计

这份文档用于定义 `Jarvis Local` 的整体架构、模块边界、扩展方式和后续演进原则。

目标不是只支撑当前的本地聊天 demo，而是支撑未来这些能力：

- 长期记忆
- 工具调用
- 本地知识检索
- 多渠道接入
- 插件系统
- 可持续演进成“电脑里的 Jarvis”

---

## 一、架构目标

整体架构必须满足以下要求：

- 本地优先
- 模块边界清晰
- 能力可替换
- 支持插件扩展
- 支持多消息入口
- 安全可控
- 日志与行为可追踪

Jarvis Local 不应是“聊天页面 + 一坨逻辑”，而应是“一个有稳定内核的本地 AI 助手平台”。

---

## 二、总体分层

建议采用以下分层：

```text
User / External Chat
        ↓
UI / Channel Layer
        ↓
Conversation Router
        ↓
Orchestrator
        ↓
Capability Layer
        ↓
Storage / OS / External Providers
```

更细化后的模块结构：

```text
Core
├── Config
├── Session
├── Events
├── Permissions
├── Plugin Manager
└── Logger

Channels
├── Web Chat
├── Feishu
├── Telegram
└── Other connectors

Orchestrator
├── Context Builder
├── Prompt Builder
├── Tool Loop
├── Response Controller
└── Post-turn Pipeline

Capabilities
├── Models
├── Memory
├── Tools
├── Knowledge
└── Reflection

Storage
├── SQLite
├── Local files
└── Plugin data
```

---

## 三、核心模块

### 1. Core

`Core` 是系统内核，负责最稳定、最基础的部分。

职责：

- 配置管理
- 会话管理
- 事件总线
- 权限管理
- 插件生命周期管理
- 日志系统

核心原则：

- 内核不依赖具体插件实现
- 插件只能通过受控接口访问系统
- 内核提供规则，不承载业务细节

建议子模块：

- `config-service`
- `session-service`
- `event-bus`
- `permission-service`
- `plugin-manager`
- `logger`

---

### 2. Channels

`Channels` 负责不同消息入口。

目的：

- 不把“聊天”理解成只有网页输入框
- 让飞书、Telegram、网页、桌面入口都能接到同一个 Jarvis 内核

支持的入口类型：

- Web Chat
- Feishu
- Telegram
- Discord

职责：

- 接收消息
- 验签或校验来源
- 解析平台原始格式
- 转成统一内部消息结构
- 把回复适配回各个平台

---

### 3. Conversation Router

`Conversation Router` 决定一条消息进入哪个内部会话。

必须解决：

- 同一个用户在不同渠道发消息
- 群聊和私聊的上下文区别
- 群聊绑定项目上下文
- 同一用户是否共享长期记忆

示例路由规则：

- Web 私聊 -> 个人 session
- 飞书私聊 -> 个人工作 session
- 飞书群聊 -> 群 session
- 群聊中被 `@Jarvis` 才进入处理流程

---

### 4. Orchestrator

`Orchestrator` 是每轮对话的编排核心。

职责：

1. 接收标准化消息
2. 读取当前 session
3. 读取记忆
4. 检索知识
5. 决定是否调用工具
6. 构建上下文与 prompt
7. 调用模型
8. 处理工具 loop
9. 生成最终响应
10. 写回记忆与日志

建议拆分：

- `context-builder`
- `prompt-builder`
- `tool-loop`
- `response-controller`
- `post-turn-pipeline`

---

### 5. Capability Layer

能力层是 Jarvis 的“功能供应商”。

建议全部接口化，不直接写死实现。

能力类型：

- `Model Provider`
- `Memory Provider`
- `Tool Provider`
- `Knowledge Provider`
- `Reflection Provider`

这样后面你可以替换：

- Ollama -> OpenAI / Claude / 其他 provider
- SQLite memory -> 文件 memory / 其他实现
- 关键词检索 -> 向量检索

---

## 四、能力接口设计原则

每类能力都应该先定义 contract，再写 provider。

### 1. ModelProvider

职责：

- 对话
- 流式输出
- 记忆提炼
- 摘要
- 反思

### 2. MemoryProvider

职责：

- 读取记忆
- 写入记忆
- 更新记忆
- 删除记忆

### 3. ToolProvider

职责：

- 注册工具
- 执行工具
- 返回结构化结果

### 4. KnowledgeProvider

职责：

- 导入知识
- 切块
- 索引
- 检索

---

## 五、插件系统架构

### 1. 插件目标

插件系统必须支持：

- 能力扩展
- 渠道扩展
- 配置扩展
- UI 扩展

### 2. 插件分类

#### Capability Plugins

负责提供能力：

- memory provider
- tool provider
- model provider
- knowledge provider

#### Channel Plugins

负责提供通信入口：

- web
- feishu
- telegram
- discord

### 3. 插件组成

每个插件应包含：

- `manifest`
- `entry`
- `permissions`
- `hooks`
- `configSchema`

### 4. Hook 机制

推荐支持以下生命周期 hook：

- `on_app_start`
- `on_session_created`
- `before_context_build`
- `after_context_build`
- `before_model_call`
- `after_model_call`
- `before_tool_execute`
- `after_tool_execute`
- `before_response_send`
- `after_response_send`
- `after_turn_complete`

### 5. 插件隔离原则

必须做到：

- 插件默认零权限
- 插件只能通过 SDK 调用系统能力
- 插件异常不拖垮主系统
- 插件独立日志
- 插件独立配置
- 插件独立存储目录

---

## 六、事件驱动架构

为了降低耦合，Jarvis Local 应该具备事件总线。

推荐事件：

- `session.created`
- `message.received`
- `context.built`
- `model.called`
- `tool.called`
- `tool.completed`
- `response.completed`
- `memory.updated`
- `plugin.loaded`

用途：

- 记忆系统监听事件
- 日志系统监听事件
- 插件系统监听事件
- UI 状态系统也可以消费事件

---

## 七、权限系统架构

权限系统必须早做。

### 权限维度

权限不只取决于插件，还取决于：

- 插件
- 渠道
- 用户
- 会话作用域
- 工具风险等级

### 示例权限

- `files.read`
- `files.write`
- `memory.read`
- `memory.write`
- `tools.execute.safe`
- `tools.execute.dangerous`
- `shell.exec`
- `channel.send`
- `knowledge.index`

### 权限原则

- 默认拒绝
- 显式声明
- 高风险二次确认
- 渠道级权限差异化

例如：

- Web 本地聊天可读文件
- 飞书群聊禁止执行本地 shell
- 高风险工具只允许本地 UI 确认后执行

---

## 八、多渠道架构

### 1. 统一消息模型

不同渠道消息必须先转换成统一内部结构。

建议内部消息结构包含：

- `channel`
- `chatId`
- `userId`
- `messageId`
- `text`
- `attachments`
- `timestamp`
- `meta`

### 2. 响应适配

不同渠道的返回形式不同：

- Web：可流式展示
- 飞书：可能是文本或卡片
- Telegram：可能是分段文本

因此内核输出不能只是一段字符串，而应是结构化响应对象。

---

## 九、飞书接入设计

飞书不是特殊逻辑，而是一个 `Channel Plugin`。

### 第一阶段飞书能力

- 飞书私聊接入
- 飞书群聊接入
- 群聊只在 `@Jarvis` 时响应
- 群与项目上下文绑定

### 飞书接入需要额外考虑

- 用户身份映射
- 群聊与私聊的会话策略
- 渠道权限限制
- 群聊中工具能力限制

---

## 十、存储架构

推荐本地优先存储方案：

- SQLite：结构化数据
- JSON / JSONL：稳定配置与事件流
- 本地目录：知识文件、插件数据

建议目录：

```text
data/
  db/
  memory/
  sessions/
  knowledge/
  plugins/
  logs/
```

### 存储分工

- `SQLite`
  - sessions
  - identities
  - channel mappings
  - tool logs
  - knowledge metadata
- `JSON / JSONL`
  - profile
  - relationship
  - episodes
  - reflections
- `plugins/<plugin-id>/`
  - 插件专用存储

---

## 十一、UI 架构

UI 不应该只是聊天框，还应预留系统扩展位。

后续建议支持：

- 会话列表
- 当前模型状态
- 工具执行状态
- 思考过程视图
- Memory Inspector
- Plugin Status
- Settings

为了插件扩展，前端应预留：

- sidebar widget slot
- message action slot
- settings panel slot

---

## 十二、推荐目录结构

正式演进建议采用：

```text
jarvis-local/
  src/
    core/
      config/
      events/
      permissions/
      plugins/
      sessions/
      identities/
      logger/
    orchestrator/
      chat/
      context/
      prompt/
      tools/
      post-turn/
    capabilities/
      memory/
      tools/
      knowledge/
      models/
      reflection/
    channels/
      contracts/
      router/
      plugins/
        web/
        feishu/
        telegram/
    api/
      routes/
      controllers/
    ui/
      components/
      pages/
      stores/
  data/
    db/
    memory/
    sessions/
    knowledge/
    plugins/
    logs/
  docs/
```

---

## 十三、演进原则

1. 先稳定内核，再开放插件
2. 先做 Web，再做飞书等渠道
3. 先做 provider 接口，再做多实现
4. 先做低风险工具，再做高风险能力
5. 先做可读可调试，再做复杂智能

---

## 十四、下一步架构落地建议

下一阶段最值得先落的架构工作：

1. 定义 provider 接口
2. 建立 event bus
3. 建立 permission system
4. 抽出 orchestrator
5. 抽出 memory / tools / knowledge contracts
6. 建立 session / identity / channel routing 基础结构
