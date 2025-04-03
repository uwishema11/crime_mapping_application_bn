import { prisma } from "../db/prismaClient";
import { userType } from "../types/user";

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
      isVerified: "VERIFIED",
      status: "ACTIVE",
      updated_at: new Date(),
    },
  });
};
