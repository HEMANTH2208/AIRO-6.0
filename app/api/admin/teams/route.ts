import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

    const where: any = {};

    if (event) {
      where.event = { name: { contains: event, mode: "insensitive" } };
    }
    if (college) {
      where.college_name = { contains: college, mode: "insensitive" };
    }
    if (department) {
      where.department = { contains: department, mode: "insensitive" };
    }
    if (teamName) {
      where.team_name = { contains: teamName, mode: "insensitive" };
    }
    if (regId) {
      where.registration_id = { contains: regId, mode: "insensitive" };
    }
    if (checkedIn !== null && checkedIn !== "") {
      where.registration = { checked_in: checkedIn === "true" ? 1 : 0 };
    }

    const teamsData = await prisma.team.findMany({
      where,
      include: {
        event: true,
        registration: true,
        participants: {
          orderBy: { is_team_lead: "desc" },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const teams = teamsData.map((t) => ({
      id: t.id,
      registration_id: t.registration_id,
      event_id: t.event_id,
      team_name: t.team_name,
      college_name: t.college_name,
      department: t.department,
      created_at: t.created_at,
      updated_at: t.updated_at,
      event_name: t.event.name,
      registration_status: t.registration?.registration_status,
      checked_in: t.registration?.checked_in,
      checked_in_at: t.registration?.checked_in_at,
      registered_at: t.registration?.created_at,
      participants: t.participants,
    }));

    return NextResponse.json({ teams });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 });
  }
}
