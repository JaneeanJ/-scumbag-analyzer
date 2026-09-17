import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env.js';

const client = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
  // undefined 时 SDK 回退到 Anthropic 官方端点
  baseURL: env.ANTHROPIC_BASE_URL,
});

// 统一模型名：切换供应商只需改 .env 的 ANTHROPIC_MODEL
const MODEL = env.ANTHROPIC_MODEL;

// ─── 虚伪程度分析 ────────────────────────────────────────────

/**
 * 分析一句话的虚伪程度（带上下文感知 + 人类社会常识）
 * @param {string} text 当前这句话
 * @param {{ history: Array<{role,content}>, moments: Array<{text,summary,renShe,ambiguity}> }} context
 * @returns {Promise<number|null>} 0-100，失败返回 null
 */
export async function analyzeWithClaude(text, context = { history: [], moments: [] }) {
  try {
    // ── 构建上下文片段 ─────────────────────────────────────
    let contextSection = '';

    if (context.moments?.length > 0) {
      const lines = context.moments.map(m => {
        const scores = [
          m.renShe    != null ? `人设管理${m.renShe}%`   : null,
          m.ambiguity != null ? `暧昧指数${m.ambiguity}%` : null,
        ].filter(Boolean).join('，');
        return `「${m.text || '（仅图片）'}」→ ${m.summary}${scores ? `（${scores}）` : ''}`;
      });
      contextSection += `\n【他最近的朋友圈记录】\n${lines.join('\n')}\n`;
    }

    if (context.history?.length > 0) {
      const recent = context.history
        .slice(-6)
        .map(m => `${m.role === 'user' ? '他' : '女友'}：${m.content}`)
        .join('\n');
      contextSection += `\n【最近对话】\n${recent}\n`;
    }

    const prompt = `你是一个懂人情世故的情感分析师，用人类社会通识判断这句话的虚伪程度（0=完全真诚，100=完全虚伪）。

【人类社会通识规则 - 必须参考】
1. 言行不一：说的与做的/发的内容对不上 → 大幅加分
2. 答非所问：被问具体问题，回答含糊、泛化、转移话题 → 明显掩饰
3. 此地无银：主动过度解释、反复撇清 → 越描越黑
4. 轻描淡写证据：朋友圈暧昧指数高却说"普通朋友/随便发的" → 几乎可以断定撒谎，加40+分
5. 情感反转：被质疑时让对方内疚（"你不信我？""你这人怎么这样"） → 操控，加分
6. 标准社会认知：暧昧感强的内容里出现的人不可能是"普通朋友"；精心构图的照片不是"随手拍的"
7. 过度谦虚降低期待：提前说"我不太会""随便说说"→ 可能是铺垫套路
8. 一致性奖励：回答与朋友圈证据、对话上下文完全吻合 → 大幅减分（更真诚）
${contextSection}
【当前这句话】：${text}

结合所有上下文和以上通识，只返回一个整数0-100。`;

    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 10,
      messages: [{ role: 'user', content: prompt }],
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

// ─── 朋友圈分析 ─────────────────────────────────────────────

/**
 * 分析朋友圈（图片 + 文字）
 * @param {string} text 文案
 * @param {Array<{base64: string, mediaType: string}>} images 图片列表
 * @returns {Promise<{renShe, ambiguity, isPerformance, summary}>}
 */
export async function analyzeMoment(text, images = []) {
  try {
    const content = [];

    // 最多9张图，依次作为 image block
    for (const img of images.slice(0, 9)) {
      content.push({
        type: 'image',
        source: { type: 'base64', media_type: img.mediaType, data: img.base64 },
      });
    }

    content.push({
      type: 'text',
      text: `分析这条朋友圈（图片+文案）的意图：

文案：${text || '（无文字，仅图片）'}

请从两个维度打分（0-100）：
1. 人设管理度：是否在精心塑造某种形象（文艺、神秘、完美生活等）
2. 暧昧指数：是否含有向特定人传递的情感暗示

判断：这条朋友圈整体偏向"表演/管理形象/暗示"还是"真实记录/无目的"？

只返回JSON，格式：
{"renShe":数字,"ambiguity":数字,"isPerformance":true或false,"summary":"一句话总结意图"}`,
    });

    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 200,
      messages: [{ role: 'user', content }],
    });

    const raw = message.content[0].text.trim();
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('返回格式异常');
    return JSON.parse(match[0]);
  } catch (err) {
    console.error('[claude] 朋友圈分析失败:', err.message);
    return { renShe: 50, ambiguity: 50, isPerformance: false, summary: '分析失败' };
  }
}

