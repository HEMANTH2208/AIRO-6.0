import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const teamData = await prisma.team.findUnique({
      where: { registration_id: id },
      include: {
        event: true,
        registration: true,
        participants: {
          orderBy: { is_team_lead: "desc" },
        },
      },
    });

    if (!teamData) return NextResponse.json({ error: "Registration not found" }, { status: 404 });

    // Format to match old SQLite flat fields
    const team = {
      id: teamData.id,
      registration_id: teamData.registration_id,
      event_id: teamData.event_id,
      team_name: teamData.team_name,
      college_name: teamData.college_name,
      department: teamData.department,
      created_at: teamData.created_at,
      updated_at: teamData.updated_at,
      event_name: teamData.event.name,
      event_slug: teamData.event.slug,
      event_duration: teamData.event.duration,
      qr_code: teamData.registration?.qr_code,
      registration_status: teamData.registration?.registration_status,
      checked_in: teamData.registration?.checked_in,
      checked_in_at: teamData.registration?.checked_in_at,
      registered_at: teamData.registration?.created_at,
    };

    return NextResponse.json({ team, participants: teamData.participants });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch registration" }, { status: 500 });
  }
}
