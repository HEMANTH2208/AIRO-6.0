import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { registration_id } = body;

    if (!registration_id) {
      return NextResponse.json({ error: "Registration ID required" }, { status: 400 });
    }

    const db = getDb();

    const team = db
      .prepare("SELECT id FROM teams WHERE registration_id = ?")
      .get(registration_id) as { id: number } | undefined;

    if (!team) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    const reg = db
      .prepare("SELECT checked_in FROM registrations WHERE team_id = ?")
      .get(team.id) as { checked_in: number } | undefined;

    if (!reg) {
      return NextResponse.json({ error: "Registration record not found" }, { status: 404 });
    }

    if (reg.checked_in) {
      return NextResponse.json(
        { error: "Already checked in", already_checked_in: true },
        { status: 409 }
      );
    }

    db.prepare(
      "UPDATE registrations SET checked_in = 1, checked_in_at = CURRENT_TIMESTAMP WHERE team_id = ?"
    ).run(team.id);

    return NextResponse.json({ success: true, message: "Team checked in successfully" });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json({ error: "Check-in failed" }, { status: 500 });
  }
}
