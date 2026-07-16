import express from 'express';
import { getMissingPersons, getMissingPerson, createMissingPerson, updateMissingPerson } from '../controllers/missingPersonController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getMissingPersons);
router.get('/:id', getMissingPerson);
router.post('/', protect, createMissingPerson);
router.put('/:id', protect, updateMissingPerson);

export default router;
