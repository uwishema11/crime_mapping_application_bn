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
const generateToken_1 = require("../helpers/generateToken");
const user_1 = require("../services/user");
const protectedRoute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        else if (req.query.token) {
            token = req.query.token;
        }
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized to access this page! Please login first to proceed',
            });
            return;
        }
        const user = (0, generateToken_1.verifyAccessToken)(token);
        if (!user.success) {
            res.status(401).json({
                success: false,
                message: ' your session as expired, Please login again to proceed',
            });
            return;
        }
        const payload = user.data;
        const isUserExist = yield (0, user_1.findUserByEmail)(payload.email);
        if (!isUserExist) {
            res.status(401).json({
                success: false,
                message: 'User not found! Please register to proceed',
            });
            return;
        }
        req.user = isUserExist;
        next();
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        res.status(500).json({ success: false, message: errorMessage });
    }
    return;
});
exports.default = protectedRoute;
