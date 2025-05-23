"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userSchema = joi_1.default.object().keys({
    firstName: joi_1.default.string().alphanum().required(),
    lastName: joi_1.default.string().alphanum().required(),
    email: joi_1.default.string().email().required(),
    role: joi_1.default.string().uppercase().valid('ADMIN', 'USER', 'SUPERADMIN'),
    phone_number: joi_1.default.string()
        .pattern(/^[0-9]{10,15}$/)
        .optional()
        .messages({
        'string.pattern.base': 'Phone number must be between 10 and 15 digits',
    }),
    date_of_birth: joi_1.default.date().optional(),
    gender: joi_1.default.string().valid('MALE', 'FEMALE', 'OTHER').optional(),
    image_url: joi_1.default.string().uri().optional(),
    password: joi_1.default.string()
        .required()
        .min(6)
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
        .strict(),
    confirm_password: joi_1.default.string().valid(joi_1.default.ref('password')).required().strict(),
});
