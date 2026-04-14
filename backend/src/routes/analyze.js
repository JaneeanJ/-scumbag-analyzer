import { Router } from 'express';
import { analyzeLimiter } from '../middleware/rateLimiter.js';
import { analyzeMessage } from '../controllers/analyzeController.js';

const router = Router();

router.post('/', analyzeLimiter, analyzeMessage);

export default router;
