import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env.js';

const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

const PROMPT = `你是一个中文情感分析专家，擅长识别"茶艺虚伪"和"真诚坦白"。分析这句话的"虚伪程度"，返回0-100的分数。
【第一层】识别语气成分
- 撒娇语气 → +30分
- 夸张表达 → +20分
- 装可怜/制造依赖感 → +25分
- 模糊承诺 → +20分
- 制造内疚感 → +15分

【第二层】评估行动承诺
- 真诚的行动词 → -30分
- 具体承诺 → -25分
- 承认自己不足 → -25分
- 坦白心声 → -20分
- 只说不做的"承诺" → +35分

【第三层】整体"意图"评估
检查是否在"制造幻想"、"制造内疚"、"博同情"、"套路感强"

返回ONLY一个数字0-100。`;

/**
 * 调用 Claude 分析虚伪程度
 * @param {string} text 用户输入的一句话
 * @returns {Promise<number|null>} 0-100 的分数，失败返回 null
 */
export async function analyzeWithClaude(text) {
  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 50,
      messages: [{ role: 'user', content: `${PROMPT}\n\n句子：${text}` }],
    });

    const raw = message.content[0].text.trim();
    const score = parseInt(raw, 10);

    if (isNaN(score)) {
      console.warn('[claude] 返回值不是数字:', raw);
      return null;
    }

    return Math.max(0, Math.min(100, score));
  } catch (err) {
    console.error('[claude] API 调用失败:', err.message);
    return null;
  }
}
