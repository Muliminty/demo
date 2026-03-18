import OpenAI from 'openai';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { aiConfig } from './get-ai-config.mjs';

/**
 * 本文件演示「Function Calling / Tool Calling」的最小闭环：
 * 1) 把可用工具的“声明”(tools schema) 发给模型
 * 2) 模型在需要时返回 tool_calls（= 想调用哪些工具，以及参数）
 * 3) 本地执行工具，把结果以 role='tool' 回填给模型
 * 4) 模型基于工具结果，生成最终自然语言答案
 *
 * 你可以把它理解成一个可扩展的“工具路由器”骨架：
 * - tools：描述“有哪些工具、怎么调用、参数是什么”
 * - toolImplementations：把工具名映射到本地 JS 函数实现
 * - runToolLoop：驱动一次对话回合，直到模型不再请求工具为止
 */

const { apiKey, baseURL, model, provider } = aiConfig;

/**
 * OpenAI SDK 兼容用法：只要服务端遵循 OpenAI Compatible API，
 * 这里的 baseURL 就可以切到不同厂商（DeepSeek / 通义兼容模式等）。
 */
const client = new OpenAI({
  apiKey,
  baseURL,
});

/**
 * 工具实现（本地函数）。
 * 注意：这些函数不直接和模型交互；模型只能“看到”下面 tools 里的 schema 声明。
 *
 * 设计建议：
 * - 入参尽量是 object（便于后续扩展参数）
 * - 返回值尽量可 JSON 序列化（方便回填给模型，也方便日志记录）
 */
function getCurrentTime({ timezone = 'Asia/Shanghai' } = {}) {
  const now = new Date();

  return {
    timezone,
    iso: now.toISOString(),
    local_time: new Intl.DateTimeFormat('zh-CN', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      weekday: 'long',
    }).format(now),
  };
}

function calculateMultiply({ a, b }) {
  return {
    a,
    b,
    result: a * b,
  };
}

/**
 * tools：发给模型的“工具声明”列表（JSON Schema 风格的参数定义）。
 *
 * 关键点：
 * - type: 'function' 表示这是一个可调用的函数工具
 * - function.name：工具唯一标识（模型返回 tool_calls 时会用这个名字）
 * - function.parameters：JSON Schema，告诉模型参数怎么组织、哪些必填
 *
 * 当 tool_choice='auto' 时：模型会自行决定是否调用工具、调用哪一个/多个。
 */
