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
exports.deleteCrimeCategoryController = exports.updateCrimeCategoryController = exports.getAllCrimeCategoriesController = exports.createCrimeCategoryController = void 0;
const asyncHandler_1 = __importDefault(require("../helpers/asyncHandler"));
const response_1 = require("../helpers/response");
const crimeCategory_1 = require("../services/crimeCategory");
exports.createCrimeCategoryController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const category_author = (_b = req.user) === null || _b === void 0 ? void 0 : _b.email;
    const category = Object.assign(Object.assign({}, req.body), { userId: userId, category_author: category_author });
    const newCategory = yield (0, crimeCategory_1.createCrimeCategory)(category);
    (0, response_1.successResponse)(res, newCategory, 201, 'Crime category created successfully');
}));
exports.getAllCrimeCategoriesController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield (0, crimeCategory_1.getAllCrimeCategories)();
    if (!categories) {
        return (0, response_1.errorResponse)(res, 'No crime categories found', 404);
    }
    if (categories.length === 0) {
        return (0, response_1.errorResponse)(res, 'No categories Available', 404);
    }
    (0, response_1.successResponse)(res, categories, 200, 'Crime categories retrieved successfully');
}));
exports.updateCrimeCategoryController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const category = yield (0, crimeCategory_1.updateCrimeCategory)(Number(id), req.body);
    if (!category) {
        res.status(404).json({
            message: 'Crime category not found',
        });
        return;
    }
    res.status(200).json({
        message: 'Crime category updated successfully',
        data: category,
    });
}));
exports.deleteCrimeCategoryController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const category = yield (0, crimeCategory_1.deleteCrimeCategory)(Number(id));
    if (!category) {
        (0, response_1.errorResponse)(res, 'Crime category not found', 404);
        return;
    }
    return (0, response_1.successResponse)(res, null, 200, 'Crime category deleted successfully');
}));
