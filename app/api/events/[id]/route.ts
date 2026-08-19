import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parsedId = Number(id);
    
    const event = await prisma.event.findFirst({
      where: isNaN(parsedId)
        ? { slug: id }
        : { OR: [{ id: parsedId }, { slug: id }] },
    });

    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
    return NextResponse.json({ event });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
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
    const body = await req.json();
    const {
      name,
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

    const event = await prisma.event.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        duration,
        min_team_size: Number(min_team_size),
        max_team_size: Number(max_team_size),
        status,
        max_other_college_participants: Number(max_other_college_participants || 60),
        coordinator_name,
        coordinator_photo,
        coordinator_contact,
      },
    });

    return NextResponse.json({ event });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
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
    await prisma.event.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
