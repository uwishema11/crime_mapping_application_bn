import express from 'express';
import { celebrate, Joi } from 'celebrate';
import protectedRoute from '../middleware/verifyAuth';
import verifyAdmin from '../middleware/verifyAdmin';
import { fetchPrediction } from '../controllers/report';

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
  fetchPendingReportsByStatus,
  fetchGroupedReportsByCategory,
  fetchGroupedUserReportsByCategory,
  fetchGroupedUserReportsByMonth,
  fetchTrendingAreas,
  fetchTopCrimePerLocation,
} from '../controllers/report';

const router = express.Router();

router.post('/create', protectedRoute, createReportController);
router.get('/all', getAllReportsController);
router.patch('/edit/:id', protectedRoute, updateReportController);

router.get('/single-user/my-reports', protectedRoute, getUserReportsController);
router.get('/get/:id', protectedRoute, getReportByIdController);

router.patch(
  '/update/status/:id',
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
router.get('/grouped/pending-status', fetchPendingReportsByStatus);

router.delete('/delete/:id', protectedRoute, deleteReportController);

router.get('/grouped/category', protectedRoute, fetchGroupedReportsByCategory);
router.get('/user/stats', protectedRoute, fetchGroupedUserReportsByCategory);
router.get('/user/monthly', protectedRoute, fetchGroupedUserReportsByMonth);
router.get('/location/top-crime', fetchTopCrimePerLocation);
router.get('/prediction', protectedRoute, verifyAdmin, fetchPrediction);

export default router;
