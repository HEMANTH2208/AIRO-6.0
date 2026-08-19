import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;

    const teamData = await prisma.team.findUnique({
      where: { id: Number(id) },
      include: {
        event: true,
        registration: true,
        participants: {
          orderBy: { is_team_lead: "desc" },
        },
      },
    });

    if (!teamData) return NextResponse.json({ error: "Team not found" }, { status: 404 });

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
      registration_status: teamData.registration?.registration_status,
      checked_in: teamData.registration?.checked_in,
      checked_in_at: teamData.registration?.checked_in_at,
    };

    return NextResponse.json({ team, participants: teamData.participants });
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
    const { team_name, college_name, department, checked_in } = await req.json();

    const team = await prisma.team.update({
      where: { id: Number(id) },
      data: {
        team_name,
        college_name,
        department,
      },
    });

    if (checked_in !== undefined) {
      await prisma.registration.update({
        where: { team_id: team.id },
        data: {
          checked_in: checked_in ? 1 : 0,
          checked_in_at: checked_in ? new Date() : null,
        },
      });
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

    await prisma.team.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
