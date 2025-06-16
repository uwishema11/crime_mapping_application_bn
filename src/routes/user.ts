import express from 'express';
import { celebrate, Joi } from 'celebrate';
import { uploadImg } from '../utils/storage';
import protectedRoute from '../middleware/verifyAuth';
import verifyAdmin from '../middleware/verifyAdmin';
import {
  registerUser,
  login,
  fetchUsers,
  deleteUser,
  updateUser,
} from '../controllers/user';
import { userSchema } from '../validation/user';
import userController from '../controllers/userController';

const userRouter = express.Router();
userRouter.get('/', protectedRoute, fetchUsers);
userRouter.post(
  '/auth/register',
  uploadImg,
  celebrate({ body: userSchema }),
  registerUser
);
userRouter.delete('/delete/:id', protectedRoute, verifyAdmin, deleteUser);
userRouter.post('/auth/login', login);
// userRouter.post('/auth/verify/:token', verifyUser);
userRouter.patch(
  '/update/:id',
  uploadImg,
  updateUser
);

// Update user role (admin only)
userRouter.patch(
  '/:userId/role',
  protectedRoute,
  verifyAdmin,
  celebrate({
    params: Joi.object({
      userId: Joi.number().required()
    }),
    body: Joi.object({
      role: Joi.string().valid('USER', 'OFFICER', 'ADMIN', 'SUPERADMIN').required()
    })
  }),
  userController.updateUserRole
);

// Get all officers (admin only)
userRouter.get(
  '/officers',
  protectedRoute,
  verifyAdmin,
  userController.getOfficers
);

// Get assigned reports (officer only)
// userRouter.get(
//   '/assigned-reports',
//   protectedRoute,
//   userController.getAssignedReports
// );

export default userRouter;
