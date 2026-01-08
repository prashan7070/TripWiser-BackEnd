import express from 'express';
import { attractionController } from '../controllers/attraction.controller';

const router = express.Router();

router.get('/', attractionController.getAttractions);

export default router;