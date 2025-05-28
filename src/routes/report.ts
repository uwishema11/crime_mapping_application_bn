import express from 'express';
import protectedRoute from '../middleware/verifyAuth';
import verifyAdmin from '../middleware/verifyAdmin';

import {
  createReportController,
  deleteReportController,
  getAllReportsController,
  getReportByIdController,
  getUserReportsController,
  updateReportStatusController,
  updateReportController,
} from '../controllers/report';

const router = express.Router();

router.post('/create', protectedRoute, createReportController);
router.get('/all', protectedRoute, verifyAdmin, getAllReportsController);
router.patch('/edit/:id', protectedRoute, updateReportController);

router.get('/my-reports', protectedRoute, getUserReportsController);
router.get('/:id', protectedRoute, getReportByIdController);

router.patch(
  '/:id/status',
  protectedRoute,
  verifyAdmin,
  updateReportStatusController
);

router.delete('/delete/:id', protectedRoute, deleteReportController);

export default router;
