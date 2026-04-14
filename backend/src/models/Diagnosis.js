import mongoose from 'mongoose';

// 每次用户点"结束诊断"时存一条记录
// 匿名存储，不收集任何个人信息
const diagnosisSchema = new mongoose.Schema(
  {
    finalPerformance: { type: Number, required: true }, // 最终表演度 0-100
    finalAuthenticity: { type: Number, required: true }, // 最终真诚度 0-100
    diagnosisTitle: { type: String, required: true },    // 诊断标签，如"虚实混淆大师"
    totalMessages: { type: Number, required: true },     // 本次对话消息条数
    sessionId: { type: String, required: true },         // 前端生成的随机会话 ID，防重复提交
  },
  {
    timestamps: true, // 自动加 createdAt / updatedAt
  }
);

// sessionId 唯一，同一个会话只能保存一次诊断结果
diagnosisSchema.index({ sessionId: 1 }, { unique: true });

export const Diagnosis = mongoose.model('Diagnosis', diagnosisSchema);
