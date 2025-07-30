"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCrimeSchema = exports.createCrimeSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createCrimeSchema = joi_1.default.object({
    name: joi_1.default.string().required().min(3).max(100),
    description: joi_1.default.string().required().min(10).max(1000),
    categoryId: joi_1.default.number().required(),
});
exports.updateCrimeSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).max(100),
    description: joi_1.default.string().min(10).max(1000),
    categoryId: joi_1.default.number(),
});
