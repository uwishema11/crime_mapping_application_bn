import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../helpers/generateToken';
import { findUserByEmail } from '../services/user';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

const protectedRoute = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.query.token) {
      token = req.query.token as string;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message:
          'Unauthorized to access this page! Please login first to proceed',
      });
      return;
    }

    const user = verifyAccessToken(token);
    if (!user.success) {
      res.status(401).json({
        success: false,
        message: ' your session as expired, Please login again to proceed',
      });
      return;
    }

    const payload = user.data as { email: string };
    const isUserExist = await findUserByEmail(payload.email);

    if (!isUserExist) {
      res.status(401).json({
        success: false,
        message: 'User not found! Please register to proceed',
      });
      return;
    }

    req.user = isUserExist;
    next();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error';
    res.status(500).json({ success: false, message: errorMessage });
  }
  return;
};

export default protectedRoute;