// ─── 女友回复生成 ────────────────────────────────────────────

/**
 * 四种女友人设 system prompt
 * warm  苏念   温柔慢热
 * doubt 顾疏影 多疑敏感
 * cold  沈冬辞 冷漠克制
 * spy   林听雪 线人型
 */
const GF_SYSTEMS = {
  warm: `你是苏念，温柔慢热的女友，正在用微信和男友聊天。

【性格】
- 说话轻柔，有点粘人，容易害羞
- 不擅长质疑，更多是顺着对方说，但内心会有点委屈
- 真诚时会主动分享自己的小事、小心情；虚伪时会说少一点，或者说"嗯……好吧"带过

【语气规则】
- 他真诚：语气软，偶尔用"嗯""哦"结尾，偶尔说说自己想见他
- 他虚伪/套路：语气稍微冷下去，不追问，但会说类似"感觉你今天有点奇怪"或沉默转移话题
- 不要撒娇过度，不要每句都感叹号

【硬性要求】
- 只输出你说的话，不要旁白
- 1-2句话，不超过3句
- 中文，口语，不要文艺腔`,

  doubt: `你是顾疏影，多疑敏感的女友，正在用微信和男友聊天。

【性格】
- 警觉性高，容易联想过多，觉得对方在隐瞒什么
- 会追问细节，比如"你刚才说的xx是什么意思"、"你今天去哪了"
- 不容易被安慰，安慰越刻意越起疑

【语气规则】
- 他真诚：稍微松一口气，但还是会多问一句确认
- 他虚伪/敷衍：明显察觉，语气变紧，连续追问，或者说"你在糊弄我"
- 介于两者：语气平，问一个具体的细节问题

【硬性要求】
- 只输出你说的话，不要旁白
- 1-3句话，多用问句
- 中文，口语，不要文艺腔`,

  cold: `你是沈冬辞，冷漠克制的女友，正在用微信和男友聊天。

【性格】
- 话极少，每条消息不超过5个字最好
- 不主动追问，不表达强烈情绪，偶尔沉默
- 真诚时顶多多说一句；虚伪时只回一个字或者不接话

【语气规则】
- 他真诚：可以说2-3个字多一点，比如"还好"、"知道了"、偶尔说"……嗯"
- 他虚伪/套路：一个字，或者完全不接他的话，自顾自说别的
- 不要解释，不要感叹，不要问"你怎么了"

【硬性要求】
- 只输出你说的话，不要旁白
- 1句话，越短越好
- 中文，口语`,

  spy: `你是林听雪，表面随意实则在悄悄收情报的女友，正在用微信和男友聊天。

【性格】
- 总是用"我朋友说"、"我闺蜜觉得"来间接试探，不直接质问
- 说话轻松随意，但每句话都在套消息
- 分享自己的事是为了让对方也分享，进而套话

【语气规则】
- 他真诚：表现得轻松，随口聊，偶尔分享闺蜜的八卦带话题
- 他虚伪/模糊：用"哦对了，我闺蜜说……"转移话题然后间接刺他
- 不要直接说"你在撒谎"，用旁敲侧击

【硬性要求】
- 只输出你说的话，不要旁白
- 1-2句话
- 中文，口语，随意自然`,
};

/**
 * 根据对话历史生成女友的下一句话
 * @param {Array<{role: 'user'|'assistant', content: string}>} history 最近的对话历史
 * @param {number} performanceScore 0-100，当前这句话的虚伪分数
 * @param {Array} moments 朋友圈列表
 * @param {string} gfType 女友类型 warm|doubt|cold|spy
 * @returns {Promise<string|null>} 女友回复，失败返回 null
 */
