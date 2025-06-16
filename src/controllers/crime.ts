import asyncHandler from '../helpers/asyncHandler';
import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../helpers/response';
import {
  createCrime,
  deleteCrime,
  getAllCrimes,
  getCrimeById,
  updateCrime,
  getCrimesByCategory,
  groupedCrimesByMonth,
  groupedCrimesByMonthAndType,
  groupCrimesByLocation,
  groupCrimesByCrimeName,
} from '../services/crime';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const createCrimeController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (req.user?.role !== 'ADMIN') {
      return errorResponse(res, 'Unauthorized access', 403);
    }

    const adminId = req.user.id;
    const crime = await createCrime(adminId, req.body);
    return successResponse(res, crime, 201, 'Crime type created successfully');
  }
);

export const getAllCrimesController = asyncHandler(
  async (req: Request, res: Response) => {
    const crimes = await getAllCrimes();
    return successResponse(
      res,
      crimes,
      200,
      'Crime types retrieved successfully'
    );
  }
);

// Get crime type by ID
export const getCrimeByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const crime = await getCrimeById(Number(id));

    if (!crime) {
      return errorResponse(res, 'Crime type not found', 404);
    }

    return successResponse(
      res,
      crime,
      200,
      'Crime type retrieved successfully'
    );
  }
);

// Update crime type (admin only)
export const updateCrimeController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (req.user?.role !== 'ADMIN') {
      return errorResponse(res, 'Unauthorized access', 403);
    }

    const { id } = req.params;
    const crime = await updateCrime(Number(id), req.body);

    if (!crime) {
      return errorResponse(res, 'Crime type not found', 404);
    }

    return successResponse(res, crime, 200, 'Crime type updated successfully');
  }
);

// Delete crime type (admin only)
export const deleteCrimeController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (req.user?.role !== 'ADMIN') {
      return errorResponse(res, 'Unauthorized access', 403);
    }

    const { id } = req.params;
    await deleteCrime(Number(id));
    return successResponse(res, null, 200, 'Crime type deleted successfully');
  }
);

// Get crimes by category
export const getCrimesByCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const crimes = await getCrimesByCategory(Number(categoryId));
    return successResponse(res, crimes, 200, 'Crimes retrieved successfully');
  }
);

export const fetchGroupedCrimesByMonth = asyncHandler(async (req, res) => {
  const crimes = await groupedCrimesByMonth();

  const isEmpty = !crimes || Object.keys(crimes).length === 0;

  if (isEmpty) {
    return errorResponse(res, 'No crimes found for any month', 404);
  }

  successResponse(res, crimes, 200, 'crimes retrieved successfully');
});

export const fetchGroupedCrimesByMonthAndType = asyncHandler(
  async (req, res) => {
    const grouped = await groupedCrimesByMonthAndType();
    if (!grouped || Object.keys(grouped).length === 0) {
      return errorResponse(res, 'No crimes found for any month', 404);
    }
    successResponse(
      res,
      grouped,
      200,
      'Crimes grouped by month and type retrieved successfully'
    );
  }
);
export const fetchGroupedCrimesByCrimeName = asyncHandler(async (req, res) => {
  const grouped = await groupCrimesByCrimeName();
  if (!grouped || Object.keys(grouped).length === 0) {
    return errorResponse(res, 'No crimes found for any month', 404);
  }
  const formatted = grouped.map((item) => ({
    crime_name: item.crime_name,
    count: item._count.crime_name,
  }));
  successResponse(
    res,
    formatted,
    200,
    'Crimes grouped by crime_name retrieved successfully'
  );
});

export const fetchGroupedCrimesByLocation = asyncHandler(async (req, res) => {
  const grouped = await groupCrimesByLocation();
  if (!grouped || Object.keys(grouped).length === 0) {
    return errorResponse(res, 'No crimes found for This location', 404);
  }

  const formatted = grouped.map((item) => ({
    location: item.location,
    count: item._count.location,
  }));
  successResponse(
    res,
    formatted,
    200,
    'Crimes grouped by location retrieved successfully'
  );
});
