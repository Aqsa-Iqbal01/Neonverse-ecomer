import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createClient() {
  try {
    return new PrismaClient();
  } catch {
    return null;
  }
}

export const prisma: PrismaClient | null = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma as PrismaClient;

/** True when a DATABASE_URL is configured and Prisma can connect. */
export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