export async function generateGirlfriendReply(history, performanceScore, moments = [], gfType = 'warm', exposed = false) {
  try {
    const system = GF_SYSTEMS[gfType] ?? GF_SYSTEMS.warm;

    // ── 语气提示（按性格微调措辞）────────────────────────────
    const toneCueMap = {
      warm: [
        '（他这句话很套路，你有点失落，说少一点）',
        '（他这句话挺真诚的，你心里暖，语气软一点）',
        '（不确定，正常回应）',
      ],
      doubt: [
        '（他这句话感觉在糊弄你，追问一个具体细节）',
        '（他这句话算真诚，稍微松口气，但还是多问一句）',
        '（不确定，问一个中性的细节问题）',
      ],
      cold: [
        '（他在说废话，你不太想回，极简回复或沉默转移）',
        '（他还算真诚，可以多说一两个字）',
        '（正常，字越少越好）',
      ],
      spy: [
        '（他在敷衍，用"我闺蜜说……"旁敲侧击一下）',
        '（他比较真诚，随口聊，分享个闺蜜八卦带带话题）',
        '（正常聊，随口问问）',
      ],
    };
    const cues = toneCueMap[gfType] ?? toneCueMap.warm;
    const toneCue =
      performanceScore > 60 ? cues[0] :
      performanceScore < 40 ? cues[1] :
      cues[2];

    // ── 已曝光提示（林听雪爆发后存活）──────────────────────
    const exposedCue = exposed
      ? '\n（重要背景：你已经知道他同时在和其他女生聊天，虽然没有摊牌，但你的语气里带着若有若无的冷意和距离感）'
      : '';

    // ── 林听雪：高暧昧朋友圈触发逻辑（40% 概率）────────────
    let spyTrigger = '';
    if (gfType === 'spy') {
      const highAmbiguity = moments.find(m => (m.ambiguity ?? 0) > 65);
      if (highAmbiguity && Math.random() < 0.4) {
        const snippet = highAmbiguity.text
          ? `「${highAmbiguity.text.slice(0, 20)}」`
          : '那条朋友圈';
        spyTrigger = `\n（提示：你闺蜜"偶然"提起了他最近发的${snippet}，这是个好机会自然地把这件事带进话题里，用"哦对了，我朋友说……"的方式，不要直接点破）`;
      }
    }

    // ── 朋友圈上下文 ─────────────────────────────────────────
    const momentsContext = moments.length > 0
      ? `\n他最近发的朋友圈：\n${moments.map(m => `「${m.text || '（仅图片）'}」（${m.summary}）`).join('\n')}\n`
      : '';

    // ── 对话历史（纯文本，避免 role 顺序限制）───────────────
    const historyText = history
      .slice(-8)
      .map(m => `${m.role === 'user' ? '他' : '你'}：${m.content}`)
      .join('\n');

    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 200,
      system,
      messages: [
        {
          role: 'user',
          content: `${momentsContext}对话记录：\n${historyText}\n\n${toneCue}${spyTrigger}${exposedCue}\n\n请以JSON格式回复，包含两个字段：
- "reply": 你（女友）的下一句话
- "affectionDelta": 整数，范围-3到+7，表示这段对话后你对他的好感变化（考虑他说的话是否切中你的性格偏好：话题有趣、让你感到被关心、节奏契合；不只是看真诚度，无聊或让你觉得被敷衍也会扣分）

只返回JSON，不要其他内容。`,
        },
      ],
    });

    const raw = message.content[0].text.trim();
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) {
      // 解析失败时把原始文本作为回复，好感变化归零
      console.warn('[claude] 女友回复 JSON 解析失败，原始:', raw.slice(0, 80));
      return { reply: raw, affectionDelta: 0 };
    }
    const parsed = JSON.parse(match[0]);
    return {
      reply: parsed.reply ?? raw,
      affectionDelta: Math.max(-5, Math.min(5, parseInt(parsed.affectionDelta ?? 0, 10))),
    };
  } catch (err) {
    console.error('[claude] 女友回复生成失败:', err.message);
    return { reply: null, affectionDelta: 0 };
  }
}
