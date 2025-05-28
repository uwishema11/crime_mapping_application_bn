import { prisma } from '../db/prismaClient';
import { CrimeType } from '../types/crime';

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
