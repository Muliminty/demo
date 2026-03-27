# Jarvis Local 记忆结构设计

这份文档定义 `Jarvis Local` 的记忆分层、数据结构、读写规则和治理原则。

目标不是“保存所有聊天记录”，而是构建一个：

- 长期可用
- 可治理
- 可演进
- 真正能让 Jarvis 越用越懂你的记忆系统

---

## 一、设计目标

记忆系统需要满足：

- 记住真正有价值的信息
- 支持长期使用
- 支持按需提取
- 支持手动修正
- 支持来源追踪
- 支持置信度和版本更新

核心原则：

- 不是所有对话都进长期记忆
- 不是所有长期记忆都每轮带入 prompt
- 记忆要分层、要筛选、要治理

---

## 二、记忆分层

建议采用 6 层记忆：

1. Working Memory
2. Profile Memory
3. Relationship Memory
4. Task Memory
5. Episodic Memory
6. Reflection Memory

---

## 三、Working Memory

### 作用

保存当前 session 的短期上下文。

### 内容

- 最近 N 轮对话
- 最近工具调用结果
- 当前临时上下文
- 当前临时目标

### 特点

- 生命周期短
- 主要服务当前会话
- 不直接算长期记忆

### 建议存储

- 内存
- session 文件缓存
- SQLite session message 表

### 推荐结构

```json
{
  "session_id": "sess_001",
  "recent_messages": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ],
  "recent_tool_results": [],
  "current_focus": "正在讨论记忆系统设计"
}
```

---

## 四、Profile Memory

### 作用

保存关于用户的稳定事实。

### 内容

- 用户名称
- 常用语言
- 技术栈
- 长期兴趣
- 输出偏好
- 工作习惯

### 特点

- 更新频率低
- 置信度要求高
- 不能轻易乱写

### 推荐结构

```json
{
  "user_id": "local_user",
  "name": "muliminty",
  "language": "zh-CN",
  "technical_focus": [
    "前端",
    "AI demo",
    "本地 Ollama"
  ],
  "response_preferences": [
    "简洁",
    "可执行",
    "少空话"
  ],
  "facts": [
    {
      "key": "assistant_goal",
      "value": "想做电脑里的 Jarvis",
      "confidence": 0.98,
      "source": "chat",
      "last_confirmed_at": "2026-03-26T00:00:00+08:00"
    }
  ]
}
```

---

## 五、Relationship Memory

### 作用

记录用户和 Jarvis 的协作方式与互动偏好。

### 内容

- 喜欢什么回答方式
- 不喜欢什么口吻
- 常见协作节奏
- 对助手的角色期待

### 特点

- 比 Profile 更动态
- 直接影响回答风格
- 是“更像同一个人”的关键

### 推荐结构

```json
{
  "user_id": "local_user",
  "interaction_style": [
    {
      "fact": "用户希望先落地方案，再补解释",
      "confidence": 0.92,
      "source": "chat"
    },
    {
      "fact": "用户不喜欢客服式语气",
      "confidence": 0.9,
      "source": "chat"
    }
  ],
  "tone_preferences": [
    "像长期搭档",
    "少一点模板味",
    "敢给判断"
  ]
}
```

---

## 六、Task Memory

### 作用

记录当前项目、任务、进度和卡点。

### 内容

- 当前活跃项目
- 当前目标
- 已完成进展
- 当前卡点
- 下一步建议

### 特点

- 更新频率高
- 对每轮回答影响很大
- 是协作能力的核心

### 推荐结构

```json
{
  "active_tasks": [
    {
      "id": "task_jarvis_local",
      "title": "Jarvis Local 架构设计",
      "status": "in_progress",
      "goal": "形成一套可扩展、支持插件和多渠道的健壮架构",
      "recent_progress": [
        "完成需求文档",
        "完成计划文档"
      ],
      "current_focus": [
        "架构设计",
        "记忆结构设计"
      ],
      "blocked_by": [],
      "related_files": [
        "/Users/muliminty/project/demo/backend/express/jarvis-local/docs/REQUIREMENTS.md"
      ],
      "updated_at": "2026-03-26T00:00:00+08:00"
    }
  ]
}
```

---

## 七、Episodic Memory

### 作用

保存关键事件和里程碑。

### 内容

- 重要完成项
- 重要决策
- 重大失败与修复
- 阶段转折点

### 特点

