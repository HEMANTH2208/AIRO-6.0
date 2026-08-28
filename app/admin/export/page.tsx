"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import Link from "next/link";

interface Event {
  id: number;
  name: string;
}

export default function AdminExportPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<string>("");

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => setEvents(d.events || []));
    
    // Check Google Sheets configuration
    fetch("/api/admin/sync-sheets")
      .then((r) => r.json())
      .then((d) => setConfigured(d.configured));
  }, []);

  const handleSync = async (eventId?: string) => {
    setLoading(true);
    setSyncStatus("");
    setSheetUrl(null);
    try {
      const res = await fetch("/api/admin/sync-sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: eventId }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Sync failed");
      }
      
      setSheetUrl(data.sheetUrl);
      setSyncStatus("✅ Synced successfully! Click the link below to view.");
    } catch (error) {
      setSyncStatus(`❌ ${error instanceof Error ? error.message : "Sync failed. Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-header">
          <div>
            <div className="admin-page-title">Google Sheets Integration</div>
            <div className="admin-page-subtitle">Sync registration data to Google Sheets in real-time</div>
          </div>
        </div>

        {!configured && (
          <div className="card" style={{ marginBottom: "1.5rem", background: "var(--warning-bg)", borderLeft: "3px solid var(--warning)" }}>
            <h4 style={{ fontSize: "1rem", marginBottom: "0.5rem", color: "var(--warning)" }}>⚙️ Configuration Required</h4>
            <p style={{ fontSize: "0.85rem", marginBottom: "0.75rem" }}>
              Google Sheets integration is not configured. Please follow these steps:
            </p>
            <ol style={{ fontSize: "0.82rem", paddingLeft: "1.25rem", lineHeight: 1.8 }}>
              <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>Google Cloud Console</a></li>
              <li>Enable Google Sheets API for your project</li>
              <li>Create Service Account credentials and download JSON key</li>
              <li>Create a Google Sheet and share it with the service account email</li>
              <li>Add credentials to <code style={{ background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: "3px" }}>.env.local</code>:
                <pre style={{ background: "rgba(0,0,0,0.5)", padding: "0.75rem", borderRadius: "4px", marginTop: "0.5rem", fontSize: "0.75rem", overflow: "auto" }}>
{`GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
GOOGLE_SHEETS_CLIENT_EMAIL="service-account@project.iam.gserviceaccount.com"
GOOGLE_SHEETS_SPREADSHEET_ID="your-spreadsheet-id-from-url"`}
                </pre>
              </li>
            </ol>
          </div>
        )}

        {syncStatus && (
          <div className={`card ${syncStatus.includes("✅") ? "alert-success" : "alert-error"}`} style={{ marginBottom: "1.5rem" }}>
            {syncStatus}
          </div>
        )}

        {sheetUrl && (
          <div className="card" style={{ marginBottom: "1.5rem", background: "var(--success-bg)", borderLeft: "3px solid var(--success)" }}>
            <h4 style={{ fontSize: "1rem", marginBottom: "0.5rem", color: "var(--success)" }}>📊 Google Sheet Ready</h4>
            <p style={{ fontSize: "0.85rem", marginBottom: "0.75rem" }}>
              Your data has been synced. Click below to open the Google Sheet:
            </p>
            <a
              href={sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
            >
              🔗 Open Google Sheet
            </a>
          </div>
        )}

        <div style={{ maxWidth: "600px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Sync All */}
          <div className="card">
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>☁️</div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Sync All Registrations</h3>
            <p style={{ marginBottom: "1.25rem" }}>
              Upload all registration data to Google Sheets. The sheet will include registration ID, event, team,
              college, department, all participant details, and check-in status.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => handleSync()}
              disabled={loading || !configured}
            >
              {loading ? <><span className="loading-spinner" /> Syncing...</> : "☁️ Sync All to Google Sheets"}
            </button>
          </div>

          {/* Sync by Event */}
          <div className="card">
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🎯</div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Sync by Event</h3>
            <p style={{ marginBottom: "1.25rem" }}>
              Upload registration data for a specific event to Google Sheets.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <select
                className="form-control"
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                style={{ flex: 1, minWidth: "200px" }}
              >
                <option value="">Select an event...</option>
                {events.map((e) => (
                  <option key={e.id} value={String(e.id)}>{e.name}</option>
                ))}
              </select>
              <button
                className="btn btn-success"
                onClick={() => handleSync(selectedEvent)}
                disabled={!selectedEvent || loading || !configured}
              >
                {loading ? <span className="loading-spinner" /> : "☁️ Sync"}
              </button>
            </div>
          </div>

          {/* Format info */}
          <div className="card">
            <div className="card-header"><div className="card-title">Sheet Format</div></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              {[
                "Registration ID", "Event Name", "Team Name", "College Name",
                "Department", "Role (Lead/Member)", "Member Name", "Student ID",
                "Email", "Phone", "Registration Date", "Status", "Checked In", "Check-in Time",
              ].map((col) => (
                <div key={col} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  <span style={{ color: "var(--primary-light)", fontSize: "0.7rem" }}>●</span>
                  {col}
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="card">
            <div className="card-header"><div className="card-title">✨ Benefits</div></div>
            <ul style={{ fontSize: "0.85rem", lineHeight: 1.8, paddingLeft: "1.25rem" }}>
              <li>Real-time collaboration with team members</li>
              <li>Automatic cloud backup and version history</li>
              <li>Easy filtering, sorting, and analysis with Google Sheets tools</li>
              <li>Share with specific people or make public (read-only)</li>
              <li>Export to Excel, PDF, or CSV anytime</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
