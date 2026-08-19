import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const db = getDb();
    const team = db
      .prepare(
        `SELECT t.*, e.name as event_name, r.registration_status, r.checked_in, r.checked_in_at
         FROM teams t JOIN events e ON t.event_id = e.id
         JOIN registrations r ON r.team_id = t.id WHERE t.id = ?`
      )
      .get(id);
    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });
    const participants = db.prepare("SELECT * FROM participants WHERE team_id = ?").all(id);
    return NextResponse.json({ team, participants });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const body = await req.json();
    const { team_name, college_name, department } = body;
    const db = getDb();
    db.prepare(
      "UPDATE teams SET team_name=?, college_name=?, department=?, updated_at=CURRENT_TIMESTAMP WHERE id=?"
    ).run(team_name, college_name, department, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const db = getDb();
    db.prepare("DELETE FROM teams WHERE id = ?").run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
