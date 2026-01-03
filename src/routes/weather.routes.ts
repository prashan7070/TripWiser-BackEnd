import express from 'express';
import { weatherController } from '../controllers/weather.controller';
const router = express.Router();

router.get('/', weatherController.getWeather);

export default router;