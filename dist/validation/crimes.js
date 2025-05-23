"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crimeValidation = exports.crimeCategoryValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.crimeCategoryValidation = joi_1.default.object({
    name: joi_1.default.string().required(),
    description: joi_1.default.string().optional(),
    category_author: joi_1.default.string(),
    crimes: joi_1.default.array()
        .items(joi_1.default.object({
        title: joi_1.default.string().required(),
        description: joi_1.default.string().optional(),
        location: joi_1.default.string().required(),
        reportedAt: joi_1.default.date().required(),
    }))
        .optional(),
});
exports.crimeValidation = joi_1.default.array().items(joi_1.default.object({
    title: joi_1.default.string().required(),
    description: joi_1.default.string().optional(),
    location: joi_1.default.string().required(),
    reportedAt: joi_1.default.date().required(),
    userId: joi_1.default.number().required(),
}));
