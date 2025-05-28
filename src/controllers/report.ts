import asyncHandler from '../helpers/asyncHandler';
import { Request, Response } from 'express';
import { ReportStatus } from '@prisma/client';
import { successResponse, errorResponse } from '../helpers/response';
import {
  createReport,
  deleteReport,
  getAllReports,
  getReportById,
  getUserReports,
  updateReport,
  updateReportStatus,
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
    if (!userId) {
      return errorResponse(res, 'User not authenticated', 401);
    }
    const reportData = {
      ...req.body,
      userId,
    };

    const report = await createReport(reportData);
    return successResponse(
      res,
      report,
      201,
      'Crime report submitted successfully'
    );
  }
);

// Get all reports (admin only)
export const getAllReportsController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (req.user?.role !== 'ADMIN') {
      return errorResponse(res, 'Unauthorized access', 403);
    }
    console.log(req.user?.role)
    const reports = await getAllReports();
    return successResponse(res, reports, 200, 'Reports retrieved successfully');
  }
);

// Get reports for the logged-in user
export const getUserReportsController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    console.log(req.user?.role)
    if (!userId) {
      return errorResponse(res, 'User not authenticated', 401);
    }

    const body = {
      page: parseInt(req.query.page as string) || 1,
      per_page: parseInt(req.query.limit as string) || 10,
      filter: req.query.filter as ReportStatus,
      search: (req.query.search as string) || '',
    };

    const reports = await getUserReports(body, userId);

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

// Delete a report
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

      return successResponse(
        res,
        null,
        200,
        'Report deleted successfully'
      );
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
