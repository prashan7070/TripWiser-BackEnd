import {Router} from "express"

import {handleRefreshToken,login,register,googleLogin ,forgotPassword, resetPassword , changePassword} from "../controllers/auth.controller"

import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "../validations/auth.validation";
import {Role} from "../models/User"

const router = Router()

router.post("/register", validate(registerSchema), register)
router.post("/login", validate(loginSchema), login)
router.post("/refresh", handleRefreshToken)
router.post('/google', googleLogin);


router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.put('/reset-password/:token', validate(resetPasswordSchema), resetPassword);
router.put('/change-password', authenticate, changePassword); 

export default router