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
exports.predictNextMonthReports = exports.getMonthlyReportCounts = exports.getTopCrimePerLocation = exports.groupUserReportsByCategory = exports.groupReportsByCategory = exports.groupUserReportsByMonth = exports.groupReportsByAgeGroup = exports.groupPendingReportsByStatus = exports.groupReportsByStatus = exports.groupReportsByLocation = exports.getReportsByCrime = exports.deleteReport = exports.updateReport = exports.checkReportOwnership = exports.updateReportStatus = exports.getAllReports = exports.getUserReports = exports.getReportById = exports.createReportWithCrime = void 0;
exports.groupedReportsByMonth = groupedReportsByMonth;
exports.recentReports = recentReports;
exports.getTrendingArea = getTrendingArea;
const prismaClient_1 = require("../db/prismaClient");
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const client_2 = require("@prisma/client");
// export const createReport = async (data: ReportType) => {
//   console.log(data);
//   return await prisma.report.create({
//     data: {
//       ...data,
//       incidentDate: new Date(data.incidentDate),
//     },
//   });
// };
// src/services/report.ts
const createReportWithCrime = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const category = yield tx.crimeCategory.findUnique({
            where: { name: data.categoryName },
            select: { id: true },
        });
        if (!category) {
            throw new Error('Category not found');
        }
        const crime = yield tx.crime.create({
            data: {
                crime_name: data.crimeName.toLocaleUpperCase(),
                description: data.description,
                categoryId: category.id,
                createdBy: data.userId,
                latitude: data.latitude,
                longitude: data.longitude,
                incidentDate: new Date(data.incidentDate),
                location: data.location.toLocaleLowerCase(),
            },
        });
        const report = yield tx.report.create({
            data: {
                crimeName: data.crimeName,
                description: data.description,
                location: data.location,
                incidentDate: new Date(data.incidentDate),
                evidence: data.evidence,
                contactNumber: data.contactNumber,
                categoryName: data.categoryName,
                userId: data.userId,
                status: client_2.ReportStatus.PENDING,
                identityId: data.identityId ? String(data.identityId) : undefined,
            },
            include: {
                category: true,
                reporter: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        const notifications = yield tx.notification.create({
            data: {
                userId: data.userId,
                reportId: report.id,
                title: 'Report Submitted',
                message: `Your report "${crime.crime_name}" was submitted and is now ${report.status}.`,
                type: client_1.NotificationType.REPORT_SUBMITTED,
            },
        });
        return {
            report,
            crime,
            notifications,
        };
    }));
});
exports.createReportWithCrime = createReportWithCrime;
const getReportById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.report.findUnique({
        where: { id },
        include: {
            category: true,
            reporter: {
                select: {
                    id: true,
                    email: true,
                },
            },
        },
    });
});
exports.getReportById = getReportById;
const getUserReports = (queryParams, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, per_page, search, filter } = queryParams;
    const whereClouse = Object.assign(Object.assign({ userId }, (filter ? { status: filter } : {})), (search
        ? {
            OR: [
                {
                    crimeName: {
                        contains: search,
                        mode: client_1.Prisma.QueryMode.insensitive,
                    },
                },
                {
                    description: {
                        contains: search,
                        mode: client_1.Prisma.QueryMode.insensitive,
                    },
                },
            ],
        }
        : {}));
    const reports = yield prismaClient_1.prisma.report.findMany({
        where: whereClouse,
        skip: (page - 1) * per_page,
        take: Number(per_page),
        include: {
            category: true,
            reporter: {
                select: {
                    id: true,
                    email: true,
                },
            },
        },
        orderBy: {
            updatedAt: 'desc',
        },
    });
    const total = yield prismaClient_1.prisma.report.count({ where: whereClouse });
    const totalpAGES = Math.ceil(total / 10);
    return {
        data: reports,
        pagination: {
            total,
            page: Number(page),
            per_page: Number(per_page),
            totalPages: totalpAGES,
        },
    };
});
exports.getUserReports = getUserReports;
const getAllReports = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.report.findMany({
        include: {
            category: true,
            reporter: {
                select: {
                    id: true,
                    email: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
});
exports.getAllReports = getAllReports;
const updateReportStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // 1. Update the report status
        const updatedReport = yield tx.report.update({
            where: { id },
            data: { status },
            include: {
                category: true,
                reporter: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
        const notification = yield tx.notification.create({
            data: {
                userId: updatedReport.reporter.id,
                reportId: updatedReport.id,
                title: 'Report Status Updated',
                message: `Your report status is now ${updatedReport.status}.`,
                type: client_1.NotificationType.REPORT_STATUS_CHANGED,
            },
        });
        return { updatedReport, notification };
    }));
});
exports.updateReportStatus = updateReportStatus;
const checkReportOwnership = (reportId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const report = yield prismaClient_1.prisma.report.findUnique({
        where: { id: reportId },
        select: { userId: true },
    });
    return (report === null || report === void 0 ? void 0 : report.userId) === userId;
});
exports.checkReportOwnership = checkReportOwnership;
const updateReport = (id, data, userId, isAdmin) => __awaiter(void 0, void 0, void 0, function* () {
    const existingReport = yield prismaClient_1.prisma.report.findUnique({
        where: { id },
    });
    if (!existingReport) {
        return null;
    }
    const isOwner = yield (0, exports.checkReportOwnership)(id, userId);
    if (!isOwner && !isAdmin) {
        throw new Error('Unauthorized: You can only edit your own reports');
    }
    return yield prismaClient_1.prisma.report.update({
        where: { id },
        data: Object.assign(Object.assign({}, data), { incidentDate: data.incidentDate ? new Date(data.incidentDate) : undefined }),
        include: {
            category: true,
            reporter: {
                select: {
                    id: true,
                    email: true,
                },
            },
        },
    });
});
exports.updateReport = updateReport;
const deleteReport = (id, userId, isAdmin) => __awaiter(void 0, void 0, void 0, function* () {
    const existingReport = yield prismaClient_1.prisma.report.findUnique({
        where: { id },
    });
    if (!existingReport) {
        return null;
    }
    const isOwner = yield (0, exports.checkReportOwnership)(id, userId);
    if (!isOwner && !isAdmin) {
        throw new Error('Unauthorized: You can only delete your own reports');
    }
    return yield prismaClient_1.prisma.report.delete({
        where: { id },
    });
});
exports.deleteReport = deleteReport;
const getReportsByCrime = (crimeId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.report.findMany({
        where: { id: crimeId },
        include: {
            category: true,
            reporter: {
                select: {
                    id: true,
                    email: true,
                },
            },
        },
    });
});
exports.getReportsByCrime = getReportsByCrime;
const groupReportsByLocation = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.report.groupBy({
        by: ['location'],
        _count: { location: true },
        orderBy: { _count: { location: 'desc' } },
    });
});
exports.groupReportsByLocation = groupReportsByLocation;
const groupReportsByStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.report.groupBy({
        by: ['status'],
        _count: { status: true },
        orderBy: { _count: { status: 'desc' } },
    });
});
exports.groupReportsByStatus = groupReportsByStatus;
// Only group where status is PENDING
const groupPendingReportsByStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.report.groupBy({
        by: ['status'],
        where: { status: client_2.ReportStatus.PENDING },
        _count: { status: true },
        orderBy: { _count: { status: 'desc' } },
    });
});
exports.groupPendingReportsByStatus = groupPendingReportsByStatus;
const groupReportsByAgeGroup = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const reports = yield prismaClient_1.prisma.report.findMany({
        include: {
            reporter: {
                select: { date_of_birth: true },
            },
        },
    });
    const getAge = (dob) => {
        if (!dob)
            return null;
        const diff = Date.now() - dob.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    };
    const ageGroups = {};
    for (const report of reports) {
        const age = getAge((_b = (_a = report.reporter) === null || _a === void 0 ? void 0 : _a.date_of_birth) !== null && _b !== void 0 ? _b : null);
        let group = 'Unknown';
        if (age !== null) {
            if (age < 18)
                group = 'Under 18';
            else if (age < 30)
                group = '18-29';
            else if (age < 45)
                group = '30-44';
            else if (age < 60)
                group = '45-59';
            else
                group = '60+';
        }
        ageGroups[group] = (ageGroups[group] || 0) + 1;
    }
    return ageGroups;
});
exports.groupReportsByAgeGroup = groupReportsByAgeGroup;
function groupedReportsByMonth() {
    return __awaiter(this, void 0, void 0, function* () {
        const reports = yield prismaClient_1.prisma.report.findMany({
            select: {
                incidentDate: true,
            },
        });
        const counts = {};
        for (const report of reports) {
            const month = (0, date_fns_1.format)(report.incidentDate, 'MMMM');
            counts[month] = (counts[month] || 0) + 1;
        }
        return counts;
    });
}
// reports grouped by month for a specific user
const groupUserReportsByMonth = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const reports = yield prismaClient_1.prisma.report.findMany({
        where: { userId },
        select: {
            incidentDate: true,
        },
    });
    const counts = {};
    for (const report of reports) {
        if (!report.incidentDate)
            continue;
        const month = (0, date_fns_1.format)(report.incidentDate, 'MMMM');
        counts[month] = (counts[month] || 0) + 1;
    }
    return counts;
});
exports.groupUserReportsByMonth = groupUserReportsByMonth;
function recentReports() {
    return __awaiter(this, void 0, void 0, function* () {
        return prismaClient_1.prisma.report.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: 5,
        });
    });
}
function getTrendingArea() {
    return __awaiter(this, void 0, void 0, function* () {
        const thirtyDaysAgo = (0, date_fns_1.subDays)(new Date(), 30);
        const result = yield prismaClient_1.prisma.report.groupBy({
            by: ['location'],
            where: {
                incidentDate: {
                    gte: thirtyDaysAgo,
                },
            },
            _count: { id: true },
            orderBy: {
                _count: { id: 'desc' },
            },
            take: 5,
        });
        return result;
    });
}
const groupReportsByCategory = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.report.groupBy({
        by: ['categoryName'],
        _count: { categoryName: true },
        orderBy: { _count: { categoryName: 'desc' } },
    });
});
exports.groupReportsByCategory = groupReportsByCategory;
const groupUserReportsByCategory = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('User ID:', userId);
    if (!userId) {
        throw new Error('User ID is required');
    }
    return yield prismaClient_1.prisma.report.groupBy({
        by: ['categoryName'],
        where: { userId },
        _count: { categoryName: true },
        orderBy: { _count: { categoryName: 'desc' } },
    });
});
exports.groupUserReportsByCategory = groupUserReportsByCategory;
const getTopCrimePerLocation = () => __awaiter(void 0, void 0, void 0, function* () {
    const reports = yield prismaClient_1.prisma.report.findMany({
        select: {
            location: true,
            crimeName: true,
        },
    });
    const locationCrimeMap = {};
    for (const report of reports) {
        if (!report.location || !report.crimeName)
            continue;
        if (!locationCrimeMap[report.location]) {
            locationCrimeMap[report.location] = {};
        }
        locationCrimeMap[report.location][report.crimeName] =
            (locationCrimeMap[report.location][report.crimeName] || 0) + 1;
    }
    const result = Object.entries(locationCrimeMap).map(([location, crimes]) => {
        let topCrime = '';
        let maxCount = 0;
        for (const [crimeName, count] of Object.entries(crimes)) {
            if (count > maxCount) {
                topCrime = crimeName;
                maxCount = count;
            }
        }
        return {
            location,
            topCrime,
            count: maxCount,
        };
    });
    // Sort by count descending and take top 5
    return result.sort((a, b) => b.count - a.count).slice(0, 5);
});
exports.getTopCrimePerLocation = getTopCrimePerLocation;
// Helper: Linear regression
function linearRegression(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return { slope, intercept };
}
// Get monthly report counts
const getMonthlyReportCounts = () => __awaiter(void 0, void 0, void 0, function* () {
    const reports = yield prismaClient_1.prisma.report.findMany({
        select: { incidentDate: true },
    });
    // Group by month (YYYY-MM)
    const counts = {};
    for (const report of reports) {
        const date = new Date(report.incidentDate);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        counts[month] = (counts[month] || 0) + 1;
    }
    return counts;
});
exports.getMonthlyReportCounts = getMonthlyReportCounts;
// Predict next month's report count
const predictNextMonthReports = () => __awaiter(void 0, void 0, void 0, function* () {
    const counts = yield (0, exports.getMonthlyReportCounts)();
    const months = Object.keys(counts).sort();
    const y = months.map((m) => counts[m]);
    const x = months.map((_, i) => i + 1);
    if (x.length < 2) {
        return { prediction: null, message: 'Not enough data for prediction.' };
    }
    const { slope, intercept } = linearRegression(x, y);
    const nextMonthIndex = x.length + 1;
    const prediction = Math.round(slope * nextMonthIndex + intercept);
    return {
        months,
        counts: y,
        prediction,
        message: `Predicted report count for next month: ${prediction}`,
    };
});
exports.predictNextMonthReports = predictNextMonthReports;
