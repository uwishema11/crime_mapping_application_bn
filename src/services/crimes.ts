import { prisma } from '../db/prismaClient';
import { CrimeCategoryType } from '../types/crime';
import { CrimeType } from '../types/crime';

export const createCrime = async (data: CrimeType) => {
  const result = prisma.crime.create({
    data: data,
  });
  return result;
};

export const deleteCrimeById = async (id: number) => {
  await prisma.crime.delete({
    where: { id },
  });
};
