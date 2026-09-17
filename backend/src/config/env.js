import dotenv from 'dotenv';

// 本地开发：以 .env 为唯一配置来源，覆盖系统环境变量
// 原因：本机 Windows 用户级环境变量里全局设置了 ANTHROPIC_*，会把项目配置顶掉
// 生产环境：以平台注入的环境变量为准（Render 上不存在 .env 文件，此处实际不生效）
dotenv.config({ override: process.env.NODE_ENV !== 'production' });

const required = ['ANTHROPIC_API_KEY', 'MONGODB_URI'];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`[env] 缺少必要环境变量: ${key}`);
    process.exit(1);
  }
}

export const env = {
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  // 留空则由 SDK 使用 Anthropic 官方端点；用 DeepSeek 时填 https://api.deepseek.com/anthropic
  ANTHROPIC_BASE_URL: process.env.ANTHROPIC_BASE_URL || undefined,
  // 当前供应商的模型名（DeepSeek 下用 deepseek-chat：纯文本输出且支持图片）
  ANTHROPIC_MODEL:   process.env.ANTHROPIC_MODEL ?? 'deepseek-chat',
  MONGODB_URI:       process.env.MONGODB_URI,
  PORT:              parseInt(process.env.PORT ?? '3001', 10),
  NODE_ENV:          process.env.NODE_ENV ?? 'development',
  FRONTEND_ORIGINS:  (process.env.FRONTEND_ORIGINS ?? 'http://localhost:5173')
                       .split(',')
                       .map(s => s.trim()),
};
