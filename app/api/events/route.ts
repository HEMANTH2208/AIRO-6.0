import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { id: "asc" },
    });
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

    const event = await prisma.event.create({
      data: {
        name,
        slug,
        description,
        duration,
        min_team_size: Number(min_team_size),
        max_team_size: Number(max_team_size),
        status: status || "active",
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("POST /api/events error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
