import { NextRequest, NextResponse } from "next/server";
import { exportToExcel } from "@/lib/export";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("event_id");

    const buffer = await exportToExcel(eventId ? Number(eventId) : undefined);
    const fileName = eventId ? `AIRO6_Event_${eventId}_Registrations.xlsx` : "AIRO6_All_Registrations.xlsx";

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
