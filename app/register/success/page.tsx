"use client";

import { useEffect, useState, Suspense } from "react";
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
  team_name: string;
  college_name: string;
  department: string;
  qr_code: string;
  registration_status: string;
  checked_in: number;
  registered_at: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const regId = searchParams.get("id");

  const [team, setTeam] = useState<Team | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!regId) { setError("No registration ID provided"); setLoading(false); return; }
    fetch(`/api/registration/${encodeURIComponent(regId)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setTeam(d.team);
        setParticipants(d.participants);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [regId]);

  const handleDownload = () => {
    if (!team?.qr_code) return;
    downloadQRCard(team, participants.length);
  };

  const handlePrint = () => window.print();

  if (loading) return (
    <div className="page-loading">
      <div className="page-loading-spinner" />
      <p>Loading your registration...</p>
    </div>
  );

  if (error) return (
    <div className="section">
      <div className="container" style={{ maxWidth: "500px", textAlign: "center" }}>
        <div className="alert alert-error">{error}</div>
        <Link href="/register" className="btn btn-primary">Try Again</Link>
      </div>
    </div>
  );

  if (!team) return null;

  const lead = participants.find((p) => p.is_team_lead);
  const membersList = participants.filter((p) => !p.is_team_lead);

  return (
    <div>
      <div style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)", padding: "3rem 0 2rem", textAlign: "center" }}>
        <div className="success-icon">✓</div>
        <h1 style={{ marginBottom: "0.5rem" }}>Registration Successful!</h1>
        <p>Your team has been registered for AIRO 6.0. Save your QR code for event-day entry.</p>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: "900px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "2rem", alignItems: "start" }}>
            {/* Registration Details */}
            <div>
              <div className="card" style={{ marginBottom: "1rem" }}>
                <div className="card-header">
                  <div className="card-title">Registration Details</div>
                </div>
                <div className="review-row">
                  <span className="review-label">Registration ID</span>
                  <span className="review-value fw-bold" style={{ color: "var(--primary-light)", letterSpacing: "0.05em" }}>{team.registration_id}</span>
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
                  <span className="review-label">Status</span>
                  <span className="badge badge-success">{team.registration_status}</span>
                </div>
                <div className="review-row">
                  <span className="review-label">Check-in</span>
                  <span className={`badge ${team.checked_in ? "badge-success" : "badge-warning"}`}>
                    {team.checked_in ? "Checked In" : "Pending"}
                  </span>
                </div>
              </div>

              {lead && (
                <div className="card" style={{ marginBottom: "1rem" }}>
                  <div className="card-header">
                    <div className="card-title">Team Lead</div>
                  </div>
                  <div className="review-row"><span className="review-label">Name</span><span className="review-value">{lead.name}</span></div>
                  <div className="review-row"><span className="review-label">Student ID</span><span className="review-value">{lead.student_id}</span></div>
                  <div className="review-row"><span className="review-label">Email</span><span className="review-value">{lead.email}</span></div>
                  <div className="review-row"><span className="review-label">Phone</span><span className="review-value">{lead.phone}</span></div>
                </div>
              )}

              {membersList.length > 0 && (
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Team Members</div>
                  </div>
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

            {/* QR Pass */}
            <div>
              <div className="qr-pass" style={{ position: "sticky", top: "80px" }}>
                <div className="qr-pass-header">
                  <div className="qr-pass-logo">AIRO 6.0</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Event Entry Pass</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Dept. of AI & DS · Sairam Engineering College</div>
                </div>

                <div className="qr-reg-id">{team.registration_id}</div>

                {team.qr_code && (
                  <div className="qr-code-wrapper">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={team.qr_code} alt="QR Code" style={{ width: "200px", height: "200px" }} />
                  </div>
                )}

                <div className="qr-pass-info">
                  <div className="qr-pass-row">
                    <span className="qr-pass-label">Event</span>
                    <span className="qr-pass-value">{team.event_name}</span>
                  </div>
                  <div className="qr-pass-row">
                    <span className="qr-pass-label">Team</span>
                    <span className="qr-pass-value">{team.team_name}</span>
                  </div>
                  <div className="qr-pass-row">
                    <span className="qr-pass-label">Members</span>
                    <span className="qr-pass-value">{participants.length}</span>
                  </div>
                  <div className="qr-pass-row">
                    <span className="qr-pass-label">Status</span>
                    <span className="qr-pass-value text-success">Confirmed</span>
                  </div>
                </div>

                <div className="pass-actions" style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1.25rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={handleDownload}>
                      ↓ Download QR
                    </button>
                    <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={handlePrint}>
                      🖨 Print
                    </button>
                  </div>
                  <Link href={`/dashboard?id=${team.registration_id}`} className="btn btn-outline btn-sm" style={{ textAlign: "center", justifyContent: "center" }}>
                    View My Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="page-loading"><div className="page-loading-spinner" /></div>}>
      <SuccessContent />
    </Suspense>
  );
}
