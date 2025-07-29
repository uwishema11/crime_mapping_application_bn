import { Request, Response } from 'express';
import userService from '../services/userService';
import { Role } from '@prisma/client';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}
class UserController {
  // ... existing methods ...

  async updateUserRole(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      const user = await userService.updateUserRole(
        Number(userId),
        role as Role
      );

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user role', error });
    }
  }

  async getOfficers(req: AuthenticatedRequest, res: Response) {
    try {
      const officers = await userService.getOfficers();
      res.json(officers);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching officers', error });
    }
  }

  // async getAssignedReports(req: AuthenticatedRequest, res: Response) {
  //   try {
  //     const officerId = Number(req.user?.id);
  //     const reports = await userService.getAssignedReports(officerId);
  //     res.json(reports);
  //   } catch (error) {
  //     res
  //       .status(500)
  //       .json({ message: 'Error fetching assigned reports', error });
  //   }
  // }
}

export default new UserController();
