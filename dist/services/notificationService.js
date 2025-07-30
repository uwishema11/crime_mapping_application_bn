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
exports.notifyOfficerAssignment = exports.notifyStatusChange = exports.notifyReportSubmitted = exports.createReportNotification = exports.getUnreadCount = exports.deleteNotification = exports.markAllAsRead = exports.markAsRead = exports.getUserNotifications = exports.createNotification = void 0;
const prismaClient_1 = require("../db/prismaClient");
const createNotification = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.notification.create({
        data,
    });
});
exports.createNotification = createNotification;
const getUserNotifications = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.notification.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            report: true,
        },
    });
});
exports.getUserNotifications = getUserNotifications;
const markAsRead = (notificationId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.notification.update({
        where: { id: notificationId },
        data: { read: true },
    });
});
exports.markAsRead = markAsRead;
const markAllAsRead = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.notification.updateMany({
        where: {
            userId,
            read: false,
        },
        data: { read: true },
    });
});
exports.markAllAsRead = markAllAsRead;
const deleteNotification = (notificationId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.notification.delete({
        where: { id: notificationId },
    });
});
exports.deleteNotification = deleteNotification;
const getUnreadCount = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.notification.count({
        where: {
            userId,
            read: false,
        },
    });
});
exports.getUnreadCount = getUnreadCount;
// Helper method to create report-related notifications
const createReportNotification = (reportId, type, message) => __awaiter(void 0, void 0, void 0, function* () {
    const report = yield prismaClient_1.prisma.report.findUnique({
        where: { id: reportId },
        include: { reporter: true },
    });
    if (!report)
        return null;
    return yield (0, exports.createNotification)({
        userId: report.userId,
        title: `Report #${reportId} Update`,
        message,
        type,
        reportId,
    });
});
exports.createReportNotification = createReportNotification;
const notifyReportSubmitted = (reportId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, exports.createReportNotification)(reportId, 'REPORT_SUBMITTED', 'Your report has been submitted successfully and is under review.');
});
exports.notifyReportSubmitted = notifyReportSubmitted;
// Create notification for status change
const notifyStatusChange = (reportId, newStatus) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, exports.createReportNotification)(reportId, 'REPORT_STATUS_CHANGED', `Your report status has been updated to: ${newStatus}`);
});
exports.notifyStatusChange = notifyStatusChange;
// Create notification for officer assignment
const notifyOfficerAssignment = (reportId, officerName) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, exports.createReportNotification)(reportId, 'REPORT_ASSIGNED', `Officer ${officerName} has been assigned to your report`);
});
exports.notifyOfficerAssignment = notifyOfficerAssignment;
