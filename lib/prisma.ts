import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prisma: PrismaClient;

if (!globalForPrisma.prisma) {
  const connectionString = process.env.DATABASE_URL;
  const isLocal = connectionString?.includes("localhost") || connectionString?.includes("127.0.0.1");
  
  const pool = new Pool({
    connectionString,
    ssl: isLocal ? undefined : { rejectUnauthorized: false },
  });
  
  const adapter = new PrismaPg(pool);
  
  globalForPrisma.prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

prisma = globalForPrisma.prisma;

export { prisma };
export default prisma;
