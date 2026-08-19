import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { generateQRCode, generateRegistrationId } from "@/lib/qr";

interface Event {
  id: number;
  name: string;
  slug: string;
  min_team_size: number;
  max_team_size: number;
  status: string;
}

interface ParticipantInput {
  name: string;
  student_id: string;
  email: string;
  phone: string;
  is_team_lead?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event_id, team_name, college_name, department, members } = body;

    // Basic required field check
    if (!event_id || !team_name || !college_name || !department || !members) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = getDb();

    // Validate event exists and is active
    const event = db.prepare("SELECT * FROM events WHERE id = ?").get(event_id) as Event | undefined;
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

    // Check for duplicate student IDs, emails, phones within this submission
    const studentIds = members.map((m: ParticipantInput) => m.student_id);
    const emails = members.map((m: ParticipantInput) => m.email);
    const phones = members.map((m: ParticipantInput) => m.phone);

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
      const existing = db
        .prepare("SELECT p.id FROM participants p JOIN teams t ON p.team_id = t.id WHERE p.student_id = ? AND t.event_id = ?")
        .get(sid, event_id);
      if (existing) {
        return NextResponse.json(
          { error: `Student ID ${sid} is already registered for this event` },
          { status: 409 }
        );
      }
    }

    // Check for duplicate emails in DB
    for (const email of emails) {
      const existing = db
        .prepare("SELECT p.id FROM participants p JOIN teams t ON p.team_id = t.id WHERE p.email = ? AND t.event_id = ?")
        .get(email, event_id);
      if (existing) {
        return NextResponse.json(
          { error: `Email ${email} is already registered for this event` },
          { status: 409 }
        );
      }
    }

    // Generate registration ID
    const registrationId = generateRegistrationId(event.slug);

    // Run everything in a transaction
    const registerTeam = db.transaction(() => {
      // Insert team
      const teamResult = db
        .prepare(
          `INSERT INTO teams (registration_id, event_id, team_name, college_name, department)
           VALUES (?, ?, ?, ?, ?)`
        )
        .run(registrationId, event_id, team_name, college_name, department);

      const teamId = teamResult.lastInsertRowid;

      // Insert participants
      const insertParticipant = db.prepare(
        `INSERT INTO participants (team_id, name, student_id, email, phone, is_team_lead)
         VALUES (?, ?, ?, ?, ?, ?)`
      );

      for (const member of members as ParticipantInput[]) {
        insertParticipant.run(
          teamId,
          member.name,
          member.student_id,
          member.email,
          member.phone,
          member.is_team_lead ? 1 : 0
        );
      }

      // Create registration record (QR generated after transaction)
      db.prepare(
        `INSERT INTO registrations (team_id, registration_status)
         VALUES (?, 'confirmed')`
      ).run(teamId);

      return { teamId };
    });

    const { teamId } = registerTeam();

    // Generate QR code
    const qrCode = await generateQRCode(registrationId);

    // Update QR in DB
    db.prepare("UPDATE registrations SET qr_code = ? WHERE team_id = ?").run(qrCode, teamId);

    // Return full registration data
    const team = db.prepare("SELECT * FROM teams WHERE id = ?").get(teamId);
    const participants = db.prepare("SELECT * FROM participants WHERE team_id = ?").all(teamId);
    const registration = db.prepare("SELECT * FROM registrations WHERE team_id = ?").get(teamId);

    return NextResponse.json(
      { success: true, registration_id: registrationId, team, participants, registration, qr_code: qrCode },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/register error:", error);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
