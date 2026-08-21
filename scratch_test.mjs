import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { prisma } from "./lib/prisma";

async function test() {
  try {
    console.log("Testing connection to DATABASE_URL:", process.env.DATABASE_URL?.replace(/:[^:@]+@/, ":****@"));
    const events = await prisma.event.findMany();
    console.log("SUCCESS! Events count:", events.length);
    console.log("Events:", events.map(e => e.name));
  } catch (err) {
    console.error("CONNECTION ERROR:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
