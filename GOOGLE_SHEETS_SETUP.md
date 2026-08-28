# Google Sheets Integration Setup Guide

This guide will help you configure Google Sheets integration for AIRO 6.0 registration data export.

## Overview

The Google Sheets integration allows you to:
- Sync registration data in real-time to Google Sheets
- Collaborate with team members on live data
- Automatically back up registration information
- Use Google Sheets tools for filtering, sorting, and analysis
- Share data with specific people or make public (read-only)
- Export to Excel, PDF, or CSV anytime

## Prerequisites

- Google Cloud Platform account (free tier works)
- Google Sheet created for storing data
- Admin access to AIRO 6.0 application

## Setup Steps

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Note down your project name

### 2. Enable Google Sheets API

1. In the Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google Sheets API"
3. Click on it and press **Enable**

### 3. Create Service Account

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **Service Account**
3. Enter a name (e.g., "airo-6-sheets-sync")
4. Click **Create and Continue**
5. Skip optional steps and click **Done**

### 4. Generate JSON Key

1. In **Credentials**, find your service account
2. Click on the service account email
3. Go to the **Keys** tab
4. Click **Add Key** > **Create New Key**
5. Choose **JSON** format
6. Click **Create** - the key file will download automatically
7. **Keep this file secure!** It contains sensitive credentials

### 5. Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it (e.g., "AIRO 6.0 Registrations")
4. Copy the **Spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

### 6. Share Sheet with Service Account

1. Open your Google Sheet
2. Click the **Share** button
3. Paste the service account email (from step 3)
   - Format: `your-service-account@project-name.iam.gserviceaccount.com`
4. Give it **Editor** access
5. **Uncheck** "Notify people" (it's a service account, not a person)
6. Click **Share**

### 7. Configure Environment Variables

1. Open the JSON key file you downloaded in step 4
2. Find these values:
   - `private_key` - the entire key including BEGIN/END markers
   - `client_email` - the service account email

3. Add to your `.env.local` file in the project root:

```env
# Google Sheets Integration
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL="airo-6-sheets-sync@your-project.iam.gserviceaccount.com"
GOOGLE_SHEETS_SPREADSHEET_ID="1a2b3c4d5e6f7g8h9i0j"
```

**Important Notes:**
- The private key must be wrapped in double quotes
- Keep `\n` characters in the private key (they represent line breaks)
- Make sure there are no extra spaces or line breaks
- Never commit `.env.local` to version control

### 8. Restart Application

After adding environment variables:

```bash
# Stop the development server (Ctrl+C)
# Start it again
npm run dev
```

### 9. Test the Integration

1. Go to admin panel: `/admin/export`
2. You should see the Google Sheets sync interface
3. Click "Sync All to Google Sheets"
4. If configured correctly, you'll get a success message with a link
5. Click the link to view your synced data

## Data Format

The synced Google Sheet includes these columns:

- Registration ID
- Event Name
- Team Name
- College Name
- Department
- Role (Lead/Member)
- Member Name
- Student ID
- Email
- Phone
- Registration Date
- Status
- Checked In
- Check-in Time

## Troubleshooting

### "Google Sheets not configured" error

**Cause:** Environment variables are missing or incorrect

**Solution:**
1. Verify all three env variables are in `.env.local`
2. Check for typos in variable names
3. Ensure private key includes BEGIN/END markers
4. Restart the application

### "Permission denied" error

**Cause:** Service account doesn't have access to the sheet

**Solution:**
1. Open your Google Sheet
2. Share it with the service account email
3. Give **Editor** access

### "Invalid credentials" error

**Cause:** Private key is malformed

**Solution:**
1. Re-download the JSON key file
2. Copy the `private_key` value exactly as it appears
3. Ensure `\n` characters are preserved
4. Wrap the entire key in double quotes

### "Spreadsheet not found" error

**Cause:** Wrong spreadsheet ID or sheet doesn't exist

**Solution:**
1. Copy the ID from your Google Sheet URL
2. Verify the ID in `.env.local` matches exactly
3. Make sure the sheet hasn't been deleted

## Security Best Practices

1. **Never commit credentials** to version control
2. Add `.env.local` to `.gitignore` (already done)
3. Keep the JSON key file secure
4. Rotate service account keys periodically
5. Use different service accounts for dev/prod environments
6. Grant minimum required permissions (Editor for sheets only)

## Features

### Sync All Registrations
- Syncs all registration data across all events
- Creates/updates a sheet named "All_Registrations"
- Overwrites existing data with latest from database

### Sync by Event
- Syncs data for a specific event only
- Creates/updates a sheet named "Event_[ID]_Registrations"
- Useful for event-specific reports

### Automatic Formatting
- Header row with dark background and white text
- Auto-resized columns for readability
- Alternating row colors (optional - can be customized)

## API Endpoints

### Check Configuration
```
GET /api/admin/sync-sheets
```
Returns whether Google Sheets is configured.

### Sync Data
```
POST /api/admin/sync-sheets
Content-Type: application/json

{
  "event_id": 1  // Optional, omit to sync all events
}
```
Returns sheet URL on success.

## Additional Resources

- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Service Account Authentication](https://cloud.google.com/iam/docs/service-accounts)
- [Google Cloud Console](https://console.cloud.google.com)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all setup steps are completed
3. Check application logs for detailed error messages
4. Ensure your Google Cloud project has the Sheets API enabled

---

**Note:** This integration is designed for the AIRO 6.0 event registration system at Sairam Engineering College.
