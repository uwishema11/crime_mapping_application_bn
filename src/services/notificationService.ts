import { prisma } from '../db/prismaClient';
import { NotificationType } from '@prisma/client';


export const createNotification = async (data: {
  userId: number;
  title: string;
  message: string;
  type: NotificationType;
  reportId?: number;
}) => {
  return await prisma.notification.create({
    data,
  });
};

export const getUserNotifications = async (userId: number) => {
  return await prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      report: true,
    },
  });
};

export const markAsRead = async (notificationId: number) => {
  return await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
};

export const markAllAsRead = async (userId: number) => {
  return await prisma.notification.updateMany({
    where: {
      userId,
      read: false,
    },
    data: { read: true },
  });
};

export const deleteNotification = async (notificationId: number) => {
  return await prisma.notification.delete({
    where: { id: notificationId },
  });
};

export const getUnreadCount = async (userId: number) => {
  return await prisma.notification.count({
    where: {
      userId,
      read: false,
    },
  });
};

// Helper method to create report-related notifications
export const createReportNotification = async (
  reportId: number,
  type: NotificationType,
  message: string
) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: { reporter: true },
  });

  if (!report) return null;

  return await createNotification({
    userId: report.userId,
    title: `Report #${reportId} Update`,
    message,
    type,
    reportId,
  });
};

export const notifyReportSubmitted = async (reportId: number) => {
  return await createReportNotification(
    reportId,
    'REPORT_SUBMITTED',
    'Your report has been submitted successfully and is under review.'
  );
};

// Create notification for status change
export const notifyStatusChange = async (
  reportId: number,
  newStatus: string
) => {
  return await createReportNotification(
    reportId,
    'REPORT_STATUS_CHANGED',
    `Your report status has been updated to: ${newStatus}`
  );
};

// Create notification for officer assignment
export const notifyOfficerAssignment = async (
  reportId: number,
  officerName: string
) => {
  return await createReportNotification(
    reportId,
    'REPORT_ASSIGNED',
    `Officer ${officerName} has been assigned to your report`
  );
};
