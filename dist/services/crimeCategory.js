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
exports.getCategoriesByCrimeId = exports.getCrimesByCategoryId = exports.deleteCrimeCategory = exports.updateCrimeCategory = exports.getCrimeCategoryById = exports.getAllCrimeCategories = exports.createCrimeCategory = void 0;
const prismaClient_1 = require("../db/prismaClient");
const createCrimeCategory = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryData = {
        name: data.name,
        description: data.description,
        category_author: data.category_author,
    };
    return yield prismaClient_1.prisma.crimeCategory.create({
        data: categoryData,
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
    const existingCategory = yield prismaClient_1.prisma.crimeCategory.findUnique({
        where: { id },
    });
    if (!existingCategory) {
        return null;
    }
    return yield prismaClient_1.prisma.crimeCategory.update({
        where: { id },
        data: Object.assign(Object.assign({}, data), { crimes: data.crimes
                ? {
                    set: data.crimes.map((crime) => ({ id: crime.crime_id })),
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
