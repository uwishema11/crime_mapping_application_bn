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
exports.getLocationWithMostCrimes = exports.getMostReportedCrime = exports.groupCrimesByCrimeName = exports.groupCrimesByLocation = exports.getCrimesByCategory = exports.deleteCrime = exports.updateCrime = exports.getAllCrimes = exports.getCrimeById = exports.createCrime = void 0;
exports.groupedCrimesByMonthAndType = groupedCrimesByMonthAndType;
exports.groupedCrimesByMonth = groupedCrimesByMonth;
const prismaClient_1 = require("../db/prismaClient");
const date_fns_1 = require("date-fns");
function groupedCrimesByMonthAndType() {
    return __awaiter(this, void 0, void 0, function* () {
        const crimes = yield prismaClient_1.prisma.crime.findMany({
            select: {
                incidentDate: true,
                crime_name: true,
            },
        });
        const result = {};
        for (const crime of crimes) {
            if (!crime.incidentDate)
                continue;
            const month = (0, date_fns_1.format)(crime.incidentDate, 'MMMM');
            const crimeName = crime.crime_name;
            if (!result[month]) {
                result[month] = { total: 0, crimes: {} };
            }
            result[month].total += 1;
            result[month].crimes[crimeName] =
                (result[month].crimes[crimeName] || 0) + 1;
        }
        return result;
    });
}
const createCrime = (adminId, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.crime.create({
        data: Object.assign(Object.assign({}, data), { crime_name: data.name, createdBy: adminId }),
        include: {
            category: true,
        },
    });
});
exports.createCrime = createCrime;
const getCrimeById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.crime.findUnique({
        where: { id },
        include: {
            category: true,
        },
    });
});
exports.getCrimeById = getCrimeById;
const getAllCrimes = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.crime.findMany({
        include: {
            category: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
});
exports.getAllCrimes = getAllCrimes;
const updateCrime = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.crime.update({
        where: { id },
        data,
        include: {
            category: true,
        },
    });
});
exports.updateCrime = updateCrime;
const deleteCrime = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.crime.delete({
        where: { id },
    });
});
exports.deleteCrime = deleteCrime;
const getCrimesByCategory = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.crime.findMany({
        where: { categoryId },
        include: {
            category: true,
        },
    });
});
exports.getCrimesByCategory = getCrimesByCategory;
function groupedCrimesByMonth() {
    return __awaiter(this, void 0, void 0, function* () {
        const crimes = yield prismaClient_1.prisma.crime.findMany({
            select: {
                incidentDate: true,
            },
        });
        const counts = {};
        for (const crime of crimes) {
            if (crime.incidentDate) {
                const month = (0, date_fns_1.format)(crime.incidentDate, 'MMMM');
                counts[month] = (counts[month] || 0) + 1;
            }
        }
        return counts;
    });
}
const groupCrimesByLocation = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.crime.groupBy({
        by: ['location'],
        _count: { location: true },
        orderBy: { _count: { location: 'desc' } },
    });
});
exports.groupCrimesByLocation = groupCrimesByLocation;
const groupCrimesByCrimeName = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.crime.groupBy({
        by: ['crime_name'],
        _count: { crime_name: true },
        orderBy: { _count: { crime_name: 'desc' } },
    });
});
exports.groupCrimesByCrimeName = groupCrimesByCrimeName;
// Get the most reported crime name
const getMostReportedCrime = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prismaClient_1.prisma.crime.groupBy({
        by: ['crime_name'],
        _count: { crime_name: true },
        orderBy: { _count: { crime_name: 'desc' } },
        take: 3,
    });
    return result;
});
exports.getMostReportedCrime = getMostReportedCrime;
// Get the location with the highest number of crimes
const getLocationWithMostCrimes = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prismaClient_1.prisma.crime.groupBy({
        by: ['location'],
        _count: { location: true },
        orderBy: { _count: { location: 'desc' } },
        take: 1,
    });
    return result[0]
        ? { location: result[0].location, count: result[0]._count.location }
        : null;
});
exports.getLocationWithMostCrimes = getLocationWithMostCrimes;
