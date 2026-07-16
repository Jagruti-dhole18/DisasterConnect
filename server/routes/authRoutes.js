import express from 'express';
import { register, login, refreshToken, forgotPassword, resetPassword, verifyEmail, getMe, updateProfile, resendVerificationEmail } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification-email', authLimiter, resendVerificationEmail);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);

export default router;
