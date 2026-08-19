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
  registered_at: string;
  checked_in?: number;
  participants: Participant[];
}

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ event: "", college: "", department: "", team_name: "" });
  const [editTeam, setEditTeam] = useState<Team | null>(null);
  const [editForm, setEditForm] = useState({ team_name: "", college_name: "", department: "", checked_in: false });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

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

  const openEdit = (t: Team) => {
    setEditTeam(t);
    setEditForm({
      team_name: t.team_name,
      college_name: t.college_name,
      department: t.department,
      checked_in: !!t.checked_in,
    });
  };

  const handleSave = async () => {
    if (!editTeam) return;
    setSaving(true);
    await fetch(`/api/admin/teams/${editTeam.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setSaving(false);
    setEditTeam(null);
    load();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/admin/teams/${id}`, { method: "DELETE" });
    setDeleteConfirm(null);
    load();
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-header">
          <div>
            <div className="admin-page-title">Teams</div>
            <div className="admin-page-subtitle">{teams.length} teams found</div>
          </div>
        </div>

        <div className="filter-bar">
          {["team_name", "event", "college", "department"].map((k) => (
            <div key={k} className="form-group">
              <label className="form-label">{k.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</label>
              <input className="form-control" placeholder="Filter..." value={(filters as Record<string, string>)[k]} onChange={(e) => setFilters((f) => ({ ...f, [k]: e.target.value }))} />
            </div>
          ))}
          <button className="btn btn-secondary btn-sm" onClick={() => setFilters({ event: "", college: "", department: "", team_name: "" })}>Clear</button>
        </div>

        {loading ? (
          <div className="page-loading" style={{ minHeight: "40vh" }}><div className="page-loading-spinner" /></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Reg. ID</th>
                  <th>Team Name</th>
                  <th>Event</th>
                  <th>College</th>
                  <th>Dept</th>
                  <th>Members</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--text-muted)" }}>No teams found.</td></tr>
                ) : teams.map((team) => (
                  <>
                    <tr key={team.id}>
                      <td><code style={{ fontSize: "0.78rem", color: "var(--primary-light)" }}>{team.registration_id}</code></td>
                      <td style={{ fontWeight: 600 }}>{team.team_name}</td>
                      <td>{team.event_name}</td>
                      <td>{team.college_name}</td>
                      <td style={{ fontSize: "0.85rem" }}>{team.department}</td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => setExpanded(expanded === team.id ? null : team.id)}>
                          {team.participants?.length || 0} ({expanded === team.id ? "Hide" : "Show"})
                        </button>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => openEdit(team)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(team.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                    {expanded === team.id && (
                      <tr key={`${team.id}-expanded`}>
                        <td colSpan={7} style={{ background: "var(--bg-surface)" }}>
                          <table style={{ fontSize: "0.83rem" }}>
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
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Modal */}
        {editTeam && (
          <div className="modal-overlay" onClick={() => setEditTeam(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">Edit Team</div>
                <button className="modal-close" onClick={() => setEditTeam(null)}>✕</button>
              </div>
              <div className="form-group">
                <label className="form-label">Team Name</label>
                <input className="form-control" value={editForm.team_name} onChange={(e) => setEditForm((f) => ({ ...f, team_name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">College Name</label>
                <input className="form-control" value={editForm.college_name} onChange={(e) => setEditForm((f) => ({ ...f, college_name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <input className="form-control" value={editForm.department} onChange={(e) => setEditForm((f) => ({ ...f, department: e.target.value }))} />
              </div>
              <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}>
                <input
                  type="checkbox"
                  id="edit-checked-in"
                  checked={editForm.checked_in}
                  onChange={(e) => setEditForm((f) => ({ ...f, checked_in: e.target.checked }))}
                  style={{ width: "auto", margin: 0, accentColor: "var(--primary)" }}
                />
                <label htmlFor="edit-checked-in" className="form-label" style={{ marginBottom: 0, cursor: "pointer" }}>Checked In</label>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditTeam(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? <span className="loading-spinner" /> : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteConfirm !== null && (
          <div className="modal-overlay">
            <div className="modal" style={{ maxWidth: "380px" }}>
              <div className="modal-header"><div className="modal-title">Delete Team</div></div>
              <p style={{ marginBottom: "1.5rem" }}>Delete this team and all participant data? This cannot be undone.</p>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
