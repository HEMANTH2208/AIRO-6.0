import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "pg",
    "@prisma/adapter-pg",
    "@prisma/client",
    "better-sqlite3",
    "bcryptjs",
  ],
  turbopack: {},
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
