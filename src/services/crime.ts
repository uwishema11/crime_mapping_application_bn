import { prisma } from '../db/prismaClient';
import { CrimeType } from '../types/crime';

import { format } from 'date-fns';

export async function groupedCrimesByMonthAndType() {
  const crimes = await prisma.crime.findMany({
    select: {
      incidentDate: true,
      crime_name: true,
    },
  });

  const result: Record<
    string,
    { total: number; crimes: Record<string, number> }
  > = {};

  for (const crime of crimes) {
    if (!crime.incidentDate) continue;
    const month = format(crime.incidentDate, 'MMMM');
    const crimeName = crime.crime_name;

    if (!result[month]) {
      result[month] = { total: 0, crimes: {} };
    }
    result[month].total += 1;
    result[month].crimes[crimeName] =
      (result[month].crimes[crimeName] || 0) + 1;
  }

  return result;
}

export const createCrime = async (adminId: number, data: CrimeType) => {
  return await prisma.crime.create({
    data: {
      ...data,
      crime_name: data.name,
      createdBy: adminId,
    },
    include: {
      category: true,
    },
  });
};

export const getCrimeById = async (id: number) => {
  return await prisma.crime.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });
};

export const getAllCrimes = async () => {
  return await prisma.crime.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const updateCrime = async (id: number, data: Partial<CrimeType>) => {
  return await prisma.crime.update({
    where: { id },
    data,
    include: {
      category: true,
    },
  });
};

export const deleteCrime = async (id: number) => {
  return await prisma.crime.delete({
    where: { id },
  });
};

export const getCrimesByCategory = async (categoryId: number) => {
  return await prisma.crime.findMany({
    where: { categoryId },
    include: {
      category: true,
    },
  });
};

export async function groupedCrimesByMonth() {
  const crimes = await prisma.crime.findMany({
    select: {
      incidentDate: true,
    },
  });
  const counts: Record<string, number> = {};

  for (const crime of crimes) {
    if (crime.incidentDate) {
      const month = format(crime.incidentDate, 'MMMM');
      counts[month] = (counts[month] || 0) + 1;
    }
  }

  return counts;
}

export const groupCrimesByLocation = async () => {
  return await prisma.crime.groupBy({
    by: ['location'],
    _count: { location: true },
    orderBy: { _count: { location: 'desc' } },
  });
};
export const groupCrimesByCrimeName = async () => {
  return await prisma.crime.groupBy({
    by: ['crime_name'],
    _count: { crime_name: true },
    orderBy: { _count: { crime_name: 'desc' } },
  });
};
