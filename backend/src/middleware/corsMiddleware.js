import cors from 'cors';
import { env } from '../config/env.js';

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // 允许无 origin 的请求（如 curl、Postman 本地测试）
    if (!origin) return callback(null, true);
    if (env.FRONTEND_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error(`CORS 拒绝来源: ${origin}`));
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
});
