"use client";

import { useEffect, useState, useCallback } from "react";
import AdminSidebar from "@/components/AdminSidebar";

interface Participant {
  id: number;
  name: string;
  student_id: string;
  email: string;
  phone: string;
  is_team_lead: number;
}

interface Team {
  id: number;
  registration_id: string;
  event_name: string;
  team_name: string;
  college_name: string;
  department: string;
  registration_status: string;
  checked_in: number;
  registered_at: string;
  participants: Participant[];
}

export default function AdminRegistrationsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ event: "", college: "", team_name: "", registration_id: "", checked_in: "" });
  const [expanded, setExpanded] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ regId: string; teamId: number } | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    fetch(`/api/admin/teams?${params}`)
      .then((r) => r.json())
      .then((d) => setTeams(d.teams || []))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (regId: string) => {
    // Get registration ID from team
    const team = teams.find((t) => t.registration_id === regId);
    if (!team) return;
    // Delete team (cascades)
    await fetch(`/api/admin/teams/${team.id}`, { method: "DELETE" });
    setDeleteConfirm(null);
    load();
  };

  const handleCheckin = async (regId: string, undo = false) => {
    await fetch("/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registration_id: regId, undo }),
    });
    load();
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-header">
          <div>
            <div className="admin-page-title">Registrations</div>
            <div className="admin-page-subtitle">{teams.length} registrations found</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <div className="form-group">
            <label className="form-label">Registration ID</label>
            <input className="form-control" placeholder="Search..." value={filters.registration_id} onChange={(e) => setFilters((f) => ({ ...f, registration_id: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Event</label>
            <input className="form-control" placeholder="Event name..." value={filters.event} onChange={(e) => setFilters((f) => ({ ...f, event: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">College</label>
            <input className="form-control" placeholder="College..." value={filters.college} onChange={(e) => setFilters((f) => ({ ...f, college: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Team Name</label>
            <input className="form-control" placeholder="Team..." value={filters.team_name} onChange={(e) => setFilters((f) => ({ ...f, team_name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Check-in</label>
            <select className="form-control" value={filters.checked_in} onChange={(e) => setFilters((f) => ({ ...f, checked_in: e.target.value }))}>
              <option value="">All</option>
              <option value="true">Checked In</option>
              <option value="false">Not Checked In</option>
            </select>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setFilters({ event: "", college: "", team_name: "", registration_id: "", checked_in: "" })}>Clear</button>
        </div>

        {loading ? (
          <div className="page-loading" style={{ minHeight: "40vh" }}><div className="page-loading-spinner" /></div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {teams.length === 0 && (
              <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>No registrations found.</div>
            )}
            {teams.map((team) => (
              <div key={team.id} className="card" style={{ padding: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.35rem" }}>
                      <code style={{ fontSize: "0.8rem", color: "var(--primary-light)", background: "rgba(108,99,255,0.1)", padding: "0.15rem 0.5rem", borderRadius: "4px" }}>{team.registration_id}</code>
                      <span className={`badge ${team.checked_in ? "badge-success" : "badge-warning"}`}>
                        {team.checked_in ? "✓ Checked In" : "Pending"}
                      </span>
                      <span className="badge badge-success">{team.registration_status}</span>
                    </div>
                    <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.2rem" }}>{team.team_name}</div>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{team.event_name} · {team.college_name} · {team.department}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                      {team.participants?.length || 0} members · Registered: {new Date(team.registered_at).toLocaleDateString("en-IN")}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setExpanded(expanded === team.id ? null : team.id)}>
                      {expanded === team.id ? "Hide" : "View"} Members
                    </button>
                    {team.checked_in ? (
                      <button className="btn btn-outline btn-sm" style={{ color: "var(--warning)", borderColor: "var(--warning)" }} onClick={() => handleCheckin(team.registration_id, true)}>
                        Undo Check In
                      </button>
                    ) : (
                      <button className="btn btn-success btn-sm" onClick={() => handleCheckin(team.registration_id, false)}>
                        Check In
                      </button>
                    )}
                    <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm({ regId: team.registration_id, teamId: team.id })}>
                      Delete
                    </button>
                  </div>
                </div>

                {expanded === team.id && (
                  <div style={{ marginTop: "1rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                    <table style={{ fontSize: "0.85rem" }}>
                      <thead><tr><th>Role</th><th>Name</th><th>Student ID</th><th>Email</th><th>Phone</th></tr></thead>
                      <tbody>
                        {team.participants?.map((p) => (
                          <tr key={p.id}>
                            <td>{p.is_team_lead ? <span className="badge badge-primary">Lead</span> : "Member"}</td>
                            <td>{p.name}</td>
                            <td>{p.student_id}</td>
                            <td>{p.email}</td>
                            <td>{p.phone}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {deleteConfirm && (
          <div className="modal-overlay">
            <div className="modal" style={{ maxWidth: "380px" }}>
              <div className="modal-header"><div className="modal-title">Confirm Delete</div></div>
              <p style={{ marginBottom: "1.5rem" }}>Delete registration <strong style={{ color: "var(--primary-light)" }}>{deleteConfirm.regId}</strong>? This will remove all team and participant data. This cannot be undone.</p>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm.regId)}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
