import express from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { upload } from '../config/cloudinary'; // Reuse your existing config

const router = express.Router();

// Protect all routes
router.use(authenticate);

// Get current user info
router.get('/me', userController.getMe);

// Update profile (supports 'avatar' file upload)
router.put('/update', upload.single('avatar'), userController.updateUser);

export default router;