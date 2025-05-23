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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.fetchUsers = exports.logout = exports.login = exports.verifyUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const sendEmail_1 = require("../helpers/sendEmail");
const emailTemplate_1 = __importDefault(require("../helpers/emailTemplate"));
const user_1 = require("../services/user");
const generateToken_1 = require("../helpers/generateToken");
const response_1 = require("../helpers/response");
const asyncHandler_1 = __importDefault(require("../helpers/asyncHandler"));
exports.registerUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, confirm_password, email } = req.body;
    const isUser = yield (0, user_1.findUserByEmail)(email);
    if (isUser) {
        return (0, response_1.errorResponse)(res, 'User with the provided email already exists! Please try using different email', 400);
    }
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    const body = Object.assign(Object.assign({}, req.body), { password: hashedPassword });
    const token = yield (0, generateToken_1.generateAccessToken)(body);
    const verificationLink = `${process.env.BASE_URL}/auth/verify/${token}`;
    yield (0, sendEmail_1.sendVerificationEmail)(body.email, (0, emailTemplate_1.default)(req.body.firstName, verificationLink));
    const newUser = yield (0, user_1.addUser)(body);
    const { password: _ } = newUser, userData = __rest(newUser, ["password"]);
    (0, response_1.successResponse)(res, userData, 201, 'User registered successfully. Please check your email to verify your account.');
}));
exports.verifyUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    if (!token) {
        return (0, response_1.errorResponse)(res, 'Invalid link! Please try again', 401);
    }
    const user = (0, generateToken_1.verifyAccessToken)(token);
    const payload = user.data;
    if (!payload) {
        return (0, response_1.errorResponse)(res, 'Verification failed. Please try again later or contact the admin', 401);
    }
    if (!user.success) {
        return (0, response_1.errorResponse)(res, 'Verification failed. Please try again later or contact the admin', 401);
    }
    const email = payload.email;
    const isUserVerified = yield (0, user_1.findUserByEmail)(email);
    if (isUserVerified === null || isUserVerified === void 0 ? void 0 : isUserVerified.isVerified) {
        return (0, response_1.errorResponse)(res, 'User already verified!', 400);
    }
    yield (0, user_1.updateVerifiedUser)(email);
    (0, response_1.successResponse)(res, user, 200, 'User verified successfully!');
}));
exports.login = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return (0, response_1.errorResponse)(res, 'Please provide both email and password', 400);
    }
    const user = yield (0, user_1.findUserByEmail)(email);
    if (!user) {
        return (0, response_1.errorResponse)(res, 'User not found! Please register to proceed', 404);
    }
    if (!user.isVerified) {
        return (0, response_1.errorResponse)(res, 'User not verified! Please verify your account to proceed', 401);
    }
    const matchedPassword = yield bcrypt_1.default.compare(password, user.password);
    if (!matchedPassword) {
        return (0, response_1.errorResponse)(res, 'Invalid email or password. Please try again with the correct credentials.', 401);
    }
    const token = yield (0, generateToken_1.generateAccessToken)(user);
    const userData = {
        firstName: user.firstName,
        email: user.email,
        role: user.role,
    };
    (0, response_1.successResponse)(res, { token, user: userData }, 200, 'Logged in successfully');
}));
exports.logout = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie('jwt', 'Loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    (0, response_1.successResponse)(res, null, 200, 'Logged out successfully');
}));
exports.fetchUsers = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        filter: req.query.filter,
        search: req.query.search || '',
    };
    const users = yield (0, user_1.fetchAllUsers)(body);
    if (!users) {
        return (0, response_1.errorResponse)(res, 'No users found', 404);
    }
    return (0, response_1.successResponse)(res, users, 200, 'Users retrieved successfully');
}));
exports.getUserById = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const user = yield (0, user_1.findUserById)(Number(id));
    if (!user) {
        return (0, response_1.errorResponse)(res, 'User not found', 404);
    }
    const data = Object.assign(Object.assign({}, user), { password: null });
    (0, response_1.successResponse)(res, data, 200, 'User retrieved successfully');
}));
exports.updateUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const image_url = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    const user = yield (0, user_1.findUserById)(Number(id));
    if (!user) {
        return (0, response_1.errorResponse)(res, 'User not found', 404);
    }
    if (user.status === 'DISACTIVE') {
        return (0, response_1.errorResponse)(res, 'User account is inactive! Please contact the admin to reactivate your account', 401);
    }
    if (user.isVerified === 'FALSE') {
        return (0, response_1.errorResponse)(res, 'User not verified! Please verify the account first to proceed', 401);
    }
    const data = Object.assign(Object.assign({}, req.body), { image_url });
    console.log(data);
    const updatedUser = yield (0, user_1.updateUserData)(Number(id), data);
    (0, response_1.successResponse)(res, updatedUser, 200, 'User updated successfully');
}));
exports.deleteUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield (0, user_1.findUserById)(Number(id));
    if (!user) {
        return (0, response_1.errorResponse)(res, 'User not found', 404);
    }
    if (user.status === 'DISACTIVE') {
        return (0, response_1.errorResponse)(res, 'User account is inactive! Please contact the admin to reactivate the account', 401);
    }
    yield (0, user_1.updateUserData)(Number(id), { status: 'DISACTIVE' });
    (0, response_1.successResponse)(res, null, 200, 'User deleted successfully');
}));
