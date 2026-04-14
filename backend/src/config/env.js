import 'dotenv/config';

const required = ['ANTHROPIC_API_KEY', 'MONGODB_URI'];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`[env] 缺少必要环境变量: ${key}`);
    process.exit(1);
  }
}

export const env = {
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  MONGODB_URI:       process.env.MONGODB_URI,
  PORT:              parseInt(process.env.PORT ?? '3001', 10),
  NODE_ENV:          process.env.NODE_ENV ?? 'development',
  FRONTEND_ORIGINS:  (process.env.FRONTEND_ORIGINS ?? 'http://localhost:5173')
                       .split(',')
                       .map(s => s.trim()),
};
