import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

    const data: any = {};
    if (registration_status !== undefined) {
      data.registration_status = registration_status;
    }
    if (checked_in !== undefined) {
      data.checked_in = checked_in ? 1 : 0;
      data.checked_in_at = checked_in ? new Date() : null;
    }

    await prisma.registration.update({
      where: { id: Number(id) },
      data,
    });

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

    const reg = await prisma.registration.findUnique({
      where: { id: Number(id) },
    });
    
    if (reg) {
      await prisma.team.delete({
        where: { id: reg.team_id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
