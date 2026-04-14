import { Diagnosis } from '../models/Diagnosis.js';

/**
 * POST /api/diagnosis
 * 用户点"结束诊断"时调用，保存本次诊断结果
 * body: { sessionId, finalPerformance, finalAuthenticity, diagnosisTitle, totalMessages }
 */
export async function saveDiagnosis(req, res, next) {
  try {
    const { sessionId, finalPerformance, finalAuthenticity, diagnosisTitle, totalMessages } = req.body;

    if (!sessionId || !diagnosisTitle) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    // upsert：同一 sessionId 重复提交只更新不新增
    await Diagnosis.findOneAndUpdate(
      { sessionId },
      { finalPerformance, finalAuthenticity, diagnosisTitle, totalMessages },
      { upsert: true, new: true }
    );

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/stats
 * 返回所有人的诊断分布，用于结果页展示"你和 X% 的人一样"
 */
export async function getStats(req, res, next) {
  try {
    const total = await Diagnosis.countDocuments();

    const distribution = await Diagnosis.aggregate([
      { $group: { _id: '$diagnosisTitle', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({ total, distribution });
  } catch (err) {
    next(err);
  }
}
