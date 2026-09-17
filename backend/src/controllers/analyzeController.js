import { analyzeWithClaude, generateGirlfriendReply } from '../services/claudeService.js';

/**
 * POST /api/analyze
 * body: {
 *   message: string,
 *   history: Array<{role: 'user'|'assistant', content: string}>  // 最近的对话历史
 * }
 * 返回: { performance, authenticity, source, girlfriendReply, affectionDelta }
 */
export async function analyzeMessage(req, res, next) {
  try {
    const { message, history = [], moments = [], gfType = 'warm', exposed = false } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: '参数 message 不能为空' });
    }
    if (message.trim().length === 0) {
      return res.status(400).json({ error: '消息内容不能为空' });
    }
    if (message.length > 500) {
      return res.status(400).json({ error: '消息过长，最多 500 字' });
    }

    // ── 第一步：确定虚伪分数（全部交给 Claude 判断）────────
    let performance, authenticity, source;

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

    // ── 第二步：生成女友回复 ──────────────────────────────
    // 把当前这条用户消息追加到历史，让女友能看到完整上下文
    const fullHistory = [
      ...history,
      { role: 'user', content: message },
    ];

    const gfResult = await generateGirlfriendReply(fullHistory, performance, moments, gfType, exposed);

    res.json({
      performance,
      authenticity,
      source,
      girlfriendReply: gfResult.reply,
      affectionDelta: gfResult.affectionDelta,
    });
  } catch (err) {
    next(err);
  }
}
