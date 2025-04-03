import { Response } from 'express';

export function successResponse(
  res: Response,
  data: any,
  statusCode: number,
  message: string
) {
  res.status(statusCode).json({ success: true, message, data });
  return;
}

export function errorResponse(
  res: Response,
  message: string,
  statusCode: number
) {
  res.status(statusCode).json({ success: false, message });
  return;
}
