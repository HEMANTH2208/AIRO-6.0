import ExcelJS from "exceljs";
import { prisma } from "./prisma";

export async function exportToExcel(eventId?: number): Promise<Buffer> {
  const participants = await prisma.participant.findMany({
    where: eventId ? { team: { event_id: eventId } } : {},
    include: {
      team: {
        include: {
          event: true,
          registration: true,
        },
      },
    },
    orderBy: [
      { team: { registration_id: "asc" } },
      { is_team_lead: "desc" },
      { id: "asc" },
    ],
  });

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
  participants.forEach((p, idx) => {
    const reg = p.team.registration;
    const dataRow = sheet.addRow({
      registration_details: `${p.team.registration_id} - ${p.team.event.name} - ${p.team.team_name} - ${p.team.college_name}`,
      department: p.team.department,
      role: p.is_team_lead === 1 ? "Team Lead" : "Member",
      member_name: p.name,
      member_student_id: p.student_id,
      member_email: p.email,
      member_phone: p.phone,
      registration_date: reg?.created_at
        ? new Date(reg.created_at).toLocaleString("en-IN")
        : "",
      registration_status: reg?.registration_status || "confirmed",
      checked_in: reg?.checked_in ? "Yes" : "No",
      checked_in_at: reg?.checked_in_at
        ? new Date(reg.checked_in_at).toLocaleString("en-IN")
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
