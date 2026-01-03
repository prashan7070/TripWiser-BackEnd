import express from 'express';
import { tripController } from '../controllers/trip.controller';
import { authenticate } from '../middleware/auth';
import { upload } from '../config/cloudinary'; 
import { Role } from '../models/User';
import { requireRole } from '../middleware/role';

const router = express.Router();


router.post('/create', authenticate ,requireRole([Role.USER, Role.ADMIN]) ,  upload.single('coverImage'), tripController.createTrip);

router.get('/', authenticate, requireRole([Role.USER, Role.ADMIN]) ,  tripController.getUserTrips);
router.get('/:id',authenticate, requireRole([Role.USER, Role.ADMIN]) , tripController.getTripById);
router.delete('/:id',authenticate, requireRole([Role.USER, Role.ADMIN]) , tripController.deleteTrip);

export default router;