import express from 'express';
import { Request, Response } from 'express';

import protectedRoute from '../middleware/verifyAuth';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

const authRouter = express.Router();

authRouter.get(
  '/verify-token',
  protectedRoute,
  (req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  }
);

export default authRouter;
