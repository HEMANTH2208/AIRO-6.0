import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const db = getDb();
    const events = db.prepare("SELECT * FROM events ORDER BY id").all();
    return NextResponse.json({ events });
  } catch (error) {
    console.error("GET /api/events error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, slug, description, duration, min_team_size, max_team_size, status } = body;

    if (!name || !slug || !min_team_size || !max_team_size) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = getDb();
    const result = db
      .prepare(
        `INSERT INTO events (name, slug, description, duration, min_team_size, max_team_size, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(name, slug, description, duration, min_team_size, max_team_size, status || "active");

    const event = db.prepare("SELECT * FROM events WHERE id = ?").get(result.lastInsertRowid);
    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("POST /api/events error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
