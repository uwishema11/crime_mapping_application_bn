"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const isProduction = process.env.NODE_ENV === 'production';
exports.prisma = new client_1.PrismaClient({
    datasourceUrl: isProduction
        ? process.env.DATABASE_URL_PROD
        : process.env.DATABASE_URL,
    transactionOptions: {
        maxWait: 10000,
        timeout: 20000,
    },
});
