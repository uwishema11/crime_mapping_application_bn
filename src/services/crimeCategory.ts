import { prisma } from '../db/prismaClient';
import { CrimeCategoryType } from '../types/crime';

export const createCrimeCategory = async (data: CrimeCategoryType) => {
  const { crimes, ...categoryData } = data;
  return await prisma.crimeCategory.create({
    data: {
      ...categoryData,

      crimes: {
        create: crimes || [],
      },
    },
    include: {
      crimes: true,
    },
  });
};

export const getAllCrimeCategories = async () => {
  return await prisma.crimeCategory.findMany();
};

export const getCrimeCategoryById = async (id: number) => {
  return await prisma.crimeCategory.findUnique({
    where: { id },
    include: {
      crimes: true,
    },
  });
};

export const updateCrimeCategory = async (
  id: number,
  data: CrimeCategoryType
) => {
  return await prisma.crimeCategory.update({
    where: { id },
    data: {
      ...data,
      crimes: data.crimes
        ? {
            set: data.crimes.map((crime) => ({ id: crime.id })),
          }
        : undefined,
    },
  });
};

export const deleteCrimeCategory = async (id: number) => {
  return await prisma.crimeCategory.delete({
    where: { id },
  });
};

export const getCrimesByCategoryId = async (categoryId: number) => {
  return await prisma.crime.findMany({
    where: { categoryId },
  });
};

export const getCategoriesByCrimeId = async (crimeId: number) => {
  return await prisma.crimeCategory.findMany({
    where: { crimes: { some: { id: crimeId } } },
  });
};
