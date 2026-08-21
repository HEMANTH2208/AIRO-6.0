import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "";
  
  // Safely mask password in URL for diagnostic output
  const maskedUrl = dbUrl.replace(/:[^:@]+@/, ":****@");

  const diagnosticInfo = {
    timestamp: new Date().toISOString(),
    env: {
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      hasDirectUrl: Boolean(process.env.DIRECT_URL),
      maskedDatabaseUrl: maskedUrl,
      nodeEnv: process.env.NODE_ENV,
    },
    databaseTest: "pending",
    errorDetails: null as any,
  };

  try {
    const eventCount = await prisma.event.count();
    diagnosticInfo.databaseTest = `SUCCESS! Found ${eventCount} events.`;
    return NextResponse.json(diagnosticInfo, { status: 200 });
  } catch (err: any) {
    console.error("DB Diagnostic Error:", err);
    diagnosticInfo.databaseTest = "FAILED";
    diagnosticInfo.errorDetails = {
      name: err?.name || "UnknownError",
      message: err?.message || String(err),
      code: err?.code,
      meta: err?.meta,
      stack: err?.stack,
    };
    return NextResponse.json(diagnosticInfo, { status: 500 });
  }
}
