import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();

    const team = db
      .prepare(
        `SELECT t.*, e.name as event_name, e.slug as event_slug, e.duration as event_duration,
                r.qr_code, r.registration_status, r.checked_in, r.checked_in_at, r.created_at as registered_at
         FROM teams t
         JOIN events e ON t.event_id = e.id
         JOIN registrations r ON r.team_id = t.id
         WHERE t.registration_id = ?`
      )
      .get(id);

    if (!team) return NextResponse.json({ error: "Registration not found" }, { status: 404 });

    const participants = db
      .prepare("SELECT * FROM participants WHERE team_id = ? ORDER BY is_team_lead DESC")
      .all((team as { id: number }).id);

    return NextResponse.json({ team, participants });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch registration" }, { status: 500 });
  }
}
