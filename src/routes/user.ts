import express from 'express';
import { celebrate } from 'celebrate';
import { uploadImg } from '../utils/storage';
import protectedRoute from '../middleware/verifyAuth';
import verifyAdmin from '../middleware/verifyAdmin';
import {
  registerUser,
  verifyUser,
  login,
  fetchUsers,
  deleteUser,
  updateUser,
} from '../controllers/user';
import { userSchema } from '../validation/user';

const userRouter = express.Router();
userRouter.post('/auth/verify/:token', verifyUser);
userRouter.get('/', protectedRoute, verifyAdmin, fetchUsers);
userRouter.post(
  '/auth/register',
  uploadImg,
  celebrate({ body: userSchema }),
  registerUser
);
userRouter.delete('/delete/:id', protectedRoute, verifyAdmin, deleteUser);
userRouter.post('/auth/login', login);
userRouter.post('/auth/verify/:token', verifyUser);
userRouter.patch(
  '/update/:id',
  uploadImg,

  updateUser
);

export default userRouter;
