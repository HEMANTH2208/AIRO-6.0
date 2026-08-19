import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const body = await req.json();
    const { registration_status, checked_in } = body;
    const db = getDb();
    if (registration_status !== undefined) {
      db.prepare("UPDATE registrations SET registration_status=? WHERE id=?").run(
        registration_status,
        id
      );
    }
    if (checked_in !== undefined) {
      if (checked_in) {
        db.prepare(
          "UPDATE registrations SET checked_in=1, checked_in_at=CURRENT_TIMESTAMP WHERE id=?"
        ).run(id);
      } else {
        db.prepare(
          "UPDATE registrations SET checked_in=0, checked_in_at=NULL WHERE id=?"
        ).run(id);
      }
    }
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
    // Get team_id first, delete team (cascade deletes registration + participants)
    const reg = db.prepare("SELECT team_id FROM registrations WHERE id=?").get(id) as
      | { team_id: number }
      | undefined;
    if (reg) {
      db.prepare("DELETE FROM teams WHERE id=?").run(reg.team_id);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
