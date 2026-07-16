import express from 'express';
import { getUsers, deleteUser, approveNGO, getPendingApprovals, getAnalytics, getMessages, deleteMessage } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/users', getUsers);
router.get('/pending-approvals', getPendingApprovals);
router.get('/analytics', getAnalytics);
router.get('/messages', getMessages);
router.delete('/users/:id', deleteUser);
router.delete('/messages/:id', deleteMessage);
router.put('/ngos/:id/approve', approveNGO);

export default router;
