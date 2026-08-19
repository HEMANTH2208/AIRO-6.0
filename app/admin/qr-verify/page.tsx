"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";

interface Participant {
  id: number;
  name: string;
  student_id: string;
  email: string;
  phone: string;
  is_team_lead: number;
}

interface VerifyResult {
  valid: boolean;
  team: {
    id: number;
    registration_id: string;
    event_name: string;
    team_name: string;
    college_name: string;
    department: string;
    registration_status: string;
    checked_in: number;
    checked_in_at: string | null;
    registered_at: string;
  };
  participants: Participant[];
}

export default function AdminQRVerifyPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkinMsg, setCheckinMsg] = useState("");
  const [checkinError, setCheckinError] = useState("");

  const [scannerReady, setScannerReady] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const [html5QrcodeScanner, setHtml5QrcodeScanner] = useState<any>(null);

  useEffect(() => {
    // Dynamically load html5-qrcode script from CDN
    const script = document.createElement("script");
    script.src = "https://unpkg.com/html5-qrcode";
    script.async = true;
    script.onload = () => {
      setScannerReady(true);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const startScanner = () => {
    if (!scannerReady) return;
    setScannerActive(true);
    setResult(null);
    setError("");
    setCheckinMsg("");
    setCheckinError("");

    setTimeout(() => {
      try {
        const scanner = new (window as any).Html5QrcodeScanner(
          "reader",
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true,
          },
          false
        );

        scanner.render(
          async (decodedText: string) => {
            scanner.clear();
            setScannerActive(false);

            let regId = decodedText.trim();
            try {
              const parsed = JSON.parse(decodedText);
              if (parsed.id) regId = parsed.id.trim();
            } catch {
              // Raw text
            }

            setInput(regId);
            await verify(regId);
          },
          () => {
            // Silence noisey render scan failures
          }
        );

        setHtml5QrcodeScanner(scanner);
      } catch (e) {
        console.error("Scanner error", e);
        setError("Could not start camera scanner. Verify camera permissions.");
        setScannerActive(false);
      }
    }, 100);
  };

  const stopScanner = () => {
    if (html5QrcodeScanner) {
      try {
        html5QrcodeScanner.clear();
      } catch (e) {
        console.error(e);
      }
      setHtml5QrcodeScanner(null);
    }
    setScannerActive(false);
  };

  const verify = async (idToVerify?: string) => {
    const targetId = idToVerify || input;
    if (!targetId.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setCheckinMsg("");
    setCheckinError("");

    try {
      const res = await fetch("/api/qr/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registration_id: targetId.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Not found");
      setResult(data);

      // Auto check-in if scanner verified a confirmed team that is not yet checked in
      if (idToVerify && data.team && !data.team.checked_in) {
        await autoCheckin(data.team.registration_id);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const autoCheckin = async (regId: string) => {
    setCheckingIn(true);
    setCheckinMsg("");
    setCheckinError("");
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registration_id: regId }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.already_checked_in) {
          setCheckinError("Already checked in");
        } else {
          throw new Error(data.error);
        }
      } else {
        setCheckinMsg("✓ Team checked in successfully!");
        // Re-fetch state
        const resVerify = await fetch("/api/qr/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ registration_id: regId }),
        });
        const dataVerify = await resVerify.json();
        if (resVerify.ok) {
          setResult(dataVerify);
        }
      }
    } catch (e) {
      setCheckinError(e instanceof Error ? e.message : "Check-in failed");
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckin = async () => {
    if (!result?.team) return;
    await autoCheckin(result.team.registration_id);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-header">
          <div>
            <div className="admin-page-title">QR Verification & Check-in</div>
            <div className="admin-page-subtitle">Enter Registration ID to verify and check in teams</div>
          </div>
        </div>

        <div style={{ maxWidth: "700px" }}>
          {/* Input */}
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="card-title">📷 Scan / Enter Registration ID</div>
              {scannerReady && (
                <button
                  className={`btn ${scannerActive ? "btn-danger" : "btn-primary"} btn-sm`}
                  onClick={scannerActive ? stopScanner : startScanner}
                >
                  {scannerActive ? "Stop Camera" : "Start Camera Scanner"}
                </button>
              )}
            </div>

            {scannerActive && (
              <div style={{ margin: "1rem 0", background: "var(--bg-surface)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
                <div id="reader" style={{ width: "100%", maxWidth: "350px", margin: "0 auto", overflow: "hidden", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}></div>
                <p style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.75rem" }}>
                  Hold the QR code pass in front of your camera to scan
                </p>
              </div>
            )}

            {!scannerActive && (
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                <input
                  className="form-control"
                  placeholder="Enter Registration ID (e.g. AIRO-TECH-xxxxx)"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") verify(); }}
                  autoFocus
                />
                <button className="btn btn-primary" onClick={() => verify()} disabled={loading || !input.trim()}>
                  {loading ? <span className="loading-spinner" /> : "Verify"}
                </button>
              </div>
            )}
            <p className="form-hint" style={{ marginTop: "0.5rem" }}>
              Scan the QR code with your camera or enter the Registration ID manually to verify and check in.
            </p>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: "1.5rem" }}>
              <span>⚠️</span> {error}
            </div>
          )}

          {result && result.valid && (
            <div>
              {/* Check-in Status Banner */}
              <div className={`checkin-result ${result.team.checked_in ? "already" : "success"}`} style={{ marginTop: 0, marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
                  {result.team.checked_in ? "⚠️" : "✓"}
                </div>
                <div style={{ fontWeight: 700, fontSize: "1.1rem", color: result.team.checked_in ? "var(--warning)" : "var(--success)", marginBottom: "0.25rem" }}>
                  {result.team.checked_in ? "Already Checked In" : "Valid Registration"}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  {result.team.checked_in && result.team.checked_in_at
                    ? `Checked in at: ${new Date(result.team.checked_in_at).toLocaleString("en-IN")}`
                    : "Team is registered and verified. Ready to check in."}
                </div>
              </div>

              {/* Team Details */}
              <div className="card" style={{ marginBottom: "1rem" }}>
                <div className="card-header"><div className="card-title">Registration Details</div></div>
                <div className="review-row"><span className="review-label">Registration ID</span><span className="review-value fw-bold" style={{ color: "var(--primary-light)" }}>{result.team.registration_id}</span></div>
                <div className="review-row"><span className="review-label">Event</span><span className="review-value">{result.team.event_name}</span></div>
                <div className="review-row"><span className="review-label">Team</span><span className="review-value">{result.team.team_name}</span></div>
                <div className="review-row"><span className="review-label">College</span><span className="review-value">{result.team.college_name}</span></div>
                <div className="review-row"><span className="review-label">Department</span><span className="review-value">{result.team.department}</span></div>
                <div className="review-row"><span className="review-label">Status</span><span className="badge badge-success">{result.team.registration_status}</span></div>
                <div className="review-row">
                  <span className="review-label">Check-in</span>
                  <span className={`badge ${result.team.checked_in ? "badge-success" : "badge-warning"}`}>
                    {result.team.checked_in ? "Checked In" : "Not Yet"}
                  </span>
                </div>
              </div>

              {/* Participants */}
              <div className="card" style={{ marginBottom: "1.5rem" }}>
                <div className="card-header"><div className="card-title">Team Members ({result.participants.length})</div></div>
                <table>
                  <thead><tr><th>Role</th><th>Name</th><th>Student ID</th><th>Email</th><th>Phone</th></tr></thead>
                  <tbody>
                    {result.participants.map((p: Participant) => (
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

              {/* Check-in Action */}
              {checkinMsg && (
                <div className="alert alert-success" style={{ marginBottom: "1rem" }}>
                  <span>✓</span> {checkinMsg}
                </div>
              )}
              {checkinError && (
                <div className="alert alert-error" style={{ marginBottom: "1rem" }}>
                  <span>⚠️</span> {checkinError}
                </div>
              )}

              {!result.team.checked_in && (
                <button className="btn btn-success btn-lg btn-block" onClick={handleCheckin} disabled={checkingIn}>
                  {checkingIn ? <><span className="loading-spinner" /> Processing...</> : "✓ Check In This Team"}
                </button>
              )}

              <button
                className="btn btn-secondary btn-block"
                style={{ marginTop: "0.75rem" }}
                onClick={() => { setResult(null); setInput(""); setCheckinMsg(""); setCheckinError(""); }}
              >
                Verify Another →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
