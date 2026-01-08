import {Router} from "express"

import {handleRefreshToken,login,register,googleLogin} from "../controllers/auth.controller"

import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import {Role} from "../models/User"

const router = Router()

router.post("/register" , register)
router.post("/login" , login)
router.post("/refresh", handleRefreshToken)
router.post('/google', googleLogin);

export default router