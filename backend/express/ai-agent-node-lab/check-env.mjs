import 'dotenv/config';
import OpenAI from 'openai';

const apiKey = process.env.DEEPSEEK_API_KEY;
const baseURL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

console.log('正在检查 Node.js AI 环境配置...');

if (!apiKey) {
  console.log('❌ 未找到 DEEPSEEK_API_KEY，请先配置 .env 文件。');
  process.exit(1);
}

console.log(`✅ API Key 已读取: ${apiKey.slice(0, 6)}******${apiKey.slice(-4)}`);
console.log(`📡 当前 Base URL: ${baseURL}`);

const client = new OpenAI({
  apiKey,
  baseURL,
});

try {
  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: '你是一个有用的 AI 助手。' },
      { role: 'user', content: '你好，请用一句话证明你已经连接成功了。' }
    ]
  });

  console.log('\n🎉 连接成功！模型回复：');
  console.log(response.choices[0]?.message?.content ?? '无返回内容');
} catch (error) {
  console.log('\n❌ 连接失败：');
  console.log(error);
  process.exit(1);
}
