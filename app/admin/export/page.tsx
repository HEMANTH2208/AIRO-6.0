"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";

interface Event {
  id: number;
  name: string;
}

export default function AdminExportPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => setEvents(d.events || []));
  }, []);

  const handleExport = async (eventId?: string) => {
    setLoading(true);
    try {
      const url = eventId ? `/api/admin/export?event_id=${eventId}` : "/api/admin/export";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const filename = eventId
        ? `AIRO6_Event_${eventId}_Registrations.xlsx`
        : "AIRO6_All_Registrations.xlsx";
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      alert("Export failed. Please try again.");
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
            <div className="admin-page-title">Excel Export</div>
            <div className="admin-page-subtitle">Download registration data as Excel (.xlsx)</div>
          </div>
        </div>

        <div style={{ maxWidth: "600px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Export All */}
          <div className="card">
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>📥</div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Export All Registrations</h3>
            <p style={{ marginBottom: "1.25rem" }}>
              Download all registration data across all events. The file includes registration ID, event, team,
              college, department, all participant details, and check-in status.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => handleExport()}
              disabled={loading}
            >
              {loading ? <><span className="loading-spinner" /> Generating...</> : "📥 Export All Registrations"}
            </button>
          </div>

          {/* Export by Event */}
          <div className="card">
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🎯</div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Export by Event</h3>
            <p style={{ marginBottom: "1.25rem" }}>
              Download registration data for a specific event.
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
                onClick={() => handleExport(selectedEvent)}
                disabled={!selectedEvent || loading}
              >
                {loading ? <span className="loading-spinner" /> : "📥 Export"}
              </button>
            </div>
          </div>

          {/* Format info */}
          <div className="card">
            <div className="card-header"><div className="card-title">Export Format</div></div>
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
        </div>
      </div>
    </div>
  );
}
