import { analyzeMoment } from '../services/claudeService.js';

/**
 * POST /api/moments
 * body: { text: string, images: [{base64, mediaType}] }
 * 返回: { renShe, ambiguity, isPerformance, summary, performanceDelta, authenticityDelta }
 */
export async function postMoment(req, res, next) {
  try {
    const { text = '', images = [] } = req.body;

    if (!text.trim() && images.length === 0) {
      return res.status(400).json({ error: '朋友圈不能为空' });
    }

    const result = await analyzeMoment(text, images);

    // 朋友圈对主维度的影响：根据 renShe + ambiguity 强度动态计算
    // intensity 越高（图片/文案越刻意），对分数影响越大
    const intensity = (result.renShe + result.ambiguity) / 2; // 0-100
    const baseDelta = Math.round(6 + (intensity / 100) * 12); // 6-18
    const performanceDelta  = result.isPerformance ?  baseDelta : -Math.round(baseDelta * 0.55);
    const authenticityDelta = result.isPerformance ? -Math.round(baseDelta * 0.55) : baseDelta;

    res.json({ ...result, performanceDelta, authenticityDelta });
  } catch (err) {
    next(err);
  }
}
