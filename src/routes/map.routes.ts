import express from 'express';
import { mapController } from '../controllers/map.controller';
const router = express.Router();

router.get('/search', mapController.searchLocation);

export default router;