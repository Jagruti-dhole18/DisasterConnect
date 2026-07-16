import express from 'express';
import { createRequest, getRequests, getRequest, updateRequest, getMyRequests, getMyMissions } from '../controllers/requestController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getRequests)
  .post(protect, authorize('citizen'), createRequest);

router.route('/citizen/me')
  .get(protect, authorize('citizen'), getMyRequests);

router.route('/volunteer/me')
  .get(protect, authorize('volunteer'), getMyMissions);

router.route('/:id')
  .get(protect, getRequest)
  .put(protect, updateRequest);

export default router;
