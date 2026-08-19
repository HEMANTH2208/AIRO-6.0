import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = getDb();

    const totalRegistrations = (
      db.prepare("SELECT COUNT(*) as cnt FROM registrations").get() as { cnt: number }
    ).cnt;

    const totalTeams = (
      db.prepare("SELECT COUNT(*) as cnt FROM teams").get() as { cnt: number }
    ).cnt;

    const checkedIn = (
      db.prepare("SELECT COUNT(*) as cnt FROM registrations WHERE checked_in = 1").get() as {
        cnt: number;
      }
    ).cnt;

    const byEvent = db
      .prepare(
        `SELECT e.name as event, COUNT(t.id) as count
         FROM events e
         LEFT JOIN teams t ON t.event_id = e.id
         GROUP BY e.id ORDER BY e.id`
      )
      .all();

    const byCollege = db
      .prepare(
        `SELECT college_name, COUNT(*) as count FROM teams GROUP BY college_name ORDER BY count DESC LIMIT 10`
      )
      .all();

    const recentRegistrations = db
      .prepare(
        `SELECT t.registration_id, t.team_name, e.name as event_name, t.college_name,
                r.registration_status, r.checked_in, r.created_at
         FROM teams t
         JOIN events e ON t.event_id = e.id
         JOIN registrations r ON r.team_id = t.id
         ORDER BY r.created_at DESC LIMIT 10`
      )
      .all();

    return NextResponse.json({
      totalRegistrations,
      totalTeams,
      checkedIn,
      pendingCheckin: totalTeams - checkedIn,
      byEvent,
      byCollege,
      recentRegistrations,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
