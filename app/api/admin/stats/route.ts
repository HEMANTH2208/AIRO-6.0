import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const totalRegistrations = await prisma.registration.count();
    const totalTeams = await prisma.team.count();
    const checkedIn = await prisma.registration.count({
      where: { checked_in: 1 },
    });

    // Registrations by event with other college participant counts
    const eventsWithDetails = await prisma.event.findMany({
      include: {
        teams: {
          include: {
            participants: true,
          },
        },
      },
      orderBy: { id: "asc" },
    });

    const byEvent = eventsWithDetails.map((e) => {
      let otherCollegeCount = 0;
      e.teams.forEach((t) => {
        const isSairam = t.college_name.toLowerCase().includes("sairam");
        if (!isSairam) {
          otherCollegeCount += t.participants.length;
        }
      });
      return {
        id: e.id,
        event: e.name,
        count: e.teams.length,
        otherCollegeCount,
        maxOtherCollege: e.max_other_college_participants,
      };
    });

    // Top colleges by registration count
    const colGroup = await prisma.team.groupBy({
      by: ["college_name"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 10,
    });
    const byCollege = colGroup.map((c) => ({
      college_name: c.college_name,
      count: c._count.id,
    }));

    // Recent registrations
    const recent = await prisma.registration.findMany({
      orderBy: { created_at: "desc" },
      take: 10,
      include: {
        team: {
          include: {
            event: true,
          },
        },
      },
    });

    const recentRegistrations = recent.map((r) => ({
      registration_id: r.team.registration_id,
      team_name: r.team.team_name,
      event_name: r.team.event.name,
      college_name: r.team.college_name,
      registration_status: r.registration_status,
      checked_in: r.checked_in,
      created_at: r.created_at,
    }));

    return NextResponse.json({
      totalRegistrations,
      totalTeams,
      checkedIn,
      pendingCheckin: totalTeams - checkedIn,
      byEvent,
      byCollege,
      recentRegistrations,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
