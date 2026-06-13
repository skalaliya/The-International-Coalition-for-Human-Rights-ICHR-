// Server-only Prisma client singleton (reused across SSR pages + API endpoints).
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { __ichrPrisma?: PrismaClient };

export const prisma = globalForPrisma.__ichrPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.__ichrPrisma = prisma;
