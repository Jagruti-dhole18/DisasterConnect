import express from 'express';
import { getVolunteers, getVolunteer, updateVolunteer, verifyVolunteer } from '../controllers/volunteerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getVolunteers);
router.get('/:id', protect, getVolunteer);
router.put('/me', protect, authorize('volunteer'), updateVolunteer);
router.put('/:id/verify', protect, authorize('admin'), verifyVolunteer);

export default router;
