/**
 * 根据 .env 中的 AI_PROVIDER 解析出当前使用的 apiKey、baseURL、model
 * 其他脚本可 require 或 import 此文件复用配置
 */
import 'dotenv/config';

const PROVIDERS = {
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
    defaultModel: 'deepseek-chat',
  },
  aliyun: {
    apiKey: process.env.ALIYUN_API_KEY,
    baseURL: process.env.ALIYUN_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    defaultModel: 'qwen-plus',
  },
};

const providerName = (process.env.AI_PROVIDER || 'deepseek').toLowerCase();
const overrideModel = process.env.AI_MODEL?.trim();

const provider = PROVIDERS[providerName];
if (!provider) {
  throw new Error(`未知的 AI_PROVIDER: ${process.env.AI_PROVIDER}，可选: ${Object.keys(PROVIDERS).join(', ')}`);
}
if (!provider.apiKey) {
  throw new Error(`未配置 ${providerName.toUpperCase()}_API_KEY，请在 .env 中填写。`);
}

export const aiConfig = {
  provider: providerName,
  apiKey: provider.apiKey,
  baseURL: provider.baseURL,
  model: overrideModel || provider.defaultModel,
};
