import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

class UserService {
  async updateUserRole(userId: number, newRole: Role) {
    return await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    });
  }

  async getOfficers() {
    return await prisma.user.findMany({
      where: {
        role: 'USER'
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone_number: true,
        city: true
      }
    });
  }

  // async getAssignedReports(officerId: number) {
  //   return await prisma.report.findMany({
  //     where: {
  //       assignedTo: officerId
  //     },
  //     include: {
  //       reporter: {
  //         select: {
  //           firstName: true,
  //           lastName: true,
  //           email: true,
  //           phone_number: true
  //         }
  //       },
  //       category: true
  //     }
  //   });
  // }
}

export default new UserService(); 