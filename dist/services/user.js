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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserData = exports.updateUserRole = exports.findUserById = exports.fetchAllUsers = exports.updateVerifiedUser = exports.findUserByEmail = exports.addUser = void 0;
const prismaClient_1 = require("../db/prismaClient");
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
const addUser = (newUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { confirm_password } = newUser, userData = __rest(newUser, ["confirm_password"]);
    const registeredUser = yield prismaClient_1.prisma.user.create({
        data: Object.assign({}, userData),
    });
    return registeredUser;
});
exports.addUser = addUser;
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prismaClient_1.prisma.user.findUnique({
        where: {
            email,
        },
    });
    return user;
});
exports.findUserByEmail = findUserByEmail;
const updateVerifiedUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.user.update({
        where: { email },
        data: {
            isVerified: client_1.VerificationStatus.VERIFIED,
            status: client_2.UserStatus.ACTIVE,
            updated_at: new Date(),
        },
    });
});
exports.updateVerifiedUser = updateVerifiedUser;
const fetchAllUsers = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { filter, search, page, limit } = user;
    const whereClouse = Object.assign(Object.assign({}, (filter ? { status: filter } : {})), (search
        ? {
            OR: [
                {
                    firstName: {
                        contains: search.toLowerCase(),
                        mode: client_1.Prisma.QueryMode.insensitive,
                    },
                },
                {
                    lastName: {
                        contains: search.toLowerCase(),
                        mode: client_1.Prisma.QueryMode.insensitive,
                    },
                },
                {
                    email: {
                        contains: search.toLowerCase(),
                        mode: client_1.Prisma.QueryMode.insensitive,
                    },
                },
            ],
        }
        : {}));
    const skip = (page - 1) * limit;
    const take = limit;
    const users = yield prismaClient_1.prisma.user.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            image_url: true,
            email: true,
            role: true,
            isVerified: true,
            status: true,
        },
        where: whereClouse,
        skip,
        take,
        orderBy: {
            created_at: 'desc',
        },
    });
    const total = yield prismaClient_1.prisma.user.count({
        where: whereClouse,
    });
    const totalPages = Math.ceil(total / limit);
    return {
        data: users,
        pagination: {
            total,
            page: Number(page),
            per_page: Number(limit),
            totalPages,
        },
    };
});
exports.fetchAllUsers = fetchAllUsers;
const findUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prismaClient_1.prisma.user.findUnique({
        where: {
            id,
        },
    });
    return user;
});
exports.findUserById = findUserById;
const updateUserRole = (email, role) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.user.update({
        where: { email },
        data: {
            role,
            updated_at: new Date(),
        },
    });
});
exports.updateUserRole = updateUserRole;
const updateUserData = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.user.update({
        where: { id },
        data: Object.assign(Object.assign({}, data), { updated_at: new Date() }),
    });
});
exports.updateUserData = updateUserData;
