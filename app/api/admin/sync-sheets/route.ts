import { NextRequest, NextResponse } from "next/server";
import { syncToGoogleSheets, isGoogleSheetsConfigured } from "@/lib/googleSheets";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if Google Sheets is configured
    if (!isGoogleSheetsConfigured()) {
      const missing = [
        !process.env.GOOGLE_SHEETS_PRIVATE_KEY && "GOOGLE_SHEETS_PRIVATE_KEY",
        !process.env.GOOGLE_SHEETS_CLIENT_EMAIL && "GOOGLE_SHEETS_CLIENT_EMAIL",
        !process.env.GOOGLE_SHEETS_SPREADSHEET_ID && "GOOGLE_SHEETS_SPREADSHEET_ID",
      ].filter(Boolean);
      return NextResponse.json(
        {
          error: "Google Sheets not configured",
          message: `Missing environment variables on Vercel: ${missing.join(", ")}. Go to Vercel Dashboard → Project → Settings → Environment Variables and add them.`,
          missing,
        },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await req.json().catch(() => ({}));
    const eventId = body.event_id ? Number(body.event_id) : undefined;

    // Sync to Google Sheets
    const sheetUrl = await syncToGoogleSheets(eventId);

    return NextResponse.json({
      success: true,
      message: "Data synced successfully to Google Sheets",
      sheetUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    const stack = error instanceof Error ? error.stack : undefined;
    console.error("Google Sheets sync error:", error);
    return NextResponse.json(
      {
        error: "Sync failed",
        message,
        // Include stack in non-production for easier debugging
        ...(process.env.NODE_ENV !== "production" && { stack }),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hasKey = !!process.env.GOOGLE_SHEETS_PRIVATE_KEY;
    const hasEmail = !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    const hasSheetId = !!process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    return NextResponse.json({
      configured: hasKey && hasEmail && hasSheetId,
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID || null,
      // Diagnostic flags — do NOT expose the actual key values
      envVars: {
        GOOGLE_SHEETS_PRIVATE_KEY: hasKey ? `set (${process.env.GOOGLE_SHEETS_PRIVATE_KEY!.length} chars)` : "MISSING",
        GOOGLE_SHEETS_CLIENT_EMAIL: hasEmail ? process.env.GOOGLE_SHEETS_CLIENT_EMAIL : "MISSING",
        GOOGLE_SHEETS_SPREADSHEET_ID: hasSheetId ? process.env.GOOGLE_SHEETS_SPREADSHEET_ID : "MISSING",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check configuration" },
      { status: 500 }
    );
  }
}
