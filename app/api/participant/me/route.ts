import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/token";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("participant_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ user: null, registrations: [] });
    }

    const decryptedStr = decrypt(sessionCookie);
    if (!decryptedStr) {
      return NextResponse.json({ user: null, registrations: [] });
    }

    const decrypted = JSON.parse(decryptedStr);

    // Fetch all registrations where this participant email is registered
    const registrations = await prisma.registration.findMany({
      where: {
        team: {
          participants: {
            some: {
              email: {
                equals: decrypted.email,
                mode: "insensitive",
              },
            },
          },
        },
      },
      include: {
        team: {
          include: {
            event: true,
            participants: {
              orderBy: { is_team_lead: "desc" },
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    const mappedRegistrations = registrations.map((r) => ({
      registration_id: r.team.registration_id,
      event_name: r.team.event.name,
      event_slug: r.team.event.slug,
      team_name: r.team.team_name,
      college_name: r.team.college_name,
      department: r.team.department,
      qr_code: r.qr_code,
      registration_status: r.registration_status,
      checked_in: r.checked_in,
      checked_in_at: r.checked_in_at,
      registered_at: r.created_at,
      participantsCount: r.team.participants.length,
    }));

    return NextResponse.json({
      user: { id: decrypted.id, name: decrypted.name, email: decrypted.email },
      registrations: mappedRegistrations,
    });
  } catch (error) {
    console.error("Error in participant me API:", error);
    return NextResponse.json({ error: "Failed to load session" }, { status: 500 });
  }
}
