import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";

// Ensure environment variables from .env.local are loaded if running outside Next.js lifecycle (e.g. scripts, seeds)
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: ".env.local" });
  dotenv.config();
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("❌ CRITICAL: DATABASE_URL is not set in environment variables!");
  }

  const isLocal = connectionString?.includes("localhost") || connectionString?.includes("127.0.0.1");

  const pool = new Pool({
    connectionString: connectionString || "",
    ssl: isLocal ? undefined : { rejectUnauthorized: false },
    max: 2, // Cap connection pool for serverless environments
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = createPrismaClient();
}

export const prisma = globalForPrisma.prisma;
export default prisma;
