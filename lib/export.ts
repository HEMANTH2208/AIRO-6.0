import ExcelJS from "exceljs";
import { getDb } from "./db";

interface ExportRow {
  registration_id: string;
  event: string;
  team_name: string;
  college_name: string;
  department: string;
  member_name: string;
  member_student_id: string;
  member_email: string;
  member_phone: string;
  is_team_lead: number;
  registration_date: string;
  registration_status: string;
  checked_in: number;
  checked_in_at: string | null;
}

export async function exportToExcel(eventId?: number): Promise<Buffer> {
  const db = getDb();

  let query = `
    SELECT
      t.registration_id,
      e.name AS event,
      t.team_name,
      t.college_name,
      t.department,
      p.name AS member_name,
      p.student_id AS member_student_id,
      p.email AS member_email,
      p.phone AS member_phone,
      p.is_team_lead,
      r.created_at AS registration_date,
      r.registration_status,
      r.checked_in,
      r.checked_in_at
    FROM teams t
    JOIN events e ON t.event_id = e.id
    JOIN participants p ON p.team_id = t.id
    JOIN registrations r ON r.team_id = t.id
  `;

  const params: number[] = [];
  if (eventId) {
    query += " WHERE t.event_id = ?";
    params.push(eventId);
  }

  query += " ORDER BY t.registration_id, p.is_team_lead DESC, p.id";

  const rows = db.prepare(query).all(...params) as ExportRow[];

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "AIRO 6.0 - Sairam Engineering College";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Registrations", {
    pageSetup: { paperSize: 9, orientation: "landscape" },
  });

  // Header style
  const headerFill: ExcelJS.Fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1a1a2e" },
  };
  const headerFont: Partial<ExcelJS.Font> = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };

  sheet.columns = [
    { header: "Registration Details (ID - Event - Team - College)", key: "registration_details", width: 50 },
    { header: "Department", key: "department", width: 20 },
    { header: "Role", key: "role", width: 12 },
    { header: "Name", key: "member_name", width: 22 },
    { header: "Student ID", key: "member_student_id", width: 18 },
    { header: "Email", key: "member_email", width: 30 },
    { header: "Phone", key: "member_phone", width: 15 },
    { header: "Registration Date", key: "registration_date", width: 22 },
    { header: "Status", key: "registration_status", width: 15 },
    { header: "Checked In", key: "checked_in", width: 13 },
    { header: "Check-in Time", key: "checked_in_at", width: 22 },
  ];

  // Style header row
  const headerRow = sheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
  });
  headerRow.height = 22;

  // Add data rows
  rows.forEach((row, idx) => {
    const dataRow = sheet.addRow({
      registration_details: `${row.registration_id} - ${row.event} - ${row.team_name} - ${row.college_name}`,
      department: row.department,
      role: row.is_team_lead ? "Team Lead" : "Member",
      member_name: row.member_name,
      member_student_id: row.member_student_id,
      member_email: row.member_email,
      member_phone: row.member_phone,
      registration_date: row.registration_date
        ? new Date(row.registration_date).toLocaleString("en-IN")
        : "",
      registration_status: row.registration_status,
      checked_in: row.checked_in ? "Yes" : "No",
      checked_in_at: row.checked_in_at
        ? new Date(row.checked_in_at).toLocaleString("en-IN")
        : "",
    });

    const bg = idx % 2 === 0 ? "FFF5F5FF" : "FFFFFFFF";
    dataRow.eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
      cell.alignment = { vertical: "middle" };
    });
  });

  sheet.autoFilter = { from: "A1", to: "K1" };

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
