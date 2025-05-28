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
