import jwt, { SignOptions } from 'jsonwebtoken';
import { tokenData } from '../types/user';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET as string;
const refreshSecret = process.env.JWT_REFRESH_SECRET as string;

if (!secret || !refreshSecret) {
  throw new Error('JWT secrets are not defined in the environment variables');
}

// Access token expires in 15 minutes
export const generateAccessToken = async (user: tokenData) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const options: SignOptions = { expiresIn: '7d' };

  return jwt.sign(payload, secret, options);
};

// Refresh token expires in 7 days
export const generateRefreshToken = async (user: tokenData) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const options: SignOptions = { expiresIn: '7d' };

  return jwt.sign(payload, refreshSecret, options);
};

export const verifyAccessToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, secret);
    return { success: true, data: decoded };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, refreshSecret);
    return { success: true, data: decoded };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
};
