import express from 'express';
import { aiController } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { generateAiTripSchema } from '../validations/ai.validation';
import { aiRateLimiter } from '../middleware/rateLimiter';

const router = express.Router();


router.post('/generate', aiRateLimiter, authenticate, validate(generateAiTripSchema), aiController.generateTrip);

export default router;