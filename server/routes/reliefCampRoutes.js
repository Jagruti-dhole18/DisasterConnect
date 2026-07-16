import express from 'express';
import { getReliefCamps, getReliefCamp, createReliefCamp, updateReliefCamp, deleteReliefCamp } from '../controllers/reliefCampController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getReliefCamps);
router.get('/:id', getReliefCamp);
router.post('/', protect, authorize('ngo', 'admin'), createReliefCamp);
router.put('/:id', protect, authorize('ngo', 'admin'), updateReliefCamp);
router.delete('/:id', protect, authorize('ngo', 'admin'), deleteReliefCamp);

export default router;
