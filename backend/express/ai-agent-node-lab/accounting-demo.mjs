import OpenAI from 'openai';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { aiConfig } from './get-ai-config.mjs';

// 统一从 get-ai-config.mjs 读取厂商、模型和鉴权信息。
// 这样这个 demo 不需要关心自己现在接的是 DeepSeek 还是阿里云兼容接口。
const { apiKey, baseURL, model, provider } = aiConfig;

const client = new OpenAI({
  apiKey,
  baseURL,
});

// 这是“单条账单”的最终目标结构。
// 我们先用 zod 描述清楚理想输出，再把它转成 JSON Schema 发给模型。
// 这样做的好处是：
// 1. prompt 和代码校验共用同一份结构定义；
// 2. 模型输出后还能再用 zod 做一次强校验，避免脏数据直接进入业务逻辑。
const AccountItemSchema = z.object({
  amount: z.number().describe('交易金额，未提及默认 0'),
  category: z.enum(['餐饮', '交通', '购物', '娱乐', '居家', '医疗', '学习', '其他']),
  product: z.string().describe('商品或服务名称'),
  sentiment: z.string().describe('消费时的情绪'),
  ai_comment: z.string().describe('AI 对本次消费的简短反馈'),
});

// 这里没有让模型只返回账单，而是要求它每一轮都返回两部分：
// 1. reply: 给用户看的自然语言回复，用来保持“像聊天”；
// 2. record: 如果信息足够则产出结构化账单，否则返回 null。
// 这样我们就把“对话体验”和“结构化提取”合并到同一次模型调用里了。
const AssistantTurnSchema = z.object({
  reply: z.string().describe('给用户的自然语言回复，简洁、友好、像真人对话'),
  record: AccountItemSchema.nullable().describe('如果当前信息足够记一笔账，则返回结构化记录，否则返回 null'),
});

// OpenAI 兼容接口更容易稳定理解 JSON Schema，而 zod 本身主要用于本地校验，
// 所以这里把 zod schema 转成模型更容易遵循的 JSON Schema 文本。
const jsonSchema = zodToJsonSchema(AssistantTurnSchema, 'AccountingAssistantTurn');

// messages 既是“对话上下文”，也是这个 demo 的记忆载体。
// 第一条 system message 定义了角色、目标和输出约束；
// 后续每一轮 user / assistant 都持续追加进去，这样模型才能理解上下文。
const messages = [
  {
    role: 'system',
    content: `
你是一个专业、自然、会追问的记账助手，当前工作在终端对话场景。

你的目标：
1. 先像聊天助手一样自然回复用户。
2. 如果用户提供了足够的消费信息，就提取成一条账单记录。
3. 如果信息不足以记账，就先追问，不要硬编。
4. 如果用户只是闲聊、问建议、问怎么分类，也正常回答。

记账规则：
- amount 是数字，单位默认人民币元，未提及则尽量结合上下文判断；实在无法判断就不要生成 record。
- category 只能是：餐饮、交通、购物、娱乐、居家、医疗、学习、其他。
- product 写商品或服务名，尽量简洁。
- sentiment 写消费时的情绪，没有明确情绪时可以根据语气做保守概括。
- ai_comment 给一句简短反馈，口吻自然，不要说教。

输出要求：
- 必须严格输出 JSON。
- 不要输出任何 JSON 以外的内容。
- JSON Schema 如下：
${JSON.stringify(jsonSchema, null, 2)}
`,
  },
];

// 启动时先把运行环境打印出来，便于你调试：
// 当前接的是哪家服务、哪个模型、终端里有哪些命令可以用。
function printWelcome() {
  console.log('记账助手已启动，开始终端对话模式。');
  console.log(`✅ 当前厂商: ${provider}`);
  console.log(`📡 Base URL: ${baseURL}`);
  console.log(`🤖 模型: ${model}`);
  console.log('输入消费描述即可聊天或记账，输入 /exit 退出，输入 /clear 清空上下文。\n');
}

// 这是“单轮对话”的核心函数。
// 不管是单次命令模式，还是终端聊天循环，最终都会走到这里。
async function runAssistantTurn(userText) {
  // 先把用户输入塞进上下文，让模型知道这是最新一轮消息。
  messages.push({ role: 'user', content: userText });

  const response = await client.chat.completions.create({
    model,
    // 要求模型直接返回 JSON，而不是一段混杂解释的自然语言。
    response_format: { type: 'json_object' },
    messages,
  });

  // 模型返回的是字符串，这里先 JSON.parse，再用 zod 做运行时校验。
  // 两层保护的意义：
  // 1. parse 负责把文本变成对象；
  // 2. zod 负责确认对象字段、类型、枚举值都符合预期。
  const raw = response.choices[0]?.message?.content ?? '{}';
  const parsed = JSON.parse(raw);
  const result = AssistantTurnSchema.parse(parsed);

  // 这里把 assistant 的结构化结果也放回上下文。
  // 好处是下一轮模型能“看到自己上轮说了什么、识别出了什么”。
  // 例如用户下一句说“不是咖啡，是拿铁”，模型就更容易基于上轮记录进行修正。
  messages.push({ role: 'assistant', content: JSON.stringify(result) });

  // 展示层故意拆成“自然回复 + 可选账单”两段输出：
  // 用户先感受到在聊天，其次才看到机器可读的结构化结果。
  console.log(`\nAI: ${result.reply}`);
  if (result.record) {
    console.log('本轮识别到账单：');
    console.log(JSON.stringify(result.record, null, 2));
  }
  console.log('');
}

// 传参启动时，走单轮模式，适合快速测试 prompt 或结构化效果。
async function runSingleTurn(userText) {
  printWelcome();
  console.log(`你: ${userText}`);
  await runAssistantTurn(userText);
}

// 不传参数时，进入真正的终端聊天循环。
// 这里用 readline/promises 是为了直接配合 async/await，
// 写出来比传统事件监听更直观。
async function runInteractiveChat() {
  printWelcome();

  const rl = createInterface({ input, output });

  try {
    while (true) {
      const answer = (await rl.question('你: ')).trim();

      // 空输入直接忽略，避免无意义请求占用 token。
      if (!answer) {
        continue;
      }

      // /exit 是本地命令，不发给模型，直接结束循环。
      if (answer === '/exit') {
        console.log('\n下次记账见。');
        break;
      }

      // /clear 的关键是保留第 0 条 system prompt，只删除后续上下文。
      // 这样会“失忆”，但不会丢掉助手的角色设定和输出规范。
      if (answer === '/clear') {
        messages.splice(1);
        console.log('\n已清空上下文，我们可以重新开始。\n');
        continue;
      }

      // 正常输入才进入模型处理。
      await runAssistantTurn(answer);
    }
  } finally {
    // 无论是正常退出还是异常中断，都确保 readline 被关闭。
    rl.close();
  }
}

try {
  // 支持两种使用方式：
  // 1. `npm run accounting -- "..."` -> 单轮模式；
  // 2. `npm run accounting` -> 交互式聊天模式。
  const initialText = process.argv.slice(2).join(' ').trim();

  if (initialText) {
    await runSingleTurn(initialText);
  } else {
    await runInteractiveChat();
  }
} catch (error) {
  // 这里统一兜底所有异常，方便你在 demo 阶段直接看到错误细节。
  // 常见错误包括：API Key 未配置、网络不通、模型没按 JSON 返回等。
  console.log('\n❌ 运行失败：');
  console.log(error);
  process.exit(1);
}
