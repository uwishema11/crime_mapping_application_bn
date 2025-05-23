import { PrismaClient } from '@prisma/client';

const isProduction = process.env.NODE_ENV === 'production';
export const prisma = new PrismaClient({
  datasourceUrl: isProduction
    ? process.env.DATABASE_URL_PROD
    : process.env.DATABASE_URL,
  transactionOptions: {
    maxWait: 10000,
    timeout: 20000,
  },
});
