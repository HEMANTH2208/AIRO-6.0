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

  const triggerAutoReset = () => {
    setTimeout(() => {
      setResult(null);
      setInput("");
      setError("");
      setCheckinMsg("");
      setCheckinError("");
    }, 2800); // 2.8s is perfect to let them read "Success" before resetting
  };

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
            // Silence noisy render scan failures
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

      // Auto check-in immediately if not already checked in
      if (data.team && !data.team.checked_in) {
        await autoCheckin(data.team.registration_id);
      } else {
        triggerAutoReset();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verification failed");
      triggerAutoReset();
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
        setCheckinMsg("✓ Checked in successfully!");
        // Re-fetch state to show latest checked_in timestamp
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
      triggerAutoReset();
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-header">
          <div>
            <div className="admin-page-title">QR Verification & Check-in</div>
            <div className="admin-page-subtitle">Scan QR codes or type Registration IDs for instant check-in</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "2rem", alignItems: "start" }}>
          {/* LEFT COLUMN: Controls & Status */}
          <div>
            <div className="card" style={{ marginBottom: "1.5rem" }}>
              <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="card-title">Check-In Console</div>
                {scannerReady && (
                  <button
                    className={`btn ${scannerActive ? "btn-danger" : "btn-primary"} btn-sm`}
                    onClick={scannerActive ? stopScanner : startScanner}
                  >
                    {scannerActive ? "Stop" : "Camera"}
                  </button>
                )}
              </div>

              {scannerActive && (
                <div style={{ margin: "1rem 0", background: "var(--bg-surface)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
                  <div id="reader" style={{ width: "100%", maxWidth: "280px", margin: "0 auto", overflow: "hidden", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}></div>
                  <p style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.75rem" }}>
                    Hold code in front of camera
                  </p>
                </div>
              )}

              {!scannerActive && (
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                  <input
                    className="form-control"
                    placeholder="Enter Registration ID"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") verify();
                    }}
                    autoFocus
                  />
                  <button className="btn btn-primary" onClick={() => verify()} disabled={loading || !input.trim()}>
                    {loading ? <span className="loading-spinner" /> : "Verify"}
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="alert alert-error" style={{ marginBottom: "1.5rem" }}>
                <span>⚠️</span> {error}
              </div>
            )}

            {checkinError && (
              <div className="alert alert-warning" style={{ marginBottom: "1.5rem" }}>
                <span>⚠️</span> {checkinError}
              </div>
            )}

            {checkinMsg && (
              <div className="alert alert-success" style={{ marginBottom: "1.5rem" }}>
                <span>✓</span> {checkinMsg}
              </div>
            )}

            {result && result.valid && (
              <div className={`checkin-result ${result.team.checked_in ? "already" : "success"}`} style={{ marginTop: 0 }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                  {result.team.checked_in ? "⚠️" : "✓"}
                </div>
                <div style={{ fontWeight: 700, fontSize: "1.05rem", color: result.team.checked_in ? "var(--warning)" : "var(--success)" }}>
                  {result.team.checked_in ? "Already Checked In" : "Valid Registration"}
                </div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                  {result.team.checked_in && result.team.checked_in_at
                    ? `Done at: ${new Date(result.team.checked_in_at).toLocaleTimeString()}`
                    : "Checked in successfully"}
                </p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Details Panel */}
          <div>
            {result && result.valid ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Team Details */}
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Registration Details</div>
                  </div>
                  <div className="review-row">
                    <span className="review-label">Registration ID</span>
                    <span className="review-value fw-bold" style={{ color: "var(--primary-light)" }}>{result.team.registration_id}</span>
                  </div>
                  <div className="review-row">
                    <span className="review-label">Event</span>
                    <span className="review-value">{result.team.event_name}</span>
                  </div>
                  <div className="review-row">
                    <span className="review-label">Team</span>
                    <span className="review-value">{result.team.team_name}</span>
                  </div>
                  <div className="review-row">
                    <span className="review-label">College</span>
                    <span className="review-value">{result.team.college_name}</span>
                  </div>
                  <div className="review-row">
                    <span className="review-label">Department</span>
                    <span className="review-value">{result.team.department}</span>
                  </div>
                  <div className="review-row">
                    <span className="review-label">Status</span>
                    <span className="badge badge-success">{result.team.registration_status}</span>
                  </div>
                </div>

                {/* Team Members */}
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Team Members ({result.participants.length})</div>
                  </div>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Role</th>
                          <th>Name</th>
                          <th>Student ID</th>
                          <th>Email</th>
                          <th>Phone</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.participants.map((p) => (
                          <tr key={p.id}>
                            <td>
                              {p.is_team_lead ? (
                                <span className="badge badge-primary">Lead</span>
                              ) : (
                                "Member"
                              )}
                            </td>
                            <td style={{ fontWeight: 600 }}>{p.name}</td>
                            <td>{p.student_id}</td>
                            <td>{p.email}</td>
                            <td>{p.phone}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  border: "2px dashed var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "6rem 2rem",
                  textAlign: "center",
                  color: "var(--text-muted)",
                  background: "rgba(26, 26, 53, 0.2)",
                }}
              >
                <span style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }}>📋</span>
                <h4 style={{ color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Details Panel</h4>
                <p style={{ fontSize: "0.85rem" }}>
                  Scan a QR code or type a registration ID to verify team details and view member information.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
