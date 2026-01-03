import express from 'express';
import { hotelController } from '../controllers/hotel.controller';
const router = express.Router();

router.get('/', hotelController.getHotels);

export default router;