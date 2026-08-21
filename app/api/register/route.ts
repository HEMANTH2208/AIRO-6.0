import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQRCode, generateRegistrationId } from "@/lib/qr";
import { decrypt } from "@/lib/token";

interface ParticipantInput {
  name: string;
  student_id: string;
  email: string;
  phone: string;
  is_team_lead?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("participant_session")?.value;
    let sessionEmail = "";
    if (sessionCookie) {
      const decryptedStr = decrypt(sessionCookie);
      if (decryptedStr) {
        try {
          const decrypted = JSON.parse(decryptedStr);
          sessionEmail = decrypted.email ? decrypted.email.trim().toLowerCase() : "";
        } catch {}
      }
    }

    const body = await req.json();
    const { event_id, team_name, college_name, department, members } = body;

    // If user is logged in, ensure the team lead email matches sessionEmail if provided
    if (sessionEmail && Array.isArray(members)) {
      const leadIdx = members.findIndex((m: ParticipantInput) => m.is_team_lead);
      if (leadIdx !== -1 && !members.some((m: ParticipantInput) => m.email.trim().toLowerCase() === sessionEmail)) {
        members[leadIdx].email = sessionEmail;
      }
    }

    // Basic required field check
    if (!event_id || !team_name || !college_name || !department || !members) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate event exists and is active
    const event = await prisma.event.findUnique({
      where: { id: Number(event_id) },
    });
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
    if (event.status !== "active") {
      return NextResponse.json({ error: "Registration for this event is closed" }, { status: 400 });
    }

    // Validate team size
    const memberCount = members.length;
    if (memberCount < event.min_team_size || memberCount > event.max_team_size) {
      return NextResponse.json(
        {
          error: `Team size for "${event.name}" must be between ${event.min_team_size} and ${event.max_team_size} members`,
        },
        { status: 400 }
      );
    }

    // Validate exactly one team lead
    const leads = members.filter((m: ParticipantInput) => m.is_team_lead);
    if (leads.length !== 1) {
      return NextResponse.json({ error: "Exactly one team lead is required" }, { status: 400 });
    }

    // Check if logged-in session user is already registered for this event
    if (sessionEmail) {
      const existingSessionReg = await prisma.participant.findFirst({
        where: {
          email: { equals: sessionEmail, mode: "insensitive" },
          team: { event_id: Number(event_id) },
        },
      });
      if (existingSessionReg) {
        return NextResponse.json(
          { error: `You have already registered for "${event.name}". Each email can register for an event only once.` },
          { status: 409 }
        );
      }
    }

    // Check for duplicate student IDs, emails, phones within this submission
    const studentIds = members.map((m: ParticipantInput) => m.student_id.trim());
    const emails = members.map((m: ParticipantInput) => m.email.trim().toLowerCase());
    const phones = members.map((m: ParticipantInput) => m.phone.trim());

    if (new Set(studentIds).size !== studentIds.length) {
      return NextResponse.json({ error: "Duplicate student IDs in team" }, { status: 400 });
    }
    if (new Set(emails).size !== emails.length) {
      return NextResponse.json({ error: "Duplicate email addresses in team" }, { status: 400 });
    }
    if (new Set(phones).size !== phones.length) {
      return NextResponse.json({ error: "Duplicate phone numbers in team" }, { status: 400 });
    }

    // Check for duplicate student IDs already in DB
    for (const sid of studentIds) {
      const existing = await prisma.participant.findFirst({
        where: {
          student_id: sid,
          team: { event_id: Number(event_id) },
        },
      });
      if (existing) {
        return NextResponse.json(
          { error: `Student ID ${sid} is already registered for this event` },
          { status: 409 }
        );
      }
    }

    // Check for duplicate emails in DB (case insensitive)
    for (const email of emails) {
      const existing = await prisma.participant.findFirst({
        where: {
          email: { equals: email, mode: "insensitive" },
          team: { event_id: Number(event_id) },
        },
      });
      if (existing) {
        return NextResponse.json(
          { error: `Email ${email} is already registered for "${event.name}"` },
          { status: 409 }
        );
      }
    }

    // Check other college participant limit
    const isSairam = college_name.toLowerCase().includes("sairam");
    const otherColCount = await prisma.participant.count({
      where: {
        team: {
          event_id: Number(event_id),
          NOT: {
            college_name: {
              contains: "Sairam",
              mode: "insensitive",
            },
          },
        },
      },
    });

    if (!isSairam && (otherColCount + memberCount) > event.max_other_college_participants) {
      return NextResponse.json(
        {
          error: `Registration closed. The limit of ${event.max_other_college_participants} participants from other colleges for this event has been reached.`,
        },
        { status: 400 }
      );
    }

    // Generate registration ID
    const registrationId = generateRegistrationId(event.slug);

    // Run transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Insert team
      const team = await tx.team.create({
        data: {
          registration_id: registrationId,
          event_id: event.id,
          team_name,
          college_name,
          department,
        },
      });

      // 2. Insert participants
      await tx.participant.createMany({
        data: members.map((member: ParticipantInput) => ({
          team_id: team.id,
          name: member.name.trim(),
          student_id: member.student_id.trim(),
          email: member.email.trim().toLowerCase(),
          phone: member.phone.trim(),
          is_team_lead: member.is_team_lead ? 1 : 0,
        })),
      });

      // 3. Create registration record
      const registration = await tx.registration.create({
        data: {
          team_id: team.id,
          registration_status: "confirmed",
        },
      });

      return { team, registration };
    });

    // Generate QR code
    const qrCode = await generateQRCode(registrationId);

    // Update QR in DB
    const updatedRegistration = await prisma.registration.update({
      where: { team_id: result.team.id },
      data: { qr_code: qrCode },
    });

    const participants = await prisma.participant.findMany({
      where: { team_id: result.team.id },
    });

    return NextResponse.json(
      {
        success: true,
        registration_id: registrationId,
        team: result.team,
        participants,
        registration: updatedRegistration,
        qr_code: qrCode,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/register error:", error);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
