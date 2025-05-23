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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoriesByCrimeId = exports.getCrimesByCategoryId = exports.deleteCrimeCategory = exports.updateCrimeCategory = exports.getCrimeCategoryById = exports.getAllCrimeCategories = exports.createCrimeCategory = void 0;
const prismaClient_1 = require("../db/prismaClient");
const createCrimeCategory = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { crimes } = data, categoryData = __rest(data, ["crimes"]);
    return yield prismaClient_1.prisma.crimeCategory.create({
        data: Object.assign(Object.assign({}, categoryData), { crimes: {
                create: crimes || [],
            } }),
        include: {
            crimes: true,
        },
    });
});
exports.createCrimeCategory = createCrimeCategory;
const getAllCrimeCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.crimeCategory.findMany();
});
exports.getAllCrimeCategories = getAllCrimeCategories;
const getCrimeCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.crimeCategory.findUnique({
        where: { id },
        include: {
            crimes: true,
        },
    });
});
exports.getCrimeCategoryById = getCrimeCategoryById;
const updateCrimeCategory = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.crimeCategory.update({
        where: { id },
        data: Object.assign(Object.assign({}, data), { crimes: data.crimes
                ? {
                    set: data.crimes.map((crime) => ({ id: crime.id })),
                }
                : undefined }),
    });
});
exports.updateCrimeCategory = updateCrimeCategory;
const deleteCrimeCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.crimeCategory.delete({
        where: { id },
    });
});
exports.deleteCrimeCategory = deleteCrimeCategory;
const getCrimesByCategoryId = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.crime.findMany({
        where: { categoryId },
    });
});
exports.getCrimesByCategoryId = getCrimesByCategoryId;
const getCategoriesByCrimeId = (crimeId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.crimeCategory.findMany({
        where: { crimes: { some: { id: crimeId } } },
    });
});
exports.getCategoriesByCrimeId = getCategoriesByCrimeId;
