import express from 'express'
import {protect} from '../middleware/authMiddleware.js';
import {authLimiter} from '../middleware/rateLimiter.js'
import { getMe, logout, register,login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register',authLimiter,register);
router.post('/login',authLimiter,login);
router.post('/logout',logout)

router.get('/me',protect,getMe)

export default router;