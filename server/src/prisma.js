const { PrismaClient } = require('@prisma/client');

// Single shared PrismaClient. Reusing one instance avoids the multi-instance
// warnings/handles you get from `new PrismaClient()` in every module (and any
// SQLITE_BUSY contention from parallel writers).
const globalForPrisma = globalThis;
const prisma = globalForPrisma.__ichrPrisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.__ichrPrisma = prisma;

module.exports = prisma;