const tools = [
  {
    type: 'function',
    function: {
      name: 'get_current_time',
      description: '获取当前准确时间，适合回答现在几点、今天星期几、当前日期等问题',
      parameters: {
        type: 'object',
        properties: {
          timezone: {
            type: 'string',
            description: 'IANA 时区，例如 Asia/Shanghai、UTC、America/New_York',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'calculate_multiply',
      description: '计算两个数字的乘积，适合精确乘法计算',
      parameters: {
        type: 'object',
        properties: {
          a: {
            type: 'number',
            description: '第一个数字',
          },
          b: {
            type: 'number',
            description: '第二个数字',
          },
        },
        required: ['a', 'b'],
      },
    },
  },
];

/**
 * 工具名 -> 本地实现的映射表。
 * 模型返回的 toolCall.function.name 必须能在这里找到对应实现。
 */
const toolImplementations = {
  get_current_time: getCurrentTime,
  calculate_multiply: calculateMultiply,
};

/**
 * systemPrompt：决定“模型什么时候该用工具”的行为准则。
 * 这里用的是提示词约束（软约束），你也可以：
 * - 更强约束：把 tool_choice 改成指定某个工具（不常用）
 * - 更可控：在本地做意图判断（例如正则/分类器），决定是否允许调用工具
 */
const systemPrompt = `
你是一个会调用工具的 AI 助手。

你的规则：
1. 遇到“当前时间、今天日期、星期几、实时信息”类问题时，优先调用 get_current_time。
2. 遇到需要精确乘法计算的问题时，优先调用 calculate_multiply。
3. 工具返回结果后，请基于工具结果用自然语言给出最终答案。
4. 如果问题不需要工具，就直接正常回答。
5. 回答尽量简洁，但要明确说明结论。
`;

/**
 * messages：对话上下文数组（按时间顺序累积）。
 *
 * 常见角色：
 * - system：系统提示词（规则/风格/限制）
 * - user：用户输入
 * - assistant：模型输出（可能包含 tool_calls）
 * - tool：工具执行结果回填（必须带 tool_call_id 对应某次 tool_calls）
 *
 * 注意：本 demo 是“持续对话”，所以 messages 会不断增长；
 * 输入 /clear 会把除 system 外的上下文清空（messages.splice(1)）。
 */
const messages = [
  {
    role: 'system',
    content: systemPrompt,
  },
];

function printWelcome() {
  console.log('Function Calling Demo 已启动。');
  console.log(`✅ 当前厂商: ${provider}`);
  console.log(`📡 Base URL: ${baseURL}`);
  console.log(`🤖 模型: ${model}`);
  console.log('可以试试问：“现在几点？”、“今天星期几？”、“7.11 和 7.9 谁大？”、“23.5 * 4 是多少？”');
  console.log('输入 /exit 退出，输入 /clear 清空上下文。\n');
}

/**
 * 发起一次“可能包含工具”的模型调用。
 *
 * - tools：把工具 schema 发给模型
 * - tool_choice='auto'：让模型自行决定是否发起 tool_calls
 * - messages：携带完整上下文（包含 tool 回填的结果）
 */
async function callModelWithTools() {
  return client.chat.completions.create({
    model,
    messages,
    tools,
    tool_choice: 'auto',
  });
}

/**
 * 处理用户输入的一轮对话（可能需要多次调用模型）：
 *
 * 之所以用 while(true)，是因为模型可能出现“多段工具链”：
 * - 第一次返回 tool_calls（例如先查时间）
 * - 工具回填后，模型可能再次返回 tool_calls（例如继续做计算/再查一次）
 * - 直到某次返回不再包含 tool_calls，才算得到最终回答并退出循环
 */
async function runToolLoop(userText) {
  messages.push({
    role: 'user',
    content: userText,
  });

  while (true) {
    const response = await callModelWithTools();
    const aiMessage = response.choices[0]?.message;

    if (!aiMessage) {
      throw new Error('模型没有返回 message');
    }

    const toolCalls = aiMessage.tool_calls ?? [];

    /**
     * 终止条件：模型没有请求工具（tool_calls 为空）
     * 这时把 assistant 的自然语言内容写入上下文并打印出来。
     */
    if (!toolCalls.length) {
      messages.push({
        role: 'assistant',
        content: aiMessage.content ?? '',
      });

      console.log(`\nAI: ${aiMessage.content ?? '我暂时没有生成可显示的内容。'}\n`);
      return;
    }

    /**
     * 模型请求调用工具：
     * - 先把这条 assistant message（包含 tool_calls）写入上下文
     * - 再逐个执行 tool_calls，并把执行结果以 role='tool' 回填
     *
     * 关键：role='tool' 的 message 必须包含 tool_call_id，
     * 用来对应本次 assistant tool_calls 中的某一个调用。
     */
    console.log('\nAI 决定调用工具...');
    messages.push(aiMessage);

    for (const toolCall of toolCalls) {
      const toolName = toolCall.function.name;
      const toolArgs = JSON.parse(toolCall.function.arguments || '{}');
      const toolFn = toolImplementations[toolName];

      if (!toolFn) {
        throw new Error(`未实现的工具: ${toolName}`);
      }

      console.log(`- 工具名: ${toolName}`);
      console.log(`- 参数: ${JSON.stringify(toolArgs, null, 2)}`);

      /**
       * 工具执行：这里是同步函数直接返回结果。
       * 如果你的工具需要 IO（数据库/HTTP/文件等），可以改成 async 并 await。
       */
      const toolResult = toolFn(toolArgs);

      console.log(`- 结果: ${JSON.stringify(toolResult, null, 2)}`);

      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        /**
         * content 必须是字符串。通常直接 JSON.stringify 工具返回值即可。
         * 这会成为模型后续推理的“事实依据”。
         */
        content: JSON.stringify(toolResult),
      });
    }

    /**
     * 走到这里，说明已把所有工具结果回填进 messages。
     * 下一轮 while 循环会再次调用模型，让它基于 tool 结果生成最终答案
     * 或者发起下一轮 tool_calls（多段工具链）。
     */
    console.log('\n工具结果已回填给模型，继续生成最终答案...');
  }
}

/**
 * 单轮模式：命令行直接传入一句话后就跑一轮对话。
 * 例如：node function-calling-demo.mjs 现在几点
 */
async function runSingleTurn(userText) {
  printWelcome();
  console.log(`你: ${userText}`);
  await runToolLoop(userText);
}

/**
 * 交互模式：启动 readline 循环，持续对话。
 *
 * 内置命令：
 * - /exit：退出演示
 * - /clear：清空 system 之外的上下文（避免上下文无限增长、也方便复现）
 */
async function runInteractiveChat() {
  printWelcome();

  const rl = createInterface({ input, output });

  try {
    while (true) {
      const answer = (await rl.question('你: ')).trim();

      if (!answer) {
        continue;
      }

      if (answer === '/exit') {
        console.log('\n本次 Function Calling 演示结束。');
        break;
      }

      if (answer === '/clear') {
        messages.splice(1);
        console.log('\n上下文已清空。\n');
        continue;
      }

      await runToolLoop(answer);
    }
  } finally {
    rl.close();
  }
}

/**
 * 启动入口：
 * - 有 argv：单轮模式
 * - 无 argv：交互模式
 */
try {
  const initialText = process.argv.slice(2).join(' ').trim();

  if (initialText) {
    await runSingleTurn(initialText);
  } else {
    await runInteractiveChat();
  }
} catch (error) {
  console.log('\n❌ 运行失败：');
  console.log(error);
  process.exit(1);
}
