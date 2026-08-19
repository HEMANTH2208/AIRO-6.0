import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { qr_data, registration_id: regIdInput } = body;

    let registrationId = regIdInput;

    // Parse QR data if provided
    if (qr_data && !registrationId) {
      try {
        const parsed = JSON.parse(qr_data);
        registrationId = parsed.id;
      } catch {
        registrationId = qr_data.trim();
      }
    }

    if (!registrationId) {
      return NextResponse.json({ error: "Registration ID is required" }, { status: 400 });
    }

    const db = getDb();

    const result = db
      .prepare(
        `SELECT t.*, e.name as event_name, r.qr_code, r.registration_status, r.checked_in, r.checked_in_at, r.created_at as registered_at
         FROM teams t
         JOIN events e ON t.event_id = e.id
         JOIN registrations r ON r.team_id = t.id
         WHERE t.registration_id = ?`
      )
      .get(registrationId);

    if (!result) {
      return NextResponse.json({ error: "Registration not found", valid: false }, { status: 404 });
    }

    const team = result as {
      id: number;
      registration_id: string;
      event_name: string;
      team_name: string;
      college_name: string;
      department: string;
      qr_code: string;
      registration_status: string;
      checked_in: number;
      checked_in_at: string | null;
      registered_at: string;
    };

    const participants = db
      .prepare("SELECT * FROM participants WHERE team_id = ? ORDER BY is_team_lead DESC")
      .all(team.id);

    return NextResponse.json({
      valid: true,
      team,
      participants,
    });
  } catch (error) {
    console.error("QR verify error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
