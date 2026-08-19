"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import Link from "next/link";

interface Stats {
  totalRegistrations: number;
  totalTeams: number;
  checkedIn: number;
  pendingCheckin: number;
  byEvent: { event: string; count: number }[];
  byCollege: { college_name: string; count: number }[];
  recentRegistrations: {
    registration_id: string;
    team_name: string;
    event_name: string;
    college_name: string;
    registration_status: string;
    checked_in: number;
    created_at: string;
  }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-header">
          <div>
            <div className="admin-page-title">Dashboard</div>
            <div className="admin-page-subtitle">AIRO 6.0 — Registration Overview</div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link href="/admin/qr-verify" className="btn btn-outline btn-sm">📷 QR Verify</Link>
            <Link href="/admin/export" className="btn btn-primary btn-sm">📥 Export</Link>
          </div>
        </div>

        {loading ? (
          <div className="page-loading" style={{ minHeight: "50vh" }}>
            <div className="page-loading-spinner" />
            <p>Loading stats...</p>
          </div>
        ) : stats ? (
          <>
            {/* Stat Cards */}
            <div className="grid-4" style={{ marginBottom: "2rem" }}>
              {[
                { icon: "📋", label: "Total Registrations", value: stats.totalRegistrations, color: "var(--primary)" },
                { icon: "👥", label: "Total Teams", value: stats.totalTeams, color: "var(--secondary)" },
                { icon: "✅", label: "Checked In", value: stats.checkedIn, color: "var(--success)" },
                { icon: "⏳", label: "Pending Check-in", value: stats.pendingCheckin, color: "var(--warning)" },
              ].map((s) => (
                <div key={s.label} className="stat-card" style={{ "--accent-color": s.color } as React.CSSProperties}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: s.color }} />
                  <div className="stat-icon">{s.icon}</div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="grid-2" style={{ marginBottom: "2rem" }}>
              {/* By Event */}
              <div className="card">
                <div className="card-header"><div className="card-title">Registrations by Event</div></div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {stats.byEvent.map((e) => {
                    const pct = stats.totalTeams > 0 ? (e.count / stats.totalTeams) * 100 : 0;
                    return (
                      <div key={e.event}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                          <span style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>{e.event}</span>
                          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary-light)" }}>{e.count}</span>
                        </div>
                        <div style={{ height: "6px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: "var(--gradient-primary)", borderRadius: "3px", transition: "width 0.5s ease" }} />
                        </div>
                      </div>
                    );
                  })}
                  {stats.byEvent.every((e) => e.count === 0) && (
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No registrations yet.</p>
                  )}
                </div>
              </div>

              {/* By College */}
              <div className="card">
                <div className="card-header"><div className="card-title">Top Colleges</div></div>
                {stats.byCollege.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {stats.byCollege.map((c, i) => (
                      <div key={c.college_name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: "1px solid var(--border)" }}>
                        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                          <span style={{ width: "24px", height: "24px", background: "var(--bg-elevated)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "var(--primary-light)" }}>{i + 1}</span>
                          <span style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>{c.college_name}</span>
                        </div>
                        <span className="badge badge-primary">{c.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No registrations yet.</p>
                )}
              </div>
            </div>

            {/* Recent Registrations */}
            <div className="card">
              <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="card-title">Recent Registrations</div>
                <Link href="/admin/registrations" className="btn btn-secondary btn-sm">View All</Link>
              </div>
              {stats.recentRegistrations.length > 0 ? (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Reg. ID</th>
                        <th>Team</th>
                        <th>Event</th>
                        <th>College</th>
                        <th>Status</th>
                        <th>Check-in</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentRegistrations.map((r) => (
                        <tr key={r.registration_id}>
                          <td><code style={{ fontSize: "0.78rem", color: "var(--primary-light)" }}>{r.registration_id}</code></td>
                          <td>{r.team_name}</td>
                          <td>{r.event_name}</td>
                          <td>{r.college_name}</td>
                          <td><span className="badge badge-success">{r.registration_status}</span></td>
                          <td>
                            <span className={`badge ${r.checked_in ? "badge-success" : "badge-warning"}`}>
                              {r.checked_in ? "✓ Checked In" : "Pending"}
                            </span>
                          </td>
                          <td style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                            {new Date(r.created_at).toLocaleDateString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", padding: "1rem 0" }}>
                  No registrations yet. <Link href="/" style={{ color: "var(--primary-light)" }}>Share the registration link</Link>
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="alert alert-error">Failed to load dashboard stats.</div>
        )}
      </div>
    </div>
  );
}
