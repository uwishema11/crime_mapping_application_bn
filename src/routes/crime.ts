import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  createCrimeController,
  deleteCrimeController,
  getAllCrimesController,
  getCrimeByIdController,
  updateCrimeController,
  getCrimesByCategoryController,
} from '../controllers/crime';

const router = express.Router();

// Public routes
router.get('/', getAllCrimesController);
router.get('/:id', getCrimeByIdController);
router.get('/category/:categoryId', getCrimesByCategoryController);

// Admin only routes
router.use(authenticate);
router.post('/', createCrimeController);
router.put('/:id', updateCrimeController);
router.delete('/:id', deleteCrimeController);

export default router; 