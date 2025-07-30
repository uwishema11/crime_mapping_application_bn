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
exports.deleteUser = exports.updateUser = exports.getUserById = exports.fetchUsers = exports.logout = exports.login = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../services/user");
const generateToken_1 = require("../helpers/generateToken");
const response_1 = require("../helpers/response");
const asyncHandler_1 = __importDefault(require("../helpers/asyncHandler"));
exports.registerUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { password, email, confirm_password } = _a, rest = __rest(_a, ["password", "email", "confirm_password"]);
    const isUser = yield (0, user_1.findUserByEmail)(email);
    if (isUser) {
        return (0, response_1.errorResponse)(res, 'User with the provided email already exists! Please try using different email', 400);
    }
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    const body = Object.assign(Object.assign({}, rest), { email, password: hashedPassword });
    const newUser = yield (0, user_1.addUser)(body);
    const { password: _ } = newUser, userData = __rest(newUser, ["password"]);
    (0, response_1.successResponse)(res, userData, 201, 'User registered successfully.');
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
        limit: parseInt(req.query.limit) || 50,
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
    const data = Object.assign(Object.assign({}, req.body), { image_url });
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
