import { Request, Response } from 'express';
import asyncHandler from '../helpers/asyncHandler';
import { successResponse, errorResponse } from '../helpers/response';
import {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} from '../services/notificationService';
import { NotificationType } from '@prisma/client';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const getNotifications = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const notificationsRaw = await getUserNotifications(Number(userId));
    if (!notificationsRaw) {
      return errorResponse(res, 'No notifications found', 404);
    }

    const notifications = notificationsRaw.map((notification) => ({
      ...notification,
      report: notification.report
        ? {
            id: notification.report.id,
            title: notification.report.crimeName,
            // Add other report fields as needed
          }
        : null,
    }));

    return successResponse(
      res,
      notifications,
      200,
      'Notifications fetched successfully'
    );
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    const notification = await markAsRead(Number(notificationId));
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification as read' });
  }
};

export const markAllNotificationsAsRead = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    await markAllAsRead(Number(userId));
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error marking all notifications as read' });
  }
};

export const removeNotification = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    await deleteNotification(Number(notificationId));
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification' });
  }
};

export const getUnreadNotificationCount = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const count = await getUnreadCount(Number(userId));
    res.json({ count });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error getting unread notification count' });
  }
};

export const createNotificationHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, title, message, type, reportId } = req.body;

    const notification = await createNotification({
      userId: Number(userId),
      title,
      message,
      type: type as NotificationType,
      reportId: reportId ? Number(reportId) : undefined,
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error });
  }
};
