import rateLimit from 'express-rate-limit';

// 每个 IP 15 分钟内最多 60 次分析请求
// 防止有人写脚本刷接口，把 Claude 配额耗尽
export const analyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: '请求过于频繁，请 15 分钟后再试' },
});
