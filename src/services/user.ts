import { prisma } from '../db/prismaClient';
import { Prisma, UserStatus,Role } from '@prisma/client';

import { userType } from '../types/user';

interface userParams {
  filter: UserStatus;
  page: number;
  limit: number;
  search: string;
}

export const addUser = async (newUser: userType) => {
  // const userData: userType = {
  //   ...newUser,
  //   email: newUser.email.toLowerCase(),
  //   status: UserStatus.ACTIVE, // Default status
  //   created_at: new Date(),
  //   updated_at: new Date(),
  // };

  const registeredUser = await prisma.user.create({
    data: {
      ...newUser,
      // email: userData.email.toLowerCase(),
    },
  });
  return registeredUser;
};

export const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: email.toLowerCase(),
      },
    },
  });
  return user;
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

export const deleteUserService = async (id: number) => {
  return await prisma.user.delete({
    where: { id },
  });
};
