"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReportStatusSchema = exports.createReportSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createReportSchema = joi_1.default.object({
    crimeId: joi_1.default.number().required(),
    description: joi_1.default.string().required().min(10).max(1000),
    location: joi_1.default.string().required().min(5).max(200),
    incidentDate: joi_1.default.date().required().max('now'),
    evidence: joi_1.default.string().uri().allow(''),
    contactNumber: joi_1.default.string().pattern(/^\+?[1-9]\d{1,14}$/).allow(''),
    categoryId: joi_1.default.number().required(),
});
exports.updateReportStatusSchema = joi_1.default.object({
    status: joi_1.default.string()
        .valid('PENDING', 'UNDER_REVIEW', 'INVESTIGATING', 'RESOLVED', 'REJECTED')
        .required(),
});
