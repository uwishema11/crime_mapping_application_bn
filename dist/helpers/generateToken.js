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
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;
if (!secret || !refreshSecret) {
    throw new Error('JWT secrets are not defined in the environment variables');
}
// Access token expires in 15 minutes
const generateAccessToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };
    const options = { expiresIn: '7d' };
    return jsonwebtoken_1.default.sign(payload, secret, options);
});
exports.generateAccessToken = generateAccessToken;
// Refresh token expires in 7 days
const generateRefreshToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };
    const options = { expiresIn: '7d' };
    return jsonwebtoken_1.default.sign(payload, refreshSecret, options);
});
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return { success: true, data: decoded };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, refreshSecret);
        return { success: true, data: decoded };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
