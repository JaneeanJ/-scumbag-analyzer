import { analyzeWithClaude, generateGirlfriendReply } from '../services/claudeService.js';

// 撒娇关键词（后端做权威判断）
const COQUETTISH = [
  '~', '呀', '呢', '啦', '啊', '哈', '呗', '吖', '呃', '嗯呀', '嘿', '嘚',
  '宝宝', '宝贝', '亲亲', '学宝', '亲爱的', '亲', '宝', '老公', '老婆', '男神', '女神',
  '呜呜', '呜', '呵呵', '嘻嘻', '嗯哼', '哼', '啊呀', '呃呃', '嘿嘿',
  '最最最', '超级', '特别', '非常', '简直', '哎呀', '天哪',
  '委屈', '难受', '伤心', '心疼', '只有你', '都是我的错',
  'qwq', 'Q_Q', '>-<', 'TvT', '😭', '😢', '😖', '😣', '😩',
  '呐~', '啦~', '啊~', '呀~', '嘻~', '哈~', '呜~', '嗯~',
];

function hasCoquettishTone(text) {
  return COQUETTISH.some(kw => text.includes(kw));
}

/**
 * POST /api/analyze
 * body: {
 *   message: string,
 *   history: Array<{role: 'user'|'assistant', content: string}>  // 最近的对话历史
 * }
 * 返回: { performance, authenticity, source, girlfriendReply }
 */
export async function analyzeMessage(req, res, next) {
  try {
    const { message, history = [], moments = [], gfType = 'warm' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: '参数 message 不能为空' });
    }
    if (message.trim().length === 0) {
      return res.status(400).json({ error: '消息内容不能为空' });
    }
    if (message.length > 500) {
      return res.status(400).json({ error: '消息过长，最多 500 字' });
    }

    // ── 第一步：确定虚伪分数 ──────────────────────────────
    let performance, authenticity, source;

    if (hasCoquettishTone(message)) {
      performance = 80;
      authenticity = 20;
      source = 'coquettish';
    } else {
      const score = await analyzeWithClaude(message, { history, moments });
      if (score !== null) {
        performance = score;
        authenticity = 100 - score;
        source = 'claude';
      } else {
        performance = 50;
        authenticity = 50;
        source = 'fallback';
      }
    }

    // ── 第二步：生成女友回复 ──────────────────────────────
    // 把当前这条用户消息追加到历史，让女友能看到完整上下文
    const fullHistory = [
      ...history,
      { role: 'user', content: message },
    ];

    const girlfriendReply = await generateGirlfriendReply(fullHistory, performance, moments, gfType);

    res.json({ performance, authenticity, source, girlfriendReply });
  } catch (err) {
    next(err);
  }
}
