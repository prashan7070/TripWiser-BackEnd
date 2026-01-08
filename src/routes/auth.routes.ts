import {Router} from "express"

import {handleRefreshToken,login,register,googleLogin ,forgotPassword, resetPassword , changePassword} from "../controllers/auth.controller"

import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import {Role} from "../models/User"

const router = Router()

router.post("/register" , register)
router.post("/login" , login)
router.post("/refresh", handleRefreshToken)
router.post('/google', googleLogin);


router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.put('/change-password',authenticate,changePassword); 

export default router