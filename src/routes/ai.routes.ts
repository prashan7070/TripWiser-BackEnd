import express from 'express';
import { aiController } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();


router.post('/generate', authenticate, aiController.generateTrip);

export default router;