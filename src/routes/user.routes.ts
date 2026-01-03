import express from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { upload } from '../config/cloudinary';

const router = express.Router();


router.get('/me',authenticate, userController.getMe);


router.put('/update', authenticate, upload.single('avatar'), userController.updateUser);

export default router;