import express from 'express';
import { sendMessage, sendContactMessage, getMessages, getConversations, markMessageRead } from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, sendMessage);
router.post('/contact', protect, sendContactMessage);
router.get('/between', getMessages);
router.get('/between', protect, getMessages);
router.get('/conversations', protect, getConversations);
router.put('/:id/read', protect, markMessageRead);

export default router;
