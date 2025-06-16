import express from 'express';
import { celebrate, Joi } from 'celebrate';
import verifyAdmin from '../middleware/verifyAdmin';
import protectedRoute from '../middleware/verifyAuth';
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createNotificationHandler,
  removeNotification,
} from '../controllers/notificationController';

const Notificationrouter = express.Router();
Notificationrouter.get('/', protectedRoute, getNotifications);
Notificationrouter.get(
  '/unread/count',
  protectedRoute,
  getUnreadNotificationCount
);
Notificationrouter.patch(
  '/:notificationId/read',
  protectedRoute,
  markNotificationAsRead
);
Notificationrouter.patch(
  '/read-all',
  protectedRoute,
  markAllNotificationsAsRead
);
Notificationrouter.delete(
  '/:notificationId',
  protectedRoute,
  removeNotification
);
Notificationrouter.post(
  '/',
  protectedRoute,
  verifyAdmin,
  createNotificationHandler
);

export default Notificationrouter;
