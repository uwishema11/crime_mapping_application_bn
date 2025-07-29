import { prisma } from '../db/prismaClient';
import { NotificationType, Prisma } from '@prisma/client';
import { format, subDays } from 'date-fns';

import { ReportType } from '../types/report';
import { ReportStatus } from '@prisma/client';
import { not } from 'joi';

interface Params {
  filter: ReportStatus;
  page: number;
  search: string;
  per_page: number;
}

// export const createReport = async (data: ReportType) => {
//   console.log(data);
//   return await prisma.report.create({
//     data: {
//       ...data,
//       incidentDate: new Date(data.incidentDate),
//     },
//   });
// };

// src/services/report.ts

export const createReportWithCrime = async (data: ReportType) => {
  return await prisma.$transaction(async (tx) => {
    const category = await tx.crimeCategory.findUnique({
      where: { name: data.categoryName },
      select: { id: true },
    });

    if (!category) {
      throw new Error('Category not found');
    }
    const crime = await tx.crime.create({
      data: {
        crime_name: data.crimeName.toLocaleUpperCase(),
        description: data.description,
        categoryId: category.id,
        createdBy: data.userId,
        latitude: data.latitude,
        longitude: data.longitude,
        incidentDate: new Date(data.incidentDate),
        location: data.location.toLocaleLowerCase(),
      },
    });
    const report = await tx.report.create({
      data: {
        crimeName: data.crimeName,
        description: data.description,
        location: data.location,
        incidentDate: new Date(data.incidentDate),
        evidence: data.evidence,
        contactNumber: data.contactNumber,
        categoryName: data.categoryName,
        userId: data.userId,
        status: ReportStatus.PENDING,
        identityId: data.identityId ? String(data.identityId) : undefined,
      },
      include: {
        category: true,
        reporter: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const notifications = await tx.notification.create({
      data: {
        userId: data.userId,
        reportId: report.id,
        title: 'Report Submitted',
        message: `Your report "${crime.crime_name}" was submitted and is now ${report.status}.`,
        type: NotificationType.REPORT_SUBMITTED,
      },
    });

    return {
      report,
      crime,
      notifications,
    };
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
  return await prisma.$transaction(async (tx) => {
    // 1. Update the report status
    const updatedReport = await tx.report.update({
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
    const notification = await tx.notification.create({
      data: {
        userId: updatedReport.reporter.id,
        reportId: updatedReport.id,
        title: 'Report Status Updated',
        message: `Your report status is now ${updatedReport.status}.`,
        type: NotificationType.REPORT_STATUS_CHANGED,
      },
    });

    return { updatedReport, notification };
  });
};

export const checkReportOwnership = async (
  reportId: number,
  userId: number
) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: { userId: true },
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

export const deleteReport = async (
  id: number,
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

export const groupReportsByLocation = async () => {
  return await prisma.report.groupBy({
    by: ['location'],
    _count: { location: true },
    orderBy: { _count: { location: 'desc' } },
  });
};

export const groupReportsByStatus = async () => {
  return await prisma.report.groupBy({
    by: ['status'],
    _count: { status: true },
    orderBy: { _count: { status: 'desc' } },
  });
};

// Only group where status is PENDING
export const groupPendingReportsByStatus = async () => {
  return await prisma.report.groupBy({
    by: ['status'],
    where: { status: ReportStatus.PENDING },
    _count: { status: true },
    orderBy: { _count: { status: 'desc' } },
  });
};

export const groupReportsByAgeGroup = async () => {
  const reports = await prisma.report.findMany({
    include: {
      reporter: {
        select: { date_of_birth: true },
      },
    },
  });
  const getAge = (dob: Date | null) => {
    if (!dob) return null;
    const diff = Date.now() - dob.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  const ageGroups: { [key: string]: number } = {};
  for (const report of reports) {
    const age = getAge(report.reporter?.date_of_birth ?? null);
    let group = 'Unknown';
    if (age !== null) {
      if (age < 18) group = 'Under 18';
      else if (age < 30) group = '18-29';
      else if (age < 45) group = '30-44';
      else if (age < 60) group = '45-59';
      else group = '60+';
    }
    ageGroups[group] = (ageGroups[group] || 0) + 1;
  }
  return ageGroups;
};

export async function groupedReportsByMonth() {
  const reports = await prisma.report.findMany({
    select: {
      incidentDate: true,
    },
  });
  const counts: Record<string, number> = {};

  for (const report of reports) {
    const month = format(report.incidentDate, 'MMMM');
    counts[month] = (counts[month] || 0) + 1;
  }

  return counts;
}
// reports grouped by month for a specific user

export const groupUserReportsByMonth = async (userId: number) => {
  const reports = await prisma.report.findMany({
    where: { userId },
    select: {
      incidentDate: true,
    },
  });

  const counts: Record<string, number> = {};

  for (const report of reports) {
    if (!report.incidentDate) continue;
    const month = format(report.incidentDate, 'MMMM');
    counts[month] = (counts[month] || 0) + 1;
  }

  return counts;
};

export async function recentReports() {
  return prisma.report.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  });
}

export async function getTrendingArea() {
  const thirtyDaysAgo = subDays(new Date(), 30);
  const result = await prisma.report.groupBy({
    by: ['location'],
    where: {
      incidentDate: {
        gte: thirtyDaysAgo,
      },
    },
    _count: { id: true },
    orderBy: {
      _count: { id: 'desc' },
    },
    take: 5,
  });
  return result;
}

export const groupReportsByCategory = async () => {
  return await prisma.report.groupBy({
    by: ['categoryName'],
    _count: { categoryName: true },
    orderBy: { _count: { categoryName: 'desc' } },
  });
};

export const groupUserReportsByCategory = async (userId: number) => {
  console.log('User ID:', userId);
  if (!userId) {
    throw new Error('User ID is required');
  }
  return await prisma.report.groupBy({
    by: ['categoryName'],
    where: { userId },
    _count: { categoryName: true },
    orderBy: { _count: { categoryName: 'desc' } },
  });
};

export const getTopCrimePerLocation = async () => {
  const reports = await prisma.report.findMany({
    select: {
      location: true,
      crimeName: true,
    },
  });

  const locationCrimeMap: Record<string, Record<string, number>> = {};

  for (const report of reports) {
    if (!report.location || !report.crimeName) continue;
    if (!locationCrimeMap[report.location]) {
      locationCrimeMap[report.location] = {};
    }
    locationCrimeMap[report.location][report.crimeName] =
      (locationCrimeMap[report.location][report.crimeName] || 0) + 1;
  }

  const result = Object.entries(locationCrimeMap).map(([location, crimes]) => {
    let topCrime = '';
    let maxCount = 0;
    for (const [crimeName, count] of Object.entries(crimes)) {
      if (count > maxCount) {
        topCrime = crimeName;
        maxCount = count;
      }
    }
    return {
      location,
      topCrime,
      count: maxCount,
    };
  });

  // Sort by count descending and take top 5
  return result.sort((a, b) => b.count - a.count).slice(0, 5);
};

// Helper: Linear regression
function linearRegression(x: number[], y: number[]) {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

// Get monthly report counts
export const getMonthlyReportCounts = async () => {
  const reports = await prisma.report.findMany({
    select: { incidentDate: true },
  });

  // Group by month (YYYY-MM)
  const counts: { [month: string]: number } = {};
  for (const report of reports) {
    const date = new Date(report.incidentDate);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    counts[month] = (counts[month] || 0) + 1;
  }
  return counts;
};

// Predict next month's report count
export const predictNextMonthReports = async () => {
  const counts = await getMonthlyReportCounts();
  const months = Object.keys(counts).sort();
  const y = months.map((m) => counts[m]);
  const x = months.map((_, i) => i + 1);

  if (x.length < 2) {
    return { prediction: null, message: 'Not enough data for prediction.' };
  }

  const { slope, intercept } = linearRegression(x, y);
  const nextMonthIndex = x.length + 1;
  const prediction = Math.round(slope * nextMonthIndex + intercept);

  return {
    months,
    counts: y,
    prediction,
    message: `Predicted report count for next month: ${prediction}`,
  };
};