- 像“经历”
- 用于提供连续性和陪伴感
- 不适合每轮全量注入，只适合按需取近几条

### 推荐结构

建议用 `jsonl`：

```json
{"id":"ep_001","timestamp":"2026-03-26T00:00:00+08:00","event":"将 openclaw-lite 正式更名为 Jarvis Local","impact":"项目品牌和长期方向确定","tags":["milestone","branding"]}
{"id":"ep_002","timestamp":"2026-03-26T00:00:00+08:00","event":"完成完整需求文档初版","impact":"项目从想法进入结构化设计阶段","tags":["milestone","docs"]}
```

---

## 八、Reflection Memory

### 作用

记录 Jarvis 对“如何更好帮助用户”的总结。

### 内容

- 用户协作偏好总结
- 近期互动模式
- 哪种回答最有效
- 哪种帮助方式最契合

### 特点

- 不是事实记忆，而是策略记忆
- 是“越用越聪明”的关键

### 推荐结构

建议用 `jsonl`：

```json
{"id":"rf_001","timestamp":"2026-03-26T00:00:00+08:00","insight":"用户更希望先形成完整架构，再进入局部实现。","confidence":0.91}
{"id":"rf_002","timestamp":"2026-03-26T00:00:00+08:00","insight":"用户对长期可扩展性和系统边界非常重视。","confidence":0.88}
```

---

## 九、统一记忆字段建议

长期记忆条目建议尽量统一包含：

- `id`
- `type`
- `fact` 或 `value`
- `confidence`
- `source`
- `created_at`
- `updated_at`
- `last_confirmed_at`
- `tags`

示例：

```json
{
  "id": "mem_001",
  "type": "relationship",
  "fact": "用户不喜欢客服式语气",
  "confidence": 0.9,
  "source": "chat",
  "created_at": "2026-03-26T00:00:00+08:00",
  "updated_at": "2026-03-26T00:00:00+08:00",
  "last_confirmed_at": "2026-03-26T00:00:00+08:00",
  "tags": ["tone", "preference"]
}
```

---

## 十、记忆写入规则

### 必须写入的情况

- 明确稳定偏好
- 明确长期目标
- 当前项目关键状态
- 重要事件
- 多次重复出现的行为模式

### 不应直接写入的情况

- 一次性闲聊
- 情绪化瞬时表达
- 不确定事实
- 没有长期价值的信息

### 写入流程建议

每轮对话后：

1. 主回答结束
2. 调用 `memory extractor`
3. 判断是否值得写入
4. 分类到不同 memory layer
5. 落盘 / 入库

---

## 十一、记忆读取规则

不是所有记忆每轮都注入。

### 每轮固定读取

- profile 中最关键的稳定偏好
- relationship 中最关键的互动偏好
- task 中当前 active task

### 按需读取

- episodic 最近 3 条
- reflection 最近 2 条
- 与当前任务相关的 task history

### 不应每轮全量注入

- 全部 episodes
- 全部 reflections
- 全部历史任务

---

## 十二、记忆治理规则

记忆系统必须支持治理，否则会越来越乱。

### 需要治理的内容

- 去重
- 合并
- 过期淘汰
- 冲突更新
- 用户纠正

### 示例规则

- 两条相似 preference 合并为一条高置信度记录
- 任务完成后归档
- 被用户明确否认的记忆降权或删除
- 长期未确认的低置信度记忆降低优先级

---

## 十三、与多渠道的关系

记忆系统必须支持多渠道身份映射。

建议区分：

- `user memory`
  跨渠道共享
- `session memory`
  渠道内会话专用
- `group/project memory`
  群或项目级上下文

例如：

- 你在 Web 和飞书私聊里，应该共享 `profile memory`
- 某个飞书群的项目讨论，应该有独立的 `group/project memory`

---

## 十四、建议存储形式

第一版建议：

```text
data/
  memory/
    profile.json
    relationship.json
    tasks.json
    episodes.jsonl
    reflections.jsonl
```

后续可逐步迁移到：

- SQLite 表
- 向量索引
- 记忆 metadata 表

---

## 十五、后续落地建议

第一阶段优先落：

1. `profile.json`
2. `relationship.json`
3. `tasks.json`
4. `episodes.jsonl`
5. `memory extractor`
6. `prompt builder`

完成这些之后，Jarvis Local 才会从“聊天 UI”真正进入“长期助手”的阶段。
