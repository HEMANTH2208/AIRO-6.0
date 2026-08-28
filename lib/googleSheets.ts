import { google } from "googleapis";
import { prisma } from "./prisma";

/**
 * Google Sheets Integration for AIRO 6.0 Registration Data
 * 
 * Setup Instructions:
 * 1. Go to Google Cloud Console (console.cloud.google.com)
 * 2. Create a new project or select existing
 * 3. Enable Google Sheets API
 * 4. Create Service Account credentials
 * 5. Download JSON key file
 * 6. Share your Google Sheet with the service account email
 * 7. Add credentials to .env.local:
 *    GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
 *    GOOGLE_SHEETS_CLIENT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
 *    GOOGLE_SHEETS_SPREADSHEET_ID="your-spreadsheet-id-from-url"
 */

interface RegistrationRow {
  registrationId: string;
  eventName: string;
  teamName: string;
  collegeName: string;
  department: string;
  role: string;
  memberName: string;
  studentId: string;
  email: string;
  phone: string;
  registrationDate: string;
  status: string;
  checkedIn: string;
  checkedInAt: string;
}

/**
 * Initialize Google Sheets API client
 */
function getGoogleSheetsClient() {
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;

  if (!privateKey || !clientEmail) {
    throw new Error(
      "Missing Google Sheets credentials. Please add GOOGLE_SHEETS_PRIVATE_KEY and GOOGLE_SHEETS_CLIENT_EMAIL to .env.local"
    );
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

/**
 * Fetch all registration data from database
 */
async function fetchRegistrationData(eventId?: number): Promise<RegistrationRow[]> {
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

  return participants.map((p) => {
    const reg = p.team.registration;
    return {
      registrationId: p.team.registration_id,
      eventName: p.team.event.name,
      teamName: p.team.team_name,
      collegeName: p.team.college_name,
      department: p.team.department,
      role: p.is_team_lead === 1 ? "Team Lead" : "Member",
      memberName: p.name,
      studentId: p.student_id,
      email: p.email,
      phone: p.phone,
      registrationDate: reg?.created_at
        ? new Date(reg.created_at).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          })
        : "",
      status: reg?.registration_status || "confirmed",
      checkedIn: reg?.checked_in ? "Yes" : "No",
      checkedInAt: reg?.checked_in_at
        ? new Date(reg.checked_in_at).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          })
        : "",
    };
  });
}

/**
 * Sync registration data to Google Sheets
 * Creates or updates the sheet with latest data
 */
export async function syncToGoogleSheets(eventId?: number): Promise<string> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!spreadsheetId) {
    throw new Error(
      "Missing GOOGLE_SHEETS_SPREADSHEET_ID in .env.local. Please create a Google Sheet and add its ID."
    );
  }

  const sheets = getGoogleSheetsClient();
  const data = await fetchRegistrationData(eventId);

  // Sheet name based on event filter
  const sheetName = eventId ? `Event_${eventId}_Registrations` : "All_Registrations";

  try {
    // Check if sheet exists, create if not
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const existingSheet = spreadsheet.data.sheets?.find(
      (s) => s.properties?.title === sheetName
    );

    if (!existingSheet) {
      // Create new sheet
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: { title: sheetName },
              },
            },
          ],
        },
      });
    }

    // Prepare header row
    const headers = [
      "Registration ID",
      "Event Name",
      "Team Name",
      "College Name",
      "Department",
      "Role",
      "Member Name",
      "Student ID",
      "Email",
      "Phone",
      "Registration Date",
      "Status",
      "Checked In",
      "Check-in Time",
    ];

    // Prepare data rows
    const rows = data.map((row) => [
      row.registrationId,
      row.eventName,
      row.teamName,
      row.collegeName,
      row.department,
      row.role,
      row.memberName,
      row.studentId,
      row.email,
      row.phone,
      row.registrationDate,
      row.status,
      row.checkedIn,
      row.checkedInAt,
    ]);

    // Clear existing data and write new data
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: "RAW",
      requestBody: {
        values: [headers, ...rows],
      },
    });

    // Format header row (bold, background color)
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: existingSheet?.properties?.sheetId || 0,
                startRowIndex: 0,
                endRowIndex: 1,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.1, green: 0.1, blue: 0.18 },
                  textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
                  horizontalAlignment: "CENTER",
                },
              },
              fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
            },
          },
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId: existingSheet?.properties?.sheetId || 0,
                dimension: "COLUMNS",
                startIndex: 0,
                endIndex: 14,
              },
            },
          },
        ],
      },
    });

    // Return the Google Sheets URL
    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=${existingSheet?.properties?.sheetId || 0}`;
  } catch (error) {
    console.error("Google Sheets sync error:", error);
    throw new Error(
      `Failed to sync to Google Sheets: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Check if Google Sheets is configured
 */
export function isGoogleSheetsConfigured(): boolean {
  return !!(
    process.env.GOOGLE_SHEETS_PRIVATE_KEY &&
    process.env.GOOGLE_SHEETS_CLIENT_EMAIL &&
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID
  );
}
