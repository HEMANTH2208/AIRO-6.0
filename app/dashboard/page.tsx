"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { downloadQRCard } from "@/lib/clientDownload";

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
  event_slug: string;
  team_name: string;
  college_name: string;
  department: string;
  qr_code: string;
  registration_status: string;
  checked_in: number;
  checked_in_at: string | null;
  registered_at: string;
}

interface RegSummary {
  registration_id: string;
  event_name: string;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const [allRegs, setAllRegs] = useState<RegSummary[]>([]);
  const [selectedId, setSelectedId] = useState(searchParams.get("id") || "");
  const [team, setTeam] = useState<Team | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [expanded, setExpanded] = useState(false);

  // Load user + all registrations on mount
  useEffect(() => {
    fetch("/api/participant/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setUser(d.user);
          setAllRegs(d.registrations || []);
          // Auto-load from URL or first registration
          const urlId = searchParams.get("id") || (d.registrations?.[0]?.registration_id ?? "");
          if (urlId) {
            setSelectedId(urlId);
            loadReg(urlId);
          }
        }
      });
  }, []);

  const loadReg = async (id: string) => {
    if (!id) return;
    setLoading(true);
    setError("");
    setTeam(null);
    setExpanded(false);
    try {
      const res = await fetch(`/api/registration/${encodeURIComponent(id.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration not found");
      setTeam(data.team);
      setParticipants(data.participants);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Not found");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    loadReg(id);
  };

  const handleDownload = () => {
    if (!team?.qr_code) return;
    downloadQRCard(team, participants.length);
  };

  const lead = participants.find((p) => p.is_team_lead);
  const members = participants.filter((p) => !p.is_team_lead);

  return (
    <div className="dashboard-page">
      {/* Page Hero */}
      <div className="dashboard-hero">
        <div className="container">
          <div className="dashboard-hero-inner">
            <div>
              <div className="badge-label">👤 My Profile</div>
              <h1 className="dashboard-title">
                {user ? `Welcome, ${user.name.split(" ")[0]}` : "My Registrations"}
              </h1>
              <p className="dashboard-subtitle">
                {allRegs.length > 0
                  ? `You have ${allRegs.length} registered event${allRegs.length > 1 ? "s" : ""}`
                  : "You haven't registered for any events yet"}
              </p>
            </div>
            <Link href="/register" className="btn btn-primary">
              + Register for Event
            </Link>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: "960px" }}>

          {allRegs.length === 0 && !loading && (
            <div className="empty-state fade-in">
              <div className="empty-icon">🎟️</div>
              <h3>No Registrations Yet</h3>
              <p>Browse events and register your team to get started.</p>
              <Link href="/events" className="btn btn-primary" style={{ marginTop: "1rem" }}>
                Browse Events
              </Link>
            </div>
          )}

          {/* Event Selector Tabs */}
          {allRegs.length > 1 && (
            <div className="reg-tabs fade-in">
              {allRegs.map((reg) => (
                <button
                  key={reg.registration_id}
                  className={`reg-tab${selectedId === reg.registration_id ? " active" : ""}`}
                  onClick={() => handleSelect(reg.registration_id)}
                >
                  {reg.event_name}
                </button>
              ))}
            </div>
          )}

          {error && (
            <div className="alert alert-error fade-in">
              <span>⚠️</span> {error}
            </div>
          )}

          {loading && (
            <div className="page-loading" style={{ minHeight: "200px" }}>
              <div className="page-loading-spinner" />
            </div>
          )}

          {team && !loading && (
            <div className="reg-card-grid fade-in">
              {/* Left: Summary Card */}
              <div className="reg-summary-card">
                {/* Status */}
                <div className={`reg-status-bar ${team.checked_in ? "checked" : "pending"}`}>
                  <span className="reg-status-dot" />
                  <span>{team.checked_in ? "Checked In ✓" : "Registration Confirmed"}</span>
                  <span className={`badge ${team.checked_in ? "badge-success" : "badge-info"}`} style={{ marginLeft: "auto" }}>
                    {team.checked_in ? "Present" : "Pending Entry"}
                  </span>
                </div>

                {/* Core Info */}
                <div className="reg-info-grid">
                  <div className="reg-info-item">
                    <div className="reg-info-label">Registration ID</div>
                    <div className="reg-info-value primary">{team.registration_id}</div>
                  </div>
                  <div className="reg-info-item">
                    <div className="reg-info-label">Event</div>
                    <div className="reg-info-value">{team.event_name}</div>
                  </div>
                  <div className="reg-info-item">
                    <div className="reg-info-label">Team Name</div>
                    <div className="reg-info-value">{team.team_name}</div>
                  </div>
                  <div className="reg-info-item">
                    <div className="reg-info-label">College</div>
                    <div className="reg-info-value">{team.college_name}</div>
                  </div>
                  <div className="reg-info-item">
                    <div className="reg-info-label">Members</div>
                    <div className="reg-info-value">{participants.length}</div>
                  </div>
                  <div className="reg-info-item">
                    <div className="reg-info-label">Registered On</div>
                    <div className="reg-info-value">{new Date(team.registered_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
                  </div>
                </div>

                {/* Expand toggle */}
                <button
                  className="expand-toggle"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? "▲ Hide team details" : "▼ View team details"}
                </button>

                {expanded && (
                  <div className="team-details fade-in">
                    {lead && (
                      <div className="team-member-card lead">
                        <div className="member-badge">Team Lead</div>
                        <div className="member-name">{lead.name}</div>
                        <div className="member-meta">{lead.student_id} · {lead.email}</div>
                      </div>
                    )}
                    {members.map((m, i) => (
                      <div key={m.id} className="team-member-card">
                        <div className="member-badge">Member {i + 1}</div>
                        <div className="member-name">{m.name}</div>
                        <div className="member-meta">{m.student_id} · {m.email}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: QR Pass */}
              <div className="qr-pass" style={{ position: "sticky", top: "80px" }}>
                <div className="qr-pass-header">
                  <div className="qr-pass-logo">AIRO 6.0</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Dept. of AI &amp; DS · Sairam Engineering College</div>
                </div>
                <div className="qr-reg-id">{team.registration_id}</div>
                {team.qr_code && (
                  <div className="qr-code-wrapper">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={team.qr_code} alt="QR Code" style={{ width: "180px", height: "180px" }} />
                  </div>
                )}
                <div className="qr-pass-info">
                  <div className="qr-pass-row"><span className="qr-pass-label">Event</span><span className="qr-pass-value">{team.event_name}</span></div>
                  <div className="qr-pass-row"><span className="qr-pass-label">Team</span><span className="qr-pass-value">{team.team_name}</span></div>
                  <div className="qr-pass-row"><span className="qr-pass-label">Members</span><span className="qr-pass-value">{participants.length}</span></div>
                </div>
                <div className="pass-actions" style={{ display: "flex", marginTop: "1rem" }}>
                  <button className="btn btn-primary btn-sm btn-block" onClick={handleDownload}>↓ Download QR Pass</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="page-loading"><div className="page-loading-spinner" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}
