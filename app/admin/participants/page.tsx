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
  team_name?: string;
  event_name?: string;
  registration_id?: string;
}

export default function AdminParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editP, setEditP] = useState<Participant | null>(null);
  const [editForm, setEditForm] = useState({ name: "", student_id: "", email: "", phone: "" });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/teams")
      .then((r) => r.json())
      .then((d) => {
        const allP: Participant[] = [];
        for (const team of d.teams || []) {
          for (const p of team.participants || []) {
            allP.push({ ...p, team_name: team.team_name, event_name: team.event_name, registration_id: team.registration_id });
          }
        }
        setParticipants(allP);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = search
    ? participants.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.student_id.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase())
      )
    : participants;

  const openEdit = (p: Participant) => {
    setEditP(p);
    setEditForm({ name: p.name, student_id: p.student_id, email: p.email, phone: p.phone });
  };

  const handleSave = async () => {
    if (!editP) return;
    setSaving(true);
    await fetch(`/api/admin/participants/${editP.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setSaving(false);
    setEditP(null);
    load();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/admin/participants/${id}`, { method: "DELETE" });
    setDeleteConfirm(null);
    load();
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-header">
          <div>
            <div className="admin-page-title">Participants</div>
            <div className="admin-page-subtitle">{filtered.length} participants</div>
          </div>
        </div>

        <div className="filter-bar" style={{ marginBottom: "1.5rem" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Search</label>
            <input className="form-control" placeholder="Name, Student ID, or Email..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          {search && <button className="btn btn-secondary btn-sm" onClick={() => setSearch("")}>Clear</button>}
        </div>

        {loading ? (
          <div className="page-loading" style={{ minHeight: "40vh" }}><div className="page-loading-spinner" /></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Name</th>
                  <th>Student ID</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Team</th>
                  <th>Event</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: "center", color: "var(--text-muted)" }}>No participants found.</td></tr>
                ) : filtered.map((p) => (
                  <tr key={p.id}>
                    <td>{p.is_team_lead ? <span className="badge badge-primary">Lead</span> : <span className="badge badge-info">Member</span>}</td>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td><code style={{ fontSize: "0.82rem" }}>{p.student_id}</code></td>
                    <td style={{ fontSize: "0.85rem" }}>{p.email}</td>
                    <td>{p.phone}</td>
                    <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{p.team_name}</td>
                    <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{p.event_name}</td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(p.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editP && (
          <div className="modal-overlay" onClick={() => setEditP(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">Edit Participant</div>
                <button className="modal-close" onClick={() => setEditP(null)}>✕</button>
              </div>
              {[
                { key: "name", label: "Full Name" },
                { key: "student_id", label: "Student ID" },
                { key: "email", label: "Email", type: "email" },
                { key: "phone", label: "Phone", type: "tel" },
              ].map(({ key, label, type }) => (
                <div key={key} className="form-group">
                  <label className="form-label">{label}</label>
                  <input type={type || "text"} className="form-control" value={(editForm as Record<string, string>)[key]} onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))} />
                </div>
              ))}
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditP(null)}>Cancel</button>
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
              <div className="modal-header"><div className="modal-title">Delete Participant</div></div>
              <p style={{ marginBottom: "1.5rem" }}>Remove this participant from their team? This cannot be undone.</p>
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
