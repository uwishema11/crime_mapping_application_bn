import { prisma } from '../db/prismaClient';
import { Prisma } from '@prisma/client';
import { ReportType } from '../types/report';
import { ReportStatus } from '@prisma/client';

interface Params {
  filter: ReportStatus;
  page: number;
  search: string;
  per_page: number;
}

export const createReport = async (data: ReportType) => {
  console.log(data);
  return await prisma.report.create({
    data: {
      ...data,
      incidentDate: new Date(data.incidentDate),
    },
  });
};

export const getReportById = async (id: number) => {
  return await prisma.report.findUnique({
    where: { id },
    include: {
      category: true,
      reporter: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
};

export const getUserReports = async (queryParams: Params, userId: number) => {
  const { page, per_page, search, filter } = queryParams;
  const whereClouse = {
    userId,
    ...(filter ? { status: filter } : {}),
    ...(search
      ? {
          OR: [
            {
              crimeName: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              description: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }
      : {}),
  };

  const reports = await prisma.report.findMany({
    where: whereClouse,
    skip: (page - 1) * per_page,
    take: Number(per_page),
    include: {
      category: true,
      reporter: {
        select: {
          id: true,
          email: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
  const total = await prisma.report.count({ where: whereClouse });
  const totalpAGES = Math.ceil(total / 10);
  return {
    data: reports,
    pagination: {
      total,
      page: Number(page),
      per_page: Number(per_page),
      totalPages: totalpAGES,
    },
  };
};

export const getAllReports = async () => {
  return await prisma.report.findMany({
    include: {
      category: true,
      reporter: {
        select: {
          id: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const updateReportStatus = async (id: number, status: ReportStatus) => {
  return await prisma.report.update({
    where: { id },
    data: { status },
    include: {
      category: true,
      reporter: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
};

export const checkReportOwnership = async (reportId: number, userId: number) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: { userId: true }
  });
  return report?.userId === userId;
};

export const updateReport = async (
  id: number, 
  data: Partial<ReportType>, 
  userId: number,
  isAdmin: boolean
) => {
  const existingReport = await prisma.report.findUnique({ 
    where: { id },
  });

  if (!existingReport) {
    return null;
  }

  const isOwner = await checkReportOwnership(id, userId);
  if (!isOwner && !isAdmin) {
    throw new Error('Unauthorized: You can only edit your own reports');
  }

  return await prisma.report.update({
    where: { id },
    data: {
      ...data,
      incidentDate: data.incidentDate ? new Date(data.incidentDate) : undefined,
    },
    include: {
      category: true,
      reporter: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
};

export const deleteReport = async (id: number, userId: number, isAdmin: boolean) => {
  const existingReport = await prisma.report.findUnique({ 
    where: { id },
  });

  if (!existingReport) {
    return null;
  }

  const isOwner = await checkReportOwnership(id, userId);
  if (!isOwner && !isAdmin) {
    throw new Error('Unauthorized: You can only delete your own reports');
  }

  return await prisma.report.delete({
    where: { id },
  });
};

export const getReportsByCrime = async (crimeId: number) => {
  return await prisma.report.findMany({
    where: { id: crimeId },
    include: {
      category: true,
      reporter: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
};
