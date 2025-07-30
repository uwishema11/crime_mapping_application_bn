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
exports.fetchLocationWithMostCrimes = exports.fetchMostReportedCrime = exports.fetchGroupedCrimesByLocation = exports.fetchGroupedCrimesByCrimeName = exports.fetchGroupedCrimesByMonthAndType = exports.fetchGroupedCrimesByMonth = exports.getCrimesByCategoryController = exports.deleteCrimeController = exports.updateCrimeController = exports.getCrimeByIdController = exports.getAllCrimesController = exports.createCrimeController = void 0;
const asyncHandler_1 = __importDefault(require("../helpers/asyncHandler"));
const response_1 = require("../helpers/response");
const crime_1 = require("../services/crime");
exports.createCrimeController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'ADMIN') {
        return (0, response_1.errorResponse)(res, 'Unauthorized access', 403);
    }
    const adminId = req.user.id;
    const crime = yield (0, crime_1.createCrime)(adminId, req.body);
    return (0, response_1.successResponse)(res, crime, 201, 'Crime type created successfully');
}));
exports.getAllCrimesController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const crimes = yield (0, crime_1.getAllCrimes)();
    return (0, response_1.successResponse)(res, crimes, 200, 'Crime types retrieved successfully');
}));
// Get crime type by ID
exports.getCrimeByIdController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const crime = yield (0, crime_1.getCrimeById)(Number(id));
    if (!crime) {
        return (0, response_1.errorResponse)(res, 'Crime type not found', 404);
    }
    return (0, response_1.successResponse)(res, crime, 200, 'Crime type retrieved successfully');
}));
// Update crime type (admin only)
exports.updateCrimeController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'ADMIN') {
        return (0, response_1.errorResponse)(res, 'Unauthorized access', 403);
    }
    const { id } = req.params;
    const crime = yield (0, crime_1.updateCrime)(Number(id), req.body);
    if (!crime) {
        return (0, response_1.errorResponse)(res, 'Crime type not found', 404);
    }
    return (0, response_1.successResponse)(res, crime, 200, 'Crime type updated successfully');
}));
// Delete crime type (admin only)
exports.deleteCrimeController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'ADMIN') {
        return (0, response_1.errorResponse)(res, 'Unauthorized access', 403);
    }
    const { id } = req.params;
    yield (0, crime_1.deleteCrime)(Number(id));
    return (0, response_1.successResponse)(res, null, 200, 'Crime type deleted successfully');
}));
// Get crimes by category
exports.getCrimesByCategoryController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    const crimes = yield (0, crime_1.getCrimesByCategory)(Number(categoryId));
    return (0, response_1.successResponse)(res, crimes, 200, 'Crimes retrieved successfully');
}));
exports.fetchGroupedCrimesByMonth = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const crimes = yield (0, crime_1.groupedCrimesByMonth)();
    const isEmpty = !crimes || Object.keys(crimes).length === 0;
    if (isEmpty) {
        return (0, response_1.errorResponse)(res, 'No crimes found for any month', 404);
    }
    (0, response_1.successResponse)(res, crimes, 200, 'crimes retrieved successfully');
}));
exports.fetchGroupedCrimesByMonthAndType = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const grouped = yield (0, crime_1.groupedCrimesByMonthAndType)();
    if (!grouped || Object.keys(grouped).length === 0) {
        return (0, response_1.errorResponse)(res, 'No crimes found for any month', 404);
    }
    (0, response_1.successResponse)(res, grouped, 200, 'Crimes grouped by month and type retrieved successfully');
}));
exports.fetchGroupedCrimesByCrimeName = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const grouped = yield (0, crime_1.groupCrimesByCrimeName)();
    if (!grouped || Object.keys(grouped).length === 0) {
        return (0, response_1.errorResponse)(res, 'No crimes found for any month', 404);
    }
    console.log(grouped);
    const formatted = grouped.map((item) => ({
        crime_name: item.crime_name,
        count: item._count.crime_name,
    }));
    (0, response_1.successResponse)(res, formatted, 200, 'Crimes grouped by crime_name retrieved successfully');
}));
exports.fetchGroupedCrimesByLocation = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const grouped = yield (0, crime_1.groupCrimesByLocation)();
    if (!grouped || Object.keys(grouped).length === 0) {
        return (0, response_1.errorResponse)(res, 'No crimes found for This location', 404);
    }
    const formatted = grouped.map((item) => ({
        location: item.location,
        count: item._count.location,
    }));
    (0, response_1.successResponse)(res, formatted, 200, 'Crimes grouped by location retrieved successfully');
}));
exports.fetchMostReportedCrime = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('fetching crime');
    const mostReported = yield (0, crime_1.getMostReportedCrime)();
    console.log(mostReported);
    if (!mostReported) {
        return (0, response_1.errorResponse)(res, 'No crimes found', 404);
    }
    const formatted = mostReported.map((item) => ({
        crime_name: item.crime_name,
        count: item._count.crime_name,
    }));
    (0, response_1.successResponse)(res, formatted, 200, 'Most reported crime retrieved successfully');
}));
const crime_2 = require("../services/crime");
exports.fetchLocationWithMostCrimes = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topLocation = yield (0, crime_2.getLocationWithMostCrimes)();
    if (!topLocation) {
        return (0, response_1.errorResponse)(res, 'No locations found', 404);
    }
    (0, response_1.successResponse)(res, topLocation, 200, 'Location with most crimes retrieved successfully');
}));
