import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { qr_data, registration_id: regIdInput } = body;

    let registrationId = regIdInput;

    if (qr_data && !registrationId) {
      try {
        const parsed = JSON.parse(qr_data);
        registrationId = parsed.id;
      } catch {
        registrationId = qr_data.trim();
      }
    }

    if (!registrationId) {
      return NextResponse.json({ error: "Registration ID is required" }, { status: 400 });
    }

    const teamData = await prisma.team.findUnique({
      where: { registration_id: registrationId },
      include: {
        event: true,
        registration: true,
        participants: {
          orderBy: { is_team_lead: "desc" },
        },
      },
    });

    if (!teamData) {
      return NextResponse.json({ error: "Registration not found", valid: false }, { status: 404 });
    }

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
      qr_code: teamData.registration?.qr_code,
      registration_status: teamData.registration?.registration_status,
      checked_in: teamData.registration?.checked_in,
      checked_in_at: teamData.registration?.checked_in_at,
      registered_at: teamData.registration?.created_at,
    };

    return NextResponse.json({
      valid: true,
      team,
      participants: teamData.participants,
    });
  } catch (error) {
    console.error("QR verify error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
