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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPrediction = exports.fetchTopCrimePerLocation = exports.fetchTrendingAreas = exports.fetchGroupedUserReportsByCategory = exports.fetchGroupedReportsByCategory = exports.fetchAllRecentReports = exports.fetchGroupedUserReportsByMonth = exports.fetchGroupedReportsByMonth = exports.fetchPendingReportsByStatus = exports.fetctchGroupReportsByStatus = exports.updateReportController = exports.deleteReportController = exports.updateReportStatusController = exports.getReportByIdController = exports.getUserReportsController = exports.getAllReportsController = exports.createReportController = void 0;
const asyncHandler_1 = __importDefault(require("../helpers/asyncHandler"));
const response_1 = require("../helpers/response");
const report_1 = require("../services/report");
exports.createReportController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const reportData = Object.assign(Object.assign({}, req.body), { userId });
    const report = yield (0, report_1.createReportWithCrime)(reportData);
    return (0, response_1.successResponse)(res, report, 201, 'Crime report submitted successfully');
}));
exports.getAllReportsController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reports = yield (0, report_1.getAllReports)();
    if (reports.length === 0 || !reports) {
        return (0, response_1.errorResponse)(res, 'No reports found', 404);
    }
    return (0, response_1.successResponse)(res, reports, 200, 'Reports retrieved successfully');
}));
// Get reports for the logged-in user
exports.getUserReportsController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const body = {
        page: parseInt(req.query.page) || 1,
        per_page: parseInt(req.query.limit) || 10,
        filter: req.query.filter,
        search: req.query.search || '',
    };
    const reports = yield (0, report_1.getUserReports)(body, Number(userId));
    return (0, response_1.successResponse)(res, reports, 200, 'User reports retrieved successfully');
}));
// Get a specific report by ID
exports.getReportByIdController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
    const report = yield (0, report_1.getReportById)(Number(id));
    if (!report) {
        return (0, response_1.errorResponse)(res, 'Report not found', 404);
    }
    // Check if user has permission to view the report
    if (userRole !== 'ADMIN' && report.userId !== userId) {
        return (0, response_1.errorResponse)(res, 'Unauthorized access', 403);
    }
    return (0, response_1.successResponse)(res, report, 200, 'Report retrieved successfully');
}));
// Update report status (admin only)
exports.updateReportStatusController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'ADMIN') {
        return (0, response_1.errorResponse)(res, 'Unauthorized access', 403);
    }
    const { id } = req.params;
    const { status } = req.body;
    const report = yield (0, report_1.updateReportStatus)(Number(id), status);
    if (!report) {
        return (0, response_1.errorResponse)(res, 'Report not found', 404);
    }
    return (0, response_1.successResponse)(res, report, 200, 'Report status updated successfully');
}));
exports.deleteReportController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const isAdmin = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === 'ADMIN';
    if (!userId) {
        return (0, response_1.errorResponse)(res, 'User not authenticated', 401);
    }
    const { id } = req.params;
    try {
        const deletedReport = yield (0, report_1.deleteReport)(Number(id), userId, isAdmin);
        if (!deletedReport) {
            return (0, response_1.errorResponse)(res, 'Report not found', 404);
        }
        return (0, response_1.successResponse)(res, null, 200, 'Report deleted successfully');
    }
    catch (error) {
        if (error.message.includes('Unauthorized')) {
            return (0, response_1.errorResponse)(res, error.message, 403);
        }
        throw error;
    }
}));
// Update report (for both users and admins)
exports.updateReportController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const isAdmin = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === 'ADMIN';
    if (!userId) {
        return (0, response_1.errorResponse)(res, 'User not authenticated', 401);
    }
    const { id } = req.params;
    const updateData = req.body;
    try {
        const updatedReport = yield (0, report_1.updateReport)(Number(id), updateData, userId, isAdmin);
        if (!updatedReport) {
            return (0, response_1.errorResponse)(res, 'Report not found', 404);
        }
        return (0, response_1.successResponse)(res, updatedReport, 200, 'Report updated successfully');
    }
    catch (error) {
        if (error.message.includes('Unauthorized')) {
            return (0, response_1.errorResponse)(res, error.message, 403);
        }
        throw error;
    }
}));
exports.fetctchGroupReportsByStatus = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reports = yield (0, report_1.groupReportsByStatus)();
    const formattedData = reports.map((report) => ({
        status: report.status,
        count: report._count.status,
    }));
    if (!reports) {
        return (0, response_1.errorResponse)(res, 'No recent report found', 404);
    }
    (0, response_1.successResponse)(res, formattedData, 200, 'reports retrieved successfully');
}));
exports.fetchPendingReportsByStatus = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reports = yield (0, report_1.groupPendingReportsByStatus)();
    const formattedData = reports.map((report) => ({
        status: report.status,
        count: report._count.status,
    }));
    if (!reports) {
        return (0, response_1.errorResponse)(res, 'No recent report found', 404);
    }
    (0, response_1.successResponse)(res, formattedData, 200, 'reports retrieved successfully');
}));
exports.fetchGroupedReportsByMonth = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reports = yield (0, report_1.groupedReportsByMonth)();
    const isEmpty = !reports || Object.keys(reports).length === 0;
    if (isEmpty) {
        return (0, response_1.errorResponse)(res, 'No reports found for any month', 404);
    }
    (0, response_1.successResponse)(res, reports, 200, 'reports retrieved successfully');
}));
exports.fetchGroupedUserReportsByMonth = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const reports = yield (0, report_1.groupUserReportsByMonth)(Number(userId));
    const isEmpty = !reports || Object.keys(reports).length === 0;
    if (isEmpty) {
        return (0, response_1.errorResponse)(res, 'No reports found for any month', 404);
    }
    (0, response_1.successResponse)(res, reports, 200, 'reports retrieved successfully');
}));
exports.fetchAllRecentReports = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reports = yield (0, report_1.recentReports)();
    if (!reports) {
        return (0, response_1.errorResponse)(res, 'No recent reports found', 404);
    }
    (0, response_1.successResponse)(res, reports, 200, 'eports retrieved successfully');
}));
exports.fetchGroupedReportsByCategory = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const grouped = yield (0, report_1.groupReportsByCategory)();
    const formatted = grouped.map((item) => ({
        category: item.categoryName,
        count: item._count.categoryName,
    }));
    (0, response_1.successResponse)(res, formatted, 200, 'Reports grouped by category retrieved successfully');
}));
exports.fetchGroupedUserReportsByCategory = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(req.user);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const grouped = yield (0, report_1.groupUserReportsByCategory)(Number(userId));
    const formatted = grouped.map((item) => ({
        category: item.categoryName,
        count: item._count.categoryName,
    }));
    (0, response_1.successResponse)(res, formatted, 200, 'User reports grouped by category retrieved successfully');
}));
exports.fetchTrendingAreas = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const areas = yield (0, report_1.getTrendingArea)();
    const formatted = areas.map((area) => ({
        location: area.location,
        count: area._count.id,
    }));
    (0, response_1.successResponse)(res, formatted, 200, 'Top 5 locations with most crimes');
}));
exports.fetchTopCrimePerLocation = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (0, report_1.getTopCrimePerLocation)();
    if (!data || data.length === 0) {
        return (0, response_1.errorResponse)(res, 'No top crimes found', 404);
    }
    (0, response_1.successResponse)(res, data.slice(0, 5), 200, 'Top crime per location retrieved successfully');
}));
const fetchPrediction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, report_1.predictNextMonthReports)();
        res.status(200).json({
            success: true,
            data: result,
            message: 'Prediction generated successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: (error instanceof Error ? error.message : 'Failed to generate prediction'),
        });
    }
});
exports.fetchPrediction = fetchPrediction;
