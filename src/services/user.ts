import { prisma } from '../db/prismaClient';
import { Prisma, Role, VerificationStatus } from '@prisma/client';
import { userType } from '../types/user';
import { UserStatus } from '@prisma/client';

interface userParams {
  filter: UserStatus;
  page: number;
  limit: number;
  search: string;
}

export const addUser = async (newUser: userType) => {
  const { confirm_password, ...userData } = newUser;

  const registeredUser = await prisma.user.create({
    data: {
      ...userData,
    },
  });
  return registeredUser;
};

export const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
};

export const updateVerifiedUser = async (email: string) => {
  return await prisma.user.update({
    where: { email },
    data: {
      isVerified: VerificationStatus.VERIFIED,
      status: UserStatus.ACTIVE,
      updated_at: new Date(),
    },
  });
};

export const fetchAllUsers = async (user: userParams) => {
  const { filter, search, page, limit } = user;

  const whereClouse = {
    ...(filter ? { status: filter } : {}),
    ...(search
      ? {
          OR: [
            {
              firstName: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              lastName: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              email: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }
      : {}),
  };

  const skip = (page - 1) * limit;
  const take = limit;

  const users = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      image_url: true,
      email: true,
      role: true,
      isVerified: true,
      status: true,
    },
    where: whereClouse,
    skip,
    take,
    orderBy: {
      created_at: 'desc',
    },
  });

  const total = await prisma.user.count({
    where: whereClouse,
  });

  const totalPages = Math.ceil(total / limit);

  return {
    data: users,
    pagination: {
      total,
      page: Number(page),
      per_page: Number(limit),
      totalPages,
    },
  };
};

export const findUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return user;
};

export const updateUserRole = async (email: string, role: Role) => {
  return await prisma.user.update({
    where: { email },
    data: {
      role,
      updated_at: new Date(),
    },
  });
};
export const updateUserData = async (id: number, data: Partial<userType>) => {
  return await prisma.user.update({
    where: { id },
    data: {
      ...data,
      updated_at: new Date(),
    },
  });
};
