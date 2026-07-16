import express from 'express';
import { getAlerts, createAlert, updateAlert, deleteAlert } from '../controllers/disasterAlertController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAlerts);
router.post('/', protect, authorize('admin'), createAlert);
router.put('/:id', protect, authorize('admin'), updateAlert);
router.delete('/:id', protect, authorize('admin'), deleteAlert);

export default router;
