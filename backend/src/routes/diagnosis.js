import { Router } from 'express';
import { saveDiagnosis, getStats } from '../controllers/diagnosisController.js';

const router = Router();

router.post('/', saveDiagnosis);
router.get('/stats', getStats);

export default router;
