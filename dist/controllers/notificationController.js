"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotificationHandler = exports.getUnreadNotificationCount = exports.removeNotification = exports.markAllNotificationsAsRead = exports.markNotificationAsRead = exports.getNotifications = void 0;
const response_1 = require("../helpers/response");
const notificationService_1 = require("../services/notificationService");
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const notificationsRaw = yield (0, notificationService_1.getUserNotifications)(Number(userId));
        if (!notificationsRaw) {
            return (0, response_1.errorResponse)(res, 'No notifications found', 404);
        }
        const notifications = notificationsRaw.map((notification) => (Object.assign(Object.assign({}, notification), { report: notification.report
                ? {
                    id: notification.report.id,
                    title: notification.report.crimeName,
                    // Add other report fields as needed
                }
                : null })));
        return (0, response_1.successResponse)(res, notifications, 200, 'Notifications fetched successfully');
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching notifications' });
    }
});
exports.getNotifications = getNotifications;
const markNotificationAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { notificationId } = req.params;
        const notification = yield (0, notificationService_1.markAsRead)(Number(notificationId));
        res.json(notification);
    }
    catch (error) {
        res.status(500).json({ message: 'Error marking notification as read' });
    }
});
exports.markNotificationAsRead = markNotificationAsRead;
const markAllNotificationsAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        yield (0, notificationService_1.markAllAsRead)(Number(userId));
        res.json({ message: 'All notifications marked as read' });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: 'Error marking all notifications as read' });
    }
});
exports.markAllNotificationsAsRead = markAllNotificationsAsRead;
const removeNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { notificationId } = req.params;
        yield (0, notificationService_1.deleteNotification)(Number(notificationId));
        res.json({ message: 'Notification deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting notification' });
    }
});
exports.removeNotification = removeNotification;
const getUnreadNotificationCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const count = yield (0, notificationService_1.getUnreadCount)(Number(userId));
        res.json({ count });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: 'Error getting unread notification count' });
    }
});
exports.getUnreadNotificationCount = getUnreadNotificationCount;
const createNotificationHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, title, message, type, reportId } = req.body;
        const notification = yield (0, notificationService_1.createNotification)({
            userId: Number(userId),
            title,
            message,
            type: type,
            reportId: reportId ? Number(reportId) : undefined,
        });
        res.status(201).json(notification);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating notification', error });
    }
});
exports.createNotificationHandler = createNotificationHandler;
