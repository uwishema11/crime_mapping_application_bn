import { prisma } from '../db/prismaClient';
import { NotificationType } from '@prisma/client';

export const createNotification = async ({
  userId,
  reportId,
  title,
  message,
  type,
}: {
  userId: number;
  reportId?: number;
  title: string;
  message: string;
  type: NotificationType;
}) => {
  return await prisma.notification.create({
    data: {
      userId,
      reportId,
      title,
      message,
      type,
    },
  });
};

export const getUserNotifications = async (userId: number) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};
export const markNotificationAsRead = async (notificationId: number) => {
  return await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
};