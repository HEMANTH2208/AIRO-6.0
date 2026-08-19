"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";

interface Event {
  id: number;
  name: string;
  slug: string;
  description: string;
  duration: string;
  min_team_size: number;
  max_team_size: number;
  status: string;
  created_at: string;
}

const emptyEvent = (): Partial<Event> => ({
  name: "", slug: "", description: "", duration: "", min_team_size: 2, max_team_size: 4, status: "active",
});

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Partial<Event>>(emptyEvent());
  const [isEdit, setIsEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => setEvents(d.events || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(emptyEvent()); setIsEdit(false); setShowModal(true); setError(""); };
  const openEdit = (ev: Event) => { setEditing({ ...ev }); setIsEdit(true); setShowModal(true); setError(""); };

  const handleSave = async () => {
    if (!editing.name || !editing.slug) { setError("Name and slug are required"); return; }
    setSaving(true);
    setError("");
    try {
      const url = isEdit ? `/api/events/${editing.id}` : "/api/events";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      setShowModal(false);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/events/${id}`, { method: "DELETE" });
    setDeleteConfirm(null);
    load();
  };

  const handleToggle = async (ev: Event) => {
    await fetch(`/api/events/${ev.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...ev, status: ev.status === "active" ? "inactive" : "active" }),
    });
    load();
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-header">
          <div>
            <div className="admin-page-title">Events Management</div>
            <div className="admin-page-subtitle">Create, edit, and manage competition events</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>+ New Event</button>
        </div>

        {loading ? (
          <div className="page-loading" style={{ minHeight: "50vh" }}><div className="page-loading-spinner" /></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Duration</th>
                  <th>Team Size</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id}>
                    <td style={{ fontWeight: 600 }}>{ev.name}</td>
                    <td><code style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{ev.slug}</code></td>
                    <td style={{ fontSize: "0.85rem" }}>{ev.duration}</td>
                    <td>{ev.min_team_size === ev.max_team_size ? ev.min_team_size : `${ev.min_team_size}–${ev.max_team_size}`}</td>
                    <td>
                      <span className={`badge ${ev.status === "active" ? "badge-success" : "badge-warning"}`}>
                        {ev.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(ev)}>Edit</button>
                        <button className="btn btn-outline btn-sm" onClick={() => handleToggle(ev)}>
                          {ev.status === "active" ? "Disable" : "Enable"}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(ev.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">{isEdit ? "Edit Event" : "Create Event"}</div>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              {error && <div className="alert alert-error">{error}</div>}
              <div className="form-group">
                <label className="form-label">Name <span className="required">*</span></label>
                <input className="form-control" value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Slug <span className="required">*</span></label>
                <input className="form-control" value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Duration</label>
                <input className="form-control" value={editing.duration || ""} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Min Team Size</label>
                  <input type="number" className="form-control" value={editing.min_team_size || 2} onChange={(e) => setEditing({ ...editing, min_team_size: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Team Size</label>
                  <input type="number" className="form-control" value={editing.max_team_size || 4} onChange={(e) => setEditing({ ...editing, max_team_size: Number(e.target.value) })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={3} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} style={{ resize: "vertical" }} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-control" value={editing.status || "active"} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? <span className="loading-spinner" /> : isEdit ? "Save Changes" : "Create Event"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirm */}
        {deleteConfirm !== null && (
          <div className="modal-overlay">
            <div className="modal" style={{ maxWidth: "380px" }}>
              <div className="modal-header">
                <div className="modal-title">Confirm Delete</div>
              </div>
              <p style={{ marginBottom: "1.5rem" }}>Are you sure you want to delete this event? All associated registrations will also be deleted. This cannot be undone.</p>
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
