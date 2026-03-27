# Jarvis 计划与任务拆解

这份文档的目标不是讲概念，而是把 `Jarvis Local` 如何一步步演进成“电脑里的 Jarvis”拆成可执行任务。

---

## 一、项目定位

`Jarvis Local` 的最终目标：

- 本地运行
- 基于 Ollama
- 像长期搭档，而不是普通聊天机器人
- 随着使用时间增长，越来越懂用户
- 具备记忆、工具、知识检索和任务协作能力

当前版本只是：

- 一个本地聊天 UI
- 一个简单的 Node 服务
- 一个 Ollama 聊天接口转发器

它还不是 Jarvis，只是 Jarvis 的壳。

---

## 二、总路线图

### Phase 1: Chat MVP

目标：

- 先把本地聊天体验做顺
- 让它能稳定和本地模型对话

交付：

- 流式聊天
- 模型切换
- 思考过程展示
- 新会话
- 错误提示

状态：

- 已开始

---

### Phase 2: Memory V1

目标：

- 让它开始记住你
- 让它记住当前项目和任务

交付：

- `profile memory`
- `relationship memory`
- `task memory`
- `session summary`
- memory extractor
- prompt builder

状态：

- 未开始

---

### Phase 3: Tool System V1

目标：

- 让它能帮你做事，而不是只聊天

交付：

- 文件读取
- 项目搜索
- 获取系统时间
- 基础 shell 工具白名单
- 工具调用日志
- 风险操作确认

状态：

- 未开始

---

### Phase 4: Knowledge System V1

目标：

- 让它能使用你的本地资料回答问题

交付：

- 文档导入
- 文本切块
- SQLite FTS 全文检索
- 检索增强回答

状态：

- 未开始

---

### Phase 5: Jarvis Growth

目标：

- 更像同一个人
- 越用越懂你

交付：

- reflection memory
- 记忆合并与去重
- 偏好学习
- 记忆管理页面
- 长期项目跟踪

状态：

- 未开始

---

## 三、推荐技术栈

当前阶段为了快速试验，可以继续保留现有轻量实现。

正式演进建议：

- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + TypeScript
- Database: SQLite
- Search: SQLite FTS
- Model Provider: Ollama
- Desktop Shell: 后期考虑 Tauri

原因：

- 本地优先
- 调试方便
- 易于扩展记忆系统与工具系统
- 不会一开始就把工程复杂度拉太高

---

## 四、核心系统拆解

### 1. Chat System

职责：

- 接收用户输入
- 管理当前会话
- 展示流式回答
- 展示思考过程
- 展示工具执行状态

子任务：

- 会话列表
- 消息持久化
- 停止生成
- Markdown 渲染
- 输入框体验优化

---

### 2. Memory System

职责：

- 保存长期记忆
- 保存当前任务状态
- 在每次回答前提供相关记忆
- 在每轮对话后提炼新记忆

建议分层：

- Working Memory
- Profile Memory
- Relationship Memory
- Task Memory
- Episodic Memory
- Reflection Memory

子任务：

- 定义 schema
- 设计读写流程
- 建立持久化存储
- 建立 memory extraction pipeline

---

### 3. Tool System

职责：

- 让 Jarvis 执行实际动作

第一批工具建议：

- `read_file`
- `search_project`
- `list_directory`
- `get_current_time`

后续工具：

- `write_note`
- `run_safe_command`
- `open_app`
- `read_clipboard`

子任务：

- tool registry
- tool schema
- tool permission policy
- tool execution log

---

### 4. Knowledge System

职责：

- 把笔记、文档、代码转成可检索知识

第一阶段做法：

- 文件导入
- 文本切块
- SQLite FTS 检索

第二阶段再考虑：

- embedding
- 向量检索

子任务：

- 建立文档目录
- 实现 chunk pipeline
- 建立 metadata 表
- 回答前检索相关片段

---

### 5. Orchestrator

职责：

- 每轮对话的编排

基本流程：

1. 用户发消息
2. 读取 working memory
3. 读取 profile / relationship / task
4. 检索相关知识
5. 决定要不要调用工具
6. 组装 prompt
7. 请求模型
8. 处理结果
9. 记忆提炼
10. 写回存储

子任务：

- prompt builder
- context assembler
- post-turn pipeline

---

## 五、数据存储建议

第一版优先使用本地文件 + SQLite。

建议目录：

```text
data/
  memory/
    profile.json
    relationship.json
    tasks.json
    episodes.jsonl
    reflections.jsonl
  sessions/
  knowledge/
  logs/
  db/
```

推荐存储分工：

- `json`：稳定结构
- `jsonl`：事件流
- `sqlite`：检索、索引、会话元数据

---

## 六、近期任务清单

### Sprint 1: 稳定聊天层

- [ ] 增加会话持久化
- [ ] 增加会话列表
- [ ] 增加停止生成
- [ ] 增加 Markdown 渲染
- [ ] 增加错误状态与重试

### Sprint 2: 建立 Memory V1

- [ ] 定义 memory schema
- [ ] 建立 `profile.json`
- [ ] 建立 `relationship.json`
- [ ] 建立 `tasks.json`
- [ ] 建立 `episodes.jsonl`
- [ ] 实现 memory extractor
- [ ] 实现 prompt builder

### Sprint 3: 加入第一批工具

- [ ] 文件读取工具
- [ ] 项目搜索工具
- [ ] 时间工具
- [ ] 工具调用展示
- [ ] 工具调用日志

### Sprint 4: 知识系统 V1

- [ ] 本地文档导入
- [ ] 文本切块
- [ ] SQLite FTS
- [ ] 检索增强回答

### Sprint 5: 更像 Jarvis

- [ ] reflection memory
- [ ] 偏好学习
- [ ] 记忆去重
- [ ] 记忆查看与编辑界面

---

## 七、优先级建议

最值得先做的顺序：

1. 会话持久化
2. memory schema
3. prompt builder
4. memory extractor
5. 文件读取工具
6. 知识检索

不要一开始就做：

- 桌面壳
- 语音
- 太重的向量库
- 太复杂的多 Agent 架构

---

## 八、下一版建议结构

建议逐步把当前项目演进为：

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
  docs/
    PLAN.md
```

---

## 九、判定标准

什么时候它可以开始叫 “Jarvis”？

至少满足：

- 能记住你是谁
- 能记住你最近在做什么
- 能承接上一次项目进度
- 能调用至少 3 个本地工具
- 能从你的本地资料里检索信息
- 能根据长期偏好调整回答方式

在那之前，它还是一个不错的本地 AI app。
