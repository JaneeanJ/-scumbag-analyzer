/**
 * Express 全局错误处理中间件（必须是4个参数）
 * 所有 next(err) 最终都到这里
 * 统一格式返回，不把堆栈信息泄露给前端
 */
export function errorHandler(err, req, res, next) {
  const status = err.status ?? 500;
  const message = err.message ?? '服务器内部错误';

  if (status === 500) {
    console.error('[error]', err);
  }

  res.status(status).json({ error: message });
}
