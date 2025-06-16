import express from 'express';
import { celebrate, Joi } from 'celebrate';
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
  fetchAllRecentReports,
  fetchGroupedReportsByMonth,
  fetctchGroupReportsByStatus,
} from '../controllers/report';

const router = express.Router();

router.post('/create', protectedRoute, createReportController);
router.get('/all', protectedRoute, verifyAdmin, getAllReportsController);
router.patch('/edit/:id', protectedRoute, updateReportController);

router.get('/my-reports', protectedRoute, getUserReportsController);
router.get('/get/:id', protectedRoute, getReportByIdController);

router.patch(
  '/:id/status',
  protectedRoute,
  verifyAdmin,
  updateReportStatusController
);

router.get('/recents', protectedRoute, verifyAdmin, fetchAllRecentReports);
router.get(
  '/grouped/monthly',
  protectedRoute,
  verifyAdmin,
  fetchGroupedReportsByMonth
);
router.get(
  '/grouped/status',
  protectedRoute,
  verifyAdmin,
  fetctchGroupReportsByStatus
);

router.delete('/delete/:id', protectedRoute, deleteReportController);
export default router;
