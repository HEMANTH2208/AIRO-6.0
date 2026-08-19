import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { registration_id, undo } = body;

    if (!registration_id) {
      return NextResponse.json({ error: "Registration ID required" }, { status: 400 });
    }

    const team = await prisma.team.findUnique({
      where: { registration_id },
      include: { registration: true },
    });

    if (!team) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    if (!team.registration) {
      return NextResponse.json({ error: "Registration record not found" }, { status: 404 });
    }

    if (undo) {
      await prisma.registration.update({
        where: { team_id: team.id },
        data: {
          checked_in: 0,
          checked_in_at: null,
        },
      });
      return NextResponse.json({ success: true, message: "Check-in undone successfully" });
    }

    if (team.registration.checked_in) {
      return NextResponse.json(
        { error: "Already checked in", already_checked_in: true },
        { status: 409 }
      );
    }

    await prisma.registration.update({
      where: { team_id: team.id },
      data: {
        checked_in: 1,
        checked_in_at: new Date(),
      },
    });

    return NextResponse.json({ success: true, message: "Team checked in successfully" });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json({ error: "Check-in failed" }, { status: 500 });
  }
}
