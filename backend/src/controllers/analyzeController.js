import { analyzeWithClaude } from '../services/claudeService.js';

// 撒娇关键词（与前端保持一致，后端做权威判断）
const COQUETTISH = [
  '~', '呀', '呢', '啦', '啊', '哈', '呗', '吖', '呃', '嗯呀', '嘿', '嘚',
  '宝宝', '宝贝', '亲亲', '学宝', '亲爱的', '亲', '宝', '老公', '老婆', '男神', '女神',
  '呜呜', '呜', '呵呵', '嘻嘻', '嗯哼', '哼', '啊呀', '呃呃', '嘿嘿',
  '最最最', '超级', '特别', '非常', '简直', '哎呀', '天哪',
  '委屈', '难受', '伤心', '心疼', '只有你', '都是我的错',
  'qwq', 'Q_Q', '>-<', 'TvT', '😭', '😢', '😖', '😣', '😩',
  '呐~', '啦~', '啊~', '呀~', '廻~', '哈~', '呜~', '嗯~',
];

function hasCoquettishTone(text) {
  return COQUETTISH.some(kw => text.includes(kw));
}

/**
 * POST /api/analyze
 * body: { message: string }
 * 返回: { performance, authenticity, source }
 *   source: 'coquettish' | 'claude' | 'fallback'
 */
export async function analyzeMessage(req, res, next) {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: '参数 message 不能为空' });
    }
    if (message.trim().length === 0) {
      return res.status(400).json({ error: '消息内容不能为空' });
    }
    if (message.length > 500) {
      return res.status(400).json({ error: '消息过长，最多 500 字' });
    }

    // 第一层：撒娇语气直接判定
    if (hasCoquettishTone(message)) {
      return res.json({ performance: 80, authenticity: 20, source: 'coquettish' });
    }

    // 第二层：Claude API 分析
    const score = await analyzeWithClaude(message);
    if (score !== null) {
      return res.json({ performance: score, authenticity: 100 - score, source: 'claude' });
    }

    // 第三层：API 失败降级，返回中间值
    res.json({ performance: 50, authenticity: 50, source: 'fallback' });
  } catch (err) {
    next(err);
  }
}
