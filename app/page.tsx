"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { downloadQRCard } from "@/lib/clientDownload";

interface Event {
  id: number;
  name: string;
  slug: string;
  description: string;
  duration: string;
  min_team_size: number;
  max_team_size: number;
  status: string;
}

interface Registration {
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
  participantsCount: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

const EVENT_ICONS: Record<string, string> = {
  "tech-auction": "🏷️",
  "tech-crime-scene": "🔍",
  "agentic-paradox": "🤖",
  "prompt-to-product": "⚡",
  "ai-pitch": "🚀",
  "vibecraft": "🎨",
};

export default function HomePage() {
  // Session & Data States
  const [user, setUser] = useState<User | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [totalTeams, setTotalTeams] = useState(0);
  const [loading, setLoading] = useState(true);

  // Auth Form States
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Fetch current session and public events
  const loadData = async () => {
    try {
      const [resMe, resEvents] = await Promise.all([
        fetch("/api/participant/me"),
        fetch("/api/events"),
      ]);

      const dataMe = await resMe.json();
      const dataEvents = await resEvents.json();

      if (dataMe.user) {
        setUser(dataMe.user);
        setRegistrations(dataMe.registrations || []);
      }
      setEvents(dataEvents.events || []);
      setTotalTeams(dataEvents.totalTeams || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Load remembered email
    const remembered = localStorage.getItem("last_participant_email");
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    setSubmitting(true);

    try {
      if (isForgotPassword) {
        // Reset password request
        const res = await fetch("/api/participant/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Reset password failed");

        setAuthSuccess("Password reset successfully! Log in with your new password.");
        setIsForgotPassword(false);
        setPassword("");
      } else if (isLoginTab) {
        // Login request
        const res = await fetch("/api/participant/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Authentication failed");

        if (rememberMe) {
          localStorage.setItem("last_participant_email", email);
        } else {
          localStorage.removeItem("last_participant_email");
        }

        setUser(data.user);
        await loadData();
      } else {
        // Signup request
        const res = await fetch("/api/participant/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create account");

        setAuthSuccess("Account created successfully! Please log in.");
        setIsLoginTab(true);
        setPassword("");
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/participant/logout", { method: "POST" });
      setUser(null);
      setRegistrations([]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPass = (reg: Registration) => {
    if (!reg.qr_code) return;
    downloadQRCard(
      {
        registration_id: reg.registration_id,
        event_name: reg.event_name,
        team_name: reg.team_name,
        college_name: reg.college_name,
        qr_code: reg.qr_code,
      },
      reg.participantsCount
    );
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="page-loading-spinner" />
        <p>Loading AIRO 6.0...</p>
      </div>
    );
  }

  // 1. RENDER LOGIN/SIGNUP GATE IF NOT LOGGED IN
  if (!user) {
    return (
      <div className="section" style={{ minHeight: "calc(100vh - var(--nav-height))", display: "flex", alignItems: "center" }}>
        <div className="container" style={{ maxWidth: "460px" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 800, background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: "0.25rem" }}>
              AIRO 6.0
            </h1>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
              Sairam Engineering College · Dept. of AI & DS
            </p>
          </div>

          <div className="card" style={{ padding: "2rem" }}>
            {isForgotPassword ? (
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>Forgot Password?</h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                  Enter your email address and a new password below to update your account credentials.
                </p>

                {authError && <div className="alert alert-error" style={{ marginBottom: "1rem", fontSize: "0.85rem" }}>{authError}</div>}
                {authSuccess && <div className="alert alert-success" style={{ marginBottom: "1rem", fontSize: "0.85rem" }}>{authSuccess}</div>}

                <form onSubmit={handleAuthSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter registered email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: "0.75rem" }} disabled={submitting}>
                    {submitting ? <span className="loading-spinner" /> : "Update Password"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline btn-block"
                    onClick={() => { setIsForgotPassword(false); setAuthError(""); setAuthSuccess(""); }}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            ) : (
              <div>
                {/* Tabs */}
                <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: "1.5rem" }}>
                  <button
                    type="button"
                    onClick={() => { setIsLoginTab(true); setAuthError(""); setAuthSuccess(""); }}
                    style={{ flex: 1, paddingBottom: "0.75rem", fontWeight: 600, fontSize: "0.95rem", color: isLoginTab ? "var(--primary-light)" : "var(--text-muted)", borderBottom: isLoginTab ? "2px solid var(--primary)" : "none" }}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsLoginTab(false); setAuthError(""); setAuthSuccess(""); }}
                    style={{ flex: 1, paddingBottom: "0.75rem", fontWeight: 600, fontSize: "0.95rem", color: !isLoginTab ? "var(--primary-light)" : "var(--text-muted)", borderBottom: !isLoginTab ? "2px solid var(--primary)" : "none" }}
                  >
                    Sign Up
                  </button>
                </div>

                {authError && <div className="alert alert-error" style={{ marginBottom: "1rem", fontSize: "0.85rem" }}>{authError}</div>}
                {authSuccess && <div className="alert alert-success" style={{ marginBottom: "1rem", fontSize: "0.85rem" }}>{authSuccess}</div>}

                <form onSubmit={handleAuthSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {!isLoginTab && (
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Full Name</label>
                      <input
                        className="form-control"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="e.g. name@college.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                      <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                      {isLoginTab && (
                        <button
                          type="button"
                          onClick={() => { setIsForgotPassword(true); setAuthError(""); setAuthSuccess(""); }}
                          style={{ background: "none", border: "none", color: "var(--primary-light)", fontSize: "0.78rem", cursor: "pointer", padding: 0 }}
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {isLoginTab && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
                      <input
                        type="checkbox"
                        id="remember"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{ accentColor: "var(--primary)" }}
                      />
                      <label htmlFor="remember" style={{ fontSize: "0.85rem", color: "var(--text-secondary)", cursor: "pointer" }}>
                        Remember my email
                      </label>
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: "1rem" }} disabled={submitting}>
                    {submitting ? <span className="loading-spinner" /> : isLoginTab ? "Sign In" : "Create Account"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. RENDER MAIN SYMPOSIUM CONTENT AND PROFILE IF LOGGED IN
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span>🎓</span>
              Sairam Engineering College
            </div>
            <div className="hero-title">
              <div className="gradient-text">AIRO 6.0</div>
            </div>
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginBottom: "0.25rem", fontWeight: 600 }}>
              Department of Artificial Intelligence and Data Science
            </p>
            <p className="hero-subtitle">
              Experience the future of technology at AIRO 6.0 — our annual technical symposium
              featuring AI, data science, and cutting-edge tech competitions. Open to all students.
              All events are FREE. Welcome, <strong>{user.name}</strong>!
            </p>
            <div className="hero-actions">
              <Link href="/register" className="btn btn-primary btn-xl">
                ✦ Register Now
              </Link>
              <Link href="/events" className="btn btn-secondary btn-xl">
                View Events →
              </Link>
            </div>

            <div className="hero-stats">
              <div className="hero-stat-item">
                <div className="hero-stat-value">{events.length}</div>
                <div className="hero-stat-label">Events</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-value">{totalTeams > 0 ? totalTeams + "+" : "Open"}</div>
                <div className="hero-stat-label">Teams Registered</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-value">FREE</div>
                <div className="hero-stat-label">Entry</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-value">1 Day</div>
                <div className="hero-stat-label">Symposium</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INFO BANNER */}
      <div style={{ background: "rgba(108,99,255,0.08)", borderTop: "1px solid rgba(108,99,255,0.2)", borderBottom: "1px solid rgba(108,99,255,0.2)", padding: "0.85rem 0" }}>
        <div className="container" style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>📅 Event Date: 08.10.26 (Thursday)</span>
          <span style={{ color: "var(--border)" }}>|</span>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>🏫 Sairam Engineering College, Chennai</span>
          <span style={{ color: "var(--border)" }}>|</span>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>🆓 All Events are FREE</span>
          <span style={{ color: "var(--border)" }}>|</span>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>👥 Team-based Registration</span>
        </div>
      </div>

      {/* MY PROFILE & REGISTRATIONS SECTION */}
      <section className="section" style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label">👤 Profile Dashboard</div>
            <h2 className="section-title">My Registered Events</h2>
            <p className="section-subtitle">
              Listed below are the technical events you have registered for. Download your digital entry pass card to present at the check-in counters.
            </p>
          </div>

          {registrations.length > 0 ? (
            <div className="grid-2">
              {registrations.map((reg) => (
                <div key={reg.registration_id} className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem", position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem" }}>
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "var(--primary-light)", fontWeight: 700 }}>{reg.registration_id}</div>
                      <h3 style={{ fontSize: "1.2rem", color: "var(--text-primary)", marginTop: "0.2rem" }}>{reg.event_name}</h3>
                    </div>
                    <span className={`badge ${reg.checked_in ? "badge-success" : "badge-info"}`}>
                      {reg.checked_in ? "Checked In" : "Confirmed"}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                    <div>Team Name: <strong>{reg.team_name}</strong></div>
                    <div>College: <strong>{reg.college_name}</strong></div>
                    <div>Department: <strong>{reg.department}</strong></div>
                    <div>Registered members: <strong>{reg.participantsCount}</strong></div>
                  </div>

                  <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
                    <button
                      className="btn btn-primary btn-sm btn-block"
                      onClick={() => handleDownloadPass(reg)}
                    >
                      ↓ Download Entry Pass
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "4rem 2rem", background: "rgba(26, 26, 53, 0.2)", borderRadius: "var(--radius-lg)", border: "2px dashed var(--border)" }}>
              <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "0.5rem" }}>🎟️</span>
              <p style={{ color: "var(--text-muted)" }}>You have not registered for any events yet.</p>
              <Link href="/register" className="btn btn-primary btn-sm" style={{ marginTop: "1rem" }}>
                Browse & Register Now
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* EVENTS SECTION */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-label">⚡ Competition Events</div>
            <h2 className="section-title">Choose Your Challenge</h2>
            <p className="section-subtitle">
              Six unique events designed to test your technical skills, creativity, and teamwork.
              Register your team and compete with the best.
            </p>
          </div>

          <div className="grid-3">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-icon">{EVENT_ICONS[event.slug] || "🎯"}</div>
                <div className="event-name">{event.name}</div>
                <p className="event-desc">{event.description}</p>
                <div className="event-meta">
                  <span className="event-meta-item">⏱ {event.duration}</span>
                  <span className="event-meta-item">
                    👥 {event.min_team_size === event.max_team_size
                      ? `${event.min_team_size} members`
                      : `${event.min_team_size}–${event.max_team_size} members`}
                  </span>
                  <span className="event-free-badge">FREE</span>
                </div>
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "auto" }}>
                  <Link href={`/events/${event.slug}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                    View Details
                  </Link>
                  <Link href={`/register?event=${event.id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                    Register
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-sm" style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label">📋 Process</div>
            <h2 className="section-title">How to Register</h2>
          </div>
          <div className="grid-4">
            {[
              { step: "01", icon: "🎯", title: "Select Event", desc: "Browse events and pick your competition" },
              { step: "02", icon: "👥", title: "Form Your Team", desc: "Assemble your team as per event requirements" },
              { step: "03", icon: "📝", title: "Fill Details", desc: "Enter team and participant information" },
              { step: "04", icon: "🎫", title: "Get QR Pass", desc: "Receive your registration ID and QR code" },
            ].map((item) => (
              <div key={item.step} className="card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{item.icon}</div>
                <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--primary-light)", letterSpacing: "0.1em", marginBottom: "0.35rem" }}>STEP {item.step}</div>
                <h4 style={{ marginBottom: "0.5rem" }}>{item.title}</h4>
                <p style={{ fontSize: "0.85rem" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
