import asyncHandler from '../helpers/asyncHandler';
import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../helpers/response';

import {
  createCrimeCategory,
  deleteCrimeCategory,
  getAllCrimeCategories,
  getCrimeCategoryById,
  updateCrimeCategory,
} from '../services/crimeCategory';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const createCrimeCategoryController = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const userId = req.user?.id;
    const category_author = req.user?.email;

    const category = {
      ...req.body,
      userId: userId,
      category_author: category_author,
    };
    const newCategory = await createCrimeCategory(category);
    successResponse(
      res,
      newCategory,
      201,
      'Crime category created successfully'
    );
  }
);

export const getAllCrimeCategoriesController = asyncHandler(
  async (req, res) => {
    const categories = await getAllCrimeCategories();

    if (!categories) {
      return errorResponse(res, 'No crime categories found', 404);
    }
    if (categories.length === 0) {
      return errorResponse(res, 'No categories Available', 404);
    }
    successResponse(
      res,
      categories,
      200,
      'Crime categories retrieved successfully'
    );
  }
);

export const updateCrimeCategoryController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await updateCrimeCategory(Number(id), req.body);

  if (!category) {
    res.status(404).json({
      message: 'Crime category not found',
    });
    return;
  }

  res.status(200).json({
    message: 'Crime category updated successfully',
    data: category,
  });
});
export const deleteCrimeCategoryController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await deleteCrimeCategory(Number(id));

  if (!category) {
    errorResponse(res, 'Crime category not found', 404);
    return;
  }
  return successResponse(res, null, 200, 'Crime category deleted successfully');
});
