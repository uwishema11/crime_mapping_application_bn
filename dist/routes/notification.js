"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyAdmin_1 = __importDefault(require("../middleware/verifyAdmin"));
const verifyAuth_1 = __importDefault(require("../middleware/verifyAuth"));
const notificationController_1 = require("../controllers/notificationController");
const Notificationrouter = express_1.default.Router();
Notificationrouter.get('/', verifyAuth_1.default, notificationController_1.getNotifications);
Notificationrouter.get('/unread/count', verifyAuth_1.default, notificationController_1.getUnreadNotificationCount);
Notificationrouter.patch('/:notificationId/read', verifyAuth_1.default, notificationController_1.markNotificationAsRead);
Notificationrouter.patch('/read-all', verifyAuth_1.default, notificationController_1.markAllNotificationsAsRead);
Notificationrouter.delete('/:notificationId', verifyAuth_1.default, notificationController_1.removeNotification);
Notificationrouter.post('/', verifyAuth_1.default, verifyAdmin_1.default, notificationController_1.createNotificationHandler);
exports.default = Notificationrouter;
