import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Prisma client singleton for Next.js.
 *
 * WHY a driver adapter (PrismaPg):
 * Prisma v7 removed the built-in query engine. Instead, it uses
 * "driver adapters" — thin wrappers around native database drivers.
 * PrismaPg wraps the `pg` library. This means:
 *   1. No binary engine to download (faster installs)
 *   2. Smaller bundle size
 *   3. Direct control over the connection pool
 *
 * WHY a singleton on globalThis:
 * In development, Next.js hot-reloads modules on every file save.
 * Each reload would create a new PrismaClient, opening a new
 * connection pool. After a few saves you'd hit Neon's connection
 * limit. Caching on globalThis survives hot reloads because
 * globalThis is not cleared — only module scope is.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter }) as unknown as PrismaClient;
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
