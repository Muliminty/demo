import OpenAI from 'openai';
import { aiConfig } from './get-ai-config.mjs';

const { apiKey, baseURL, model, provider } = aiConfig;

console.log('正在检查 Node.js AI 环境配置...');
console.log(`✅ 当前厂商: ${provider}`);
console.log(`✅ API Key: ${apiKey.slice(0, 6)}******${apiKey.slice(-4)}`);
console.log(`📡 Base URL: ${baseURL}`);
console.log(`🤖 模型: ${model}`);

const client = new OpenAI({
  apiKey,
  baseURL,
});

try {
  const response = await client.chat.completions.create({
    model,
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
