import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('[db] MongoDB 连接成功');
  } catch (err) {
    console.error('[db] MongoDB 连接失败:', err.message);
    process.exit(1);
  }
}
