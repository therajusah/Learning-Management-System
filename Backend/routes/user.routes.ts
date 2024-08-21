import express from 'express';
import { register, login, logout, getProfile } from '../controllers/user.controllers';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getProfile);

export default router;
