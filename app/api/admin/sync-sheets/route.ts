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
      return NextResponse.json(
        {
          error: "Google Sheets not configured",
          message:
            "Please add GOOGLE_SHEETS_PRIVATE_KEY, GOOGLE_SHEETS_CLIENT_EMAIL, and GOOGLE_SHEETS_SPREADSHEET_ID to .env.local",
        },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await req.json();
    const eventId = body.event_id ? Number(body.event_id) : undefined;

    // Sync to Google Sheets
    const sheetUrl = await syncToGoogleSheets(eventId);

    return NextResponse.json({
      success: true,
      message: "Data synced successfully to Google Sheets",
      sheetUrl,
    });
  } catch (error) {
    console.error("Google Sheets sync error:", error);
    return NextResponse.json(
      {
        error: "Sync failed",
        message: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      configured: isGoogleSheetsConfigured(),
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID || null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check configuration" },
      { status: 500 }
    );
  }
}
