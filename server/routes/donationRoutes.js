import express from 'express';
import { getDonations, createDonation } from '../controllers/donationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getDonations);
router.post('/', protect, createDonation);

export default router;
