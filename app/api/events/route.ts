import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const eventsData = await prisma.event.findMany({
      include: {
        teams: {
          include: {
            participants: true,
          },
        },
      },
      orderBy: { id: "asc" },
    });

    const events = eventsData.map((e) => {
      let otherCollegeCount = 0;
      e.teams.forEach((t) => {
        const isSairam = t.college_name.toLowerCase().includes("sairam");
        if (!isSairam) {
          otherCollegeCount += t.participants.length;
        }
      });

      return {
        id: e.id,
        name: e.name,
        slug: e.slug,
        description: e.description,
        duration: e.duration,
        min_team_size: e.min_team_size,
        max_team_size: e.max_team_size,
        status: e.status,
        max_other_college_participants: e.max_other_college_participants,
        coordinator_name: e.coordinator_name,
        coordinator_photo: e.coordinator_photo,
        coordinator_contact: e.coordinator_contact,
        other_college_count: otherCollegeCount,
      };
    });

    const totalTeams = await prisma.team.count();

    return NextResponse.json({ events, totalTeams });
  } catch (error: any) {
    console.error("GET /api/events error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const {
      name,
      slug,
      description,
      duration,
      min_team_size,
      max_team_size,
      status,
      max_other_college_participants,
      coordinator_name,
      coordinator_photo,
      coordinator_contact,
    } = body;

    if (!name || !slug || !min_team_size || !max_team_size) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        name,
        slug,
        description,
        duration,
        min_team_size: Number(min_team_size),
        max_team_size: Number(max_team_size),
        status: status || "active",
        max_other_college_participants: Number(max_other_college_participants || 60),
        coordinator_name,
        coordinator_photo,
        coordinator_contact,
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("POST /api/events error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
