# AI 小镇 - 星露谷物语风格 UI

> 创建时间：2026-02-26
> 状态：灵感阶段

## 核心概念

一个像素风格的 AI 小镇模拟器，每个居民都是独立的 AI 角色，拥有自己的性格、外观和行为模式。

## 核心功能

### 1. AI 角色系统
- 每个角色有独立的设定（性格、背景、喜好）
- 独特的像素外观
- 基于时间表的行为模式
- 记忆系统（短期/长期记忆）

### 2. 时间切片调度（Token 优化）
```
morning:  06:00  - 起床，规划一天
noon:     12:00  - 午间互动
evening:  18:00  - 傍晚社交
night:    22:00  - 总结日记
```
只在固定时间点触发 AI 对话，大幅降低 token 消耗。

### 3. 行为日志系统
- 记录每个角色的行动轨迹
- 显示内心独白（AI 生成）
- 可视化时间线

### 4. 上帝留言板
- 玩家作为"上帝"发布留言
- 角色可读取留言并做出反应
- 支持定向/全员广播
- 留言可设置过期时间

## 技术架构

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (游戏视图)                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ 像素地图渲染 │  │ 角色动画系统 │  │ UI层(日志/留言板)│  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Backend (状态管理)                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ 时间调度器   │  │ 角色状态机   │  │ 事件/日志系统   │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    AI Layer (LLM API)                    │
│           批量调度 / 上下文压缩 / 缓存策略                  │
└─────────────────────────────────────────────────────────┘
```

## 技术栈

| 模块 | 方案 | 说明 |
|------|------|------|
| 游戏引擎 | Phaser 3 / PixiJS | 像素游戏成熟方案 |
| 前端框架 | React + Zustand | UI 层管理 |
| 后端 | Node.js + BullMQ | 定时任务队列 |
| 数据库 | SQLite / PostgreSQL | 持久化 |
| AI | OpenAI / Claude API | 角色对话生成 |

## Token 优化策略

1. **时间切片调度** - 只在固定时间点调用 AI
2. **批量处理** - 同场景角色共享上下文
3. **上下文压缩** - 只传最近 N 条相关日志
4. **设定缓存** - 性格模板预处理
5. **分级模型** - 简单行为用便宜模型

## 数据模型

```typescript
// 角色定义
interface Character {
  id: string;
  name: string;
  personality: string;      // 性格描述
  appearance: SpriteConfig;  // 外观配置
  schedule: Schedule[];      // 日常作息
  memory: Memory[];          // 记忆系统
  currentGoal: string;       // 当前目标
}

// 行为日志
interface ActionLog {
  id: string;
  characterId: string;
  timestamp: Date;
  location: { x, y, scene };
  action: string;
  thoughts?: string;         // 内心独白
  triggeredBy: 'schedule' | 'god_message' | 'interaction';
}

// 上帝留言
interface GodMessage {
  id: string;
  content: string;
  targetCharacterIds: string[];
  readBy: string[];
  effect: string;
  createdAt: Date;
  expiresAt: Date;
}
```

## 开发阶段

### Phase 1: MVP
- [ ] 基础地图 + 像素角色移动
- [ ] 2-3 个角色 + 简单 AI 对话
- [ ] 基础日志显示

### Phase 2: 核心系统
- [ ] 时间调度系统
- [ ] 上帝留言板
- [ ] 角色记忆系统

### Phase 3: 丰富内容
- [ ] 更多角色
- [ ] 建筑交互
- [ ] 节日/事件系统

## 素材资源

- [OpenGameArt](https://opengameart.org/) - 免费像素素材
- [itch.io](https://itch.io/game-assets/free/tag-pixel-art) - 像素艺术资源
- [Aseprite](https://www.aseprite.org/) - 像素画编辑器

## 难点与解决方案

| 难点 | 解决方案 |
|------|---------|
| 角色行为一致性 | Character Card 格式 + 长期记忆摘要 |
| 像素素材 | OpenGameArt / itch.io 免费素材 |
| 实时性 vs Token | 事件队列 + 推送 |
| 角色间互动 | 共享上下文窗口 |

## 参考资料

- [Stardew Valley Wiki](https://stardewvalleywiki.com/)
- [Phaser 3 官方文档](https://photonstorm.github.io/phaser3-docs/)
- [Character Card 规范](https://github.com/malfoyslastname/character-card-spec)

---

*此文档会随着项目进展持续更新*