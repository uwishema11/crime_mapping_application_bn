import { Request, Response } from 'express';
import asyncHandler from '../helpers/asyncHandler';
import { createCrime, deleteCrimeById } from '../services/crimes';
import { successResponse } from '../helpers/response';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const addingCrimes = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    const crime = {
      ...req.body,
      userId: userId,
    };
    const newCrime = await createCrime(crime);
    successResponse(res, newCrime, 201, 'Crime category created successfully');
  }
);
