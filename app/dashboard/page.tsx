"use client";

import { useState, Suspense } from "react";
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

function DashboardContent() {
  const searchParams = useSearchParams();
  const [regId, setRegId] = useState(searchParams.get("id") || "");
  const [inputId, setInputId] = useState(searchParams.get("id") || "");
  const [team, setTeam] = useState<Team | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(!!searchParams.get("id"));
  const [error, setError] = useState("");

  const lookup = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError("");
    setTeam(null);
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

  // Auto-lookup if ID in URL
  if (searchParams.get("id") && !team && !loading && !error) {
    lookup(searchParams.get("id")!);
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setRegId(inputId);
    lookup(inputId);
  };

  const handleDownload = () => {
    if (!team?.qr_code) return;
    downloadQRCard(team, participants.length);
  };

  const lead = participants.find((p) => p.is_team_lead);
  const membersList = participants.filter((p) => !p.is_team_lead);

  return (
    <div>
      <div style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)", padding: "3rem 0 2rem" }}>
        <div className="container">
          <h1 style={{ marginBottom: "0.5rem" }}>My Registration</h1>
          <p>Enter your Registration ID to view your team details and QR pass.</p>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: "900px" }}>
          {/* Lookup Form */}
          <div className="card" style={{ marginBottom: "2rem" }}>
            <div className="card-header">
              <div className="card-title">Look Up Registration</div>
            </div>
            <form onSubmit={handleSearch} style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <input
                className="form-control"
                style={{ flex: 1, minWidth: "200px" }}
                placeholder="Enter Registration ID (e.g. AIRO-TECH-xxxxx)"
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" disabled={loading || !inputId.trim()}>
                {loading ? <span className="loading-spinner" /> : "Look Up"}
              </button>
            </form>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: "1.5rem" }}>
              <span>⚠️</span> {error}
            </div>
          )}

          {loading && !team && (
            <div className="page-loading" style={{ minHeight: "30vh" }}>
              <div className="page-loading-spinner" />
              <p>Loading registration...</p>
            </div>
          )}

          {team && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem", alignItems: "start" }}>
              {/* Left: Details */}
              <div>
                {/* Status Banner */}
                <div style={{
                  background: team.checked_in ? "var(--success-bg)" : "var(--info-bg)",
                  border: `1px solid ${team.checked_in ? "rgba(0,212,170,0.3)" : "rgba(84,160,255,0.3)"}`,
                  borderRadius: "var(--radius-md)", padding: "1rem 1.25rem",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem",
                }}>
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                      {team.checked_in ? "✓ Checked In" : "Registration Confirmed"}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {team.checked_in && team.checked_in_at
                        ? `Checked in at: ${new Date(team.checked_in_at).toLocaleString()}`
                        : "Present this QR at the venue for entry"}
                    </div>
                  </div>
                  <span className={`badge ${team.checked_in ? "badge-success" : "badge-info"}`}>
                    {team.checked_in ? "Checked In" : "Pending Entry"}
                  </span>
                </div>

                <div className="card" style={{ marginBottom: "1rem" }}>
                  <div className="card-header"><div className="card-title">Registration Info</div></div>
                  <div className="review-row">
                    <span className="review-label">Registration ID</span>
                    <span className="review-value fw-bold" style={{ color: "var(--primary-light)" }}>{team.registration_id}</span>
                  </div>
                  <div className="review-row">
                    <span className="review-label">Event</span>
                    <span className="review-value">{team.event_name}</span>
                  </div>
                  <div className="review-row">
                    <span className="review-label">Team Name</span>
                    <span className="review-value">{team.team_name}</span>
                  </div>
                  <div className="review-row">
                    <span className="review-label">College</span>
                    <span className="review-value">{team.college_name}</span>
                  </div>
                  <div className="review-row">
                    <span className="review-label">Department</span>
                    <span className="review-value">{team.department}</span>
                  </div>
                  <div className="review-row">
                    <span className="review-label">Registered</span>
                    <span className="review-value">{new Date(team.registered_at).toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {lead && (
                  <div className="card" style={{ marginBottom: "1rem" }}>
                    <div className="card-header"><div className="card-title">Team Lead</div></div>
                    <div className="review-row"><span className="review-label">Name</span><span className="review-value">{lead.name}</span></div>
                    <div className="review-row"><span className="review-label">Student ID</span><span className="review-value">{lead.student_id}</span></div>
                    <div className="review-row"><span className="review-label">Email</span><span className="review-value">{lead.email}</span></div>
                    <div className="review-row"><span className="review-label">Phone</span><span className="review-value">{lead.phone}</span></div>
                  </div>
                )}

                {membersList.length > 0 && (
                  <div className="card">
                    <div className="card-header"><div className="card-title">Team Members</div></div>
                    {membersList.map((m, i) => (
                      <div key={m.id} style={{ paddingBottom: i < membersList.length - 1 ? "1rem" : 0, marginBottom: i < membersList.length - 1 ? "1rem" : 0, borderBottom: i < membersList.length - 1 ? "1px solid var(--border)" : "none" }}>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Member {i + 1}</div>
                        <div className="review-row"><span className="review-label">Name</span><span className="review-value">{m.name}</span></div>
                        <div className="review-row"><span className="review-label">Student ID</span><span className="review-value">{m.student_id}</span></div>
                        <div className="review-row"><span className="review-label">Email</span><span className="review-value">{m.email}</span></div>
                        <div className="review-row"><span className="review-label">Phone</span><span className="review-value">{m.phone}</span></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: QR Pass */}
              <div>
                <div className="qr-pass" style={{ position: "sticky", top: "80px" }}>
                  <div className="qr-pass-header">
                    <div className="qr-pass-logo">AIRO 6.0</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Dept. of AI & DS · Sairam Engineering College</div>
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
                  <div className="pass-actions" style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                    <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={handleDownload}>↓ Download</button>
                    <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => window.print()}>🖨 Print</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!team && !loading && !error && (
            <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
              <p>Enter your Registration ID above to view your registration details.</p>
              <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
                Don&apos;t have one? <Link href="/register" style={{ color: "var(--primary-light)" }}>Register here</Link>
              </p>
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
