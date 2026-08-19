import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const event = searchParams.get("event");
    const college = searchParams.get("college");
    const department = searchParams.get("department");
    const teamName = searchParams.get("team_name");
    const regId = searchParams.get("registration_id");
    const checkedIn = searchParams.get("checked_in");

    let query = `
      SELECT t.*, e.name as event_name, r.registration_status, r.checked_in, r.checked_in_at, r.created_at as registered_at
      FROM teams t
      JOIN events e ON t.event_id = e.id
      JOIN registrations r ON r.team_id = t.id
      WHERE 1=1
    `;
    const params: (string | number)[] = [];

    if (event) { query += " AND e.name LIKE ?"; params.push(`%${event}%`); }
    if (college) { query += " AND t.college_name LIKE ?"; params.push(`%${college}%`); }
    if (department) { query += " AND t.department LIKE ?"; params.push(`%${department}%`); }
    if (teamName) { query += " AND t.team_name LIKE ?"; params.push(`%${teamName}%`); }
    if (regId) { query += " AND t.registration_id LIKE ?"; params.push(`%${regId}%`); }
    if (checkedIn !== null && checkedIn !== "") {
      query += " AND r.checked_in = ?";
      params.push(checkedIn === "true" ? 1 : 0);
    }

    query += " ORDER BY r.created_at DESC";

    const db = getDb();
    const teams = db.prepare(query).all(...params);

    // Attach participants to each team
    const result = teams.map((team) => {
      const t = team as { id: number };
      const participants = db
        .prepare("SELECT * FROM participants WHERE team_id = ? ORDER BY is_team_lead DESC")
        .all(t.id);
      return { ...(team as Record<string, unknown>), participants };
    });

    return NextResponse.json({ teams: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 });
  }
}
