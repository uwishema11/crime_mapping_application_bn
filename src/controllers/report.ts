import asyncHandler from '../helpers/asyncHandler';
import { Request, Response } from 'express';
import { ReportStatus } from '@prisma/client';
import { successResponse, errorResponse } from '../helpers/response';
import {
  createReportWithCrime,
  deleteReport,
  getAllReports,
  getReportById,
  getUserReports,
  groupedReportsByMonth,
  groupReportsByStatus,
  recentReports,
  updateReport,
  updateReportStatus,
  groupPendingReportsByStatus,
  groupUserReportsByCategory,
  groupReportsByCategory,
  groupUserReportsByMonth,
  getTrendingArea,
  getTopCrimePerLocation,
  predictNextMonthReports,
} from '../services/report';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const createReportController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const reportData = {
      ...req.body,
      userId,
    };

    const report = await createReportWithCrime(reportData);
    return successResponse(
      res,
      report,
      201,
      'Crime report submitted successfully'
    );
  }
);

export const getAllReportsController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const reports = await getAllReports();
    if (reports.length === 0 || !reports) {
      return errorResponse(res, 'No reports found', 404);
    }
    return successResponse(res, reports, 200, 'Reports retrieved successfully');
  }
);

// Get reports for the logged-in user
export const getUserReportsController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const body = {
      page: parseInt(req.query.page as string) || 1,
      per_page: parseInt(req.query.limit as string) || 10,
      filter: req.query.filter as ReportStatus,
      search: (req.query.search as string) || '',
    };

    const reports = await getUserReports(body, Number(userId));

    return successResponse(
      res,
      reports,
      200,
      'User reports retrieved successfully'
    );
  }
);

// Get a specific report by ID

export const getReportByIdController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const report = await getReportById(Number(id));
    if (!report) {
      return errorResponse(res, 'Report not found', 404);
    }

    // Check if user has permission to view the report
    if (userRole !== 'ADMIN' && report.userId !== userId) {
      return errorResponse(res, 'Unauthorized access', 403);
    }

    return successResponse(res, report, 200, 'Report retrieved successfully');
  }
);

// Update report status (admin only)
export const updateReportStatusController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (req.user?.role !== 'ADMIN') {
      return errorResponse(res, 'Unauthorized access', 403);
    }

    const { id } = req.params;
    const { status } = req.body;

    const report = await updateReportStatus(Number(id), status);
    if (!report) {
      return errorResponse(res, 'Report not found', 404);
    }

    return successResponse(
      res,
      report,
      200,
      'Report status updated successfully'
    );
  }
);

export const deleteReportController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'ADMIN';

    if (!userId) {
      return errorResponse(res, 'User not authenticated', 401);
    }

    const { id } = req.params;

    try {
      const deletedReport = await deleteReport(Number(id), userId, isAdmin);

      if (!deletedReport) {
        return errorResponse(res, 'Report not found', 404);
      }

      return successResponse(res, null, 200, 'Report deleted successfully');
    } catch (error: any) {
      if (error.message.includes('Unauthorized')) {
        return errorResponse(res, error.message, 403);
      }
      throw error;
    }
  }
);

// Update report (for both users and admins)
export const updateReportController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'ADMIN';

    if (!userId) {
      return errorResponse(res, 'User not authenticated', 401);
    }

    const { id } = req.params;
    const updateData = req.body;

    try {
      const updatedReport = await updateReport(
        Number(id),
        updateData,
        userId,
        isAdmin
      );

      if (!updatedReport) {
        return errorResponse(res, 'Report not found', 404);
      }

      return successResponse(
        res,
        updatedReport,
        200,
        'Report updated successfully'
      );
    } catch (error: any) {
      if (error.message.includes('Unauthorized')) {
        return errorResponse(res, error.message, 403);
      }
      throw error;
    }
  }
);

export const fetctchGroupReportsByStatus = asyncHandler(async (req, res) => {
  const reports = await groupReportsByStatus();
  const formattedData = reports.map((report) => ({
    status: report.status,
    count: report._count.status,
  }));
  if (!reports) {
    return errorResponse(res, 'No recent report found', 404);
  }
  successResponse(res, formattedData, 200, 'reports retrieved successfully');
});

export const fetchPendingReportsByStatus = asyncHandler(async (req, res) => {
  const reports = await groupPendingReportsByStatus();
  const formattedData = reports.map((report) => ({
    status: report.status,
    count: report._count.status,
  }));
  if (!reports) {
    return errorResponse(res, 'No recent report found', 404);
  }
  successResponse(res, formattedData, 200, 'reports retrieved successfully');
});

export const fetchGroupedReportsByMonth = asyncHandler(async (req, res) => {
  const reports = await groupedReportsByMonth();

  const isEmpty = !reports || Object.keys(reports).length === 0;

  if (isEmpty) {
    return errorResponse(res, 'No reports found for any month', 404);
  }

  successResponse(res, reports, 200, 'reports retrieved successfully');
});

export const fetchGroupedUserReportsByMonth = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const userId = req.user?.id;
    const reports = await groupUserReportsByMonth(Number(userId));

    const isEmpty = !reports || Object.keys(reports).length === 0;

    if (isEmpty) {
      return errorResponse(res, 'No reports found for any month', 404);
    }

    successResponse(res, reports, 200, 'reports retrieved successfully');
  }
);

export const fetchAllRecentReports = asyncHandler(async (req, res) => {
  const reports = await recentReports();
  if (!reports) {
    return errorResponse(res, 'No recent reports found', 404);
  }
  successResponse(res, reports, 200, 'eports retrieved successfully');
});

export const fetchGroupedReportsByCategory = asyncHandler(async (req, res) => {
  const grouped = await groupReportsByCategory();
  const formatted = grouped.map((item) => ({
    category: item.categoryName,
    count: item._count.categoryName,
  }));
  successResponse(
    res,
    formatted,
    200,
    'Reports grouped by category retrieved successfully'
  );
});

export const fetchGroupedUserReportsByCategory = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    console.log(req.user);
    const userId = req.user?.id;
    const grouped = await groupUserReportsByCategory(Number(userId));
    const formatted = grouped.map((item) => ({
      category: item.categoryName,
      count: item._count.categoryName,
    }));
    successResponse(
      res,
      formatted,
      200,
      'User reports grouped by category retrieved successfully'
    );
  }
);

export const fetchTrendingAreas = asyncHandler(async (req, res) => {
  const areas = await getTrendingArea();
  const formatted = areas.map((area) => ({
    location: area.location,
    count: area._count.id,
  }));
  successResponse(res, formatted, 200, 'Top 5 locations with most crimes');
});

export const fetchTopCrimePerLocation = asyncHandler(async (req, res) => {
  const data = await getTopCrimePerLocation();
  if (!data || data.length === 0) {
    return errorResponse(res, 'No top crimes found', 404);
  }

  successResponse(
    res,
    data.slice(0, 5),
    200,
    'Top crime per location retrieved successfully'
  );
});

export const fetchPrediction = async (req:Request, res:Response) => {
  try {
    const result = await predictNextMonthReports();
    res.status(200).json({
      success: true,
      data: result,
      message: 'Prediction generated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error instanceof Error ? error.message : 'Failed to generate prediction'),
    });
  }
};
