import { Router } from 'express';
import { postMoment } from '../controllers/momentsController.js';

const router = Router();

router.post('/', postMoment);

export default router;
