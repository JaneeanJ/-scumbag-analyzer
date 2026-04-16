import express from 'express';
import { env } from './config/env.js';
import { connectDB } from './config/database.js';
import { corsMiddleware } from './middleware/corsMiddleware.js';
import { errorHandler } from './middleware/errorHandler.js';
import analyzeRouter from './routes/analyze.js';
import diagnosisRouter from './routes/diagnosis.js';
import momentsRouter from './routes/moments.js';

const app = express();

// 中间件
app.use(corsMiddleware);
app.use(express.json({ limit: '20mb' }));

// 路由
app.use('/api/analyze', analyzeRouter);
app.use('/api/diagnosis', diagnosisRouter);
app.use('/api/moments', momentsRouter);

// 健康检查（Render / Railway 部署时会 ping 这个接口）
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// 全局错误处理（必须放最后）
app.use(errorHandler);

// 启动
connectDB().then(() => {
  app.listen(env.PORT, () => {
    console.log(`[server] 运行在 http://localhost:${env.PORT}`);
  });
});
