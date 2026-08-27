"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { downloadQRCard } from "@/lib/clientDownload";
import { motion } from "framer-motion";
import TransformerHeroFallback from "@/components/TransformerHeroFallback";
import { 
  Zap, 
  Calendar, 
  MapPin, 
  Trophy, 
  Users, 
  CheckCircle, 
  Download,
  ArrowRight,
  Sparkles,
  Target,
  Rocket,
  Globe,
  Clock
} from "lucide-react";

// Lazy-load the heavy 3D scene — doesn't block initial paint
const TransformerHero = dynamic(() => import("@/components/TransformerHero"), {
  ssr: false,
  loading: () => <TransformerHeroFallback />,
});

// Detect if we should use the lightweight fallback
function shouldUseFallback(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  // Check for WebGL support
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return true;
  } catch {
    return true;
  }
  return false;
}


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
  "tech-auction": "🤖",
  "tech-crime-scene": "🔍",
  "agentic-paradox": "🧠",
  "code-combat": "⚔️",
  "paper-presentation": "📄",
  "workshop": "🔧",
};

const TRANSFORMER_NAMES: Record<string, string> = {
  "tech-auction": "Optimus Prime",
  "tech-crime-scene": "Soundwave",
  "agentic-paradox": "Megatron",
  "code-combat": "Ironhide",
  "paper-presentation": "Ratchet",
  "workshop": "Wheeljack",
};

export default function HomePage() {
  // Session & Data States
  const [user, setUser] = useState<User | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [totalTeams, setTotalTeams] = useState(0);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

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
    // Resolve fallback detection after mount (client-only)
    setUseFallback(shouldUseFallback());
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
      <>
        {/* Show hero even during loading */}
        {useFallback ? <TransformerHeroFallback /> : <TransformerHero />}
        <div className="page-loading" style={{ minHeight: "30vh" }}>
          <div className="page-loading-spinner" />
          <p>Connecting to Cybertron Command...</p>
        </div>
      </>
    );
  }

  // 1. RENDER LOGIN/SIGNUP GATE IF NOT LOGGED IN
  if (!user) {
    return (
      <>
        {/* Fixed 3D Hero Background — visible to all visitors */}
        {useFallback ? <TransformerHeroFallback /> : <TransformerHero />}

        {/* Auth gate with proper z-index to appear above background */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            id="auth-gate"
            className="section"
            style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
          >
          <div className="container" style={{ maxWidth: "460px" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            {/* Cybertron Core Symbol */}
            <div style={{ margin: "0 auto 1rem", width: "60px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 40 40" width="50" height="50" style={{ filter: "drop-shadow(0 0 12px rgba(0, 212, 255, 0.5))" }}>
                <polygon points="20,3 37,12 37,28 20,37 3,28 3,12" fill="none" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="1.5" />
                <polygon points="20,3 37,12 37,28 20,37 3,28 3,12" fill="none" stroke="#00d4ff" strokeWidth="1.5" strokeDasharray="6 4" />
                <circle cx="20" cy="20" r="5" fill="#ffaa00" opacity="0.9" />
              </svg>
            </div>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 900, background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: "0.25rem", letterSpacing: "0.08em" }}>
              AIRO 6.0
            </h1>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontFamily: "var(--font-heading)", letterSpacing: "0.04em" }}>
              CYBERTRON COMMAND — AUTHORIZATION REQUIRED
            </p>
          </div>

          <div className="card" style={{ padding: "2rem" }}>
            {isForgotPassword ? (
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem", fontFamily: "var(--font-heading)" }}>Reset Command Credentials</h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                  Enter your Cybertron ID and a new access code to restore authorization.
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
        </div> {/* End of content wrapper with z-index */}
      </>
    );
  }

  // 2. RENDER MAIN SYMPOSIUM CONTENT AND PROFILE IF LOGGED IN
  return (
    <>
      {/* Fixed 3D TRANSFORMER HERO Background — spans entire page */}
      {useFallback ? <TransformerHeroFallback /> : <TransformerHero />}

      {/* All content with proper z-index to appear above background */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* INFO BANNER — CYBERTRON STATUS */}
      <section className="hero" style={{ paddingTop: "3rem", paddingBottom: "2rem", minHeight: "auto" }}>
        <div className="hero-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <Sparkles size={14} style={{ marginRight: "0.5rem" }} />
                CYBERTRON COMMAND ONLINE — Sairam Engineering College
              </span>
            </motion.div>
            <motion.div
              className="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="gradient-text">AIRO 6.0</div>
            </motion.div>
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginBottom: "0.25rem", fontWeight: 700, fontFamily: "var(--font-heading)", letterSpacing: "0.04em" }}>
              TRANSFORM • INNOVATE • COMPETE · Dept. of AI &amp; Data Science
            </p>
            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Command the battlefield. Choose your Cybertronian faction, assemble your squad,
              and dominate 6 high-stakes challenges. Systems are fully online.
              Welcome, Commander <strong>{user.name}</strong>!
            </motion.p>
            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Link href="/register" className="btn btn-primary btn-xl" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Zap size={20} />
                Transform Now
              </Link>
              <Link href="/events" className="btn btn-secondary btn-xl" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                Tactical Arsenal
                <ArrowRight size={20} />
              </Link>
            </motion.div>

            <motion.div
              className="hero-stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="hero-stat-item">
                <div className="hero-stat-value">{events.length}</div>
                <div className="hero-stat-label">Factions</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-value">{totalTeams > 0 ? totalTeams + "+" : "Open"}</div>
                <div className="hero-stat-label">Squads Registered</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-value">FREE</div>
                <div className="hero-stat-label">Entry</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-value">1 Day</div>
                <div className="hero-stat-label">Mission</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* INFO BANNER — CYBERTRON SYSTEM STATUS */}
      <div style={{ background: "rgba(0, 212, 255, 0.04)", borderTop: "1px solid rgba(0, 212, 255, 0.15)", borderBottom: "1px solid rgba(0, 212, 255, 0.15)", padding: "0.85rem 0" }}>
        <div className="container" style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Calendar size={16} />
            Mission Date: 08.10.26 (Thursday)
          </span>
          <span style={{ color: "var(--border)" }}>|</span>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <MapPin size={16} />
            Sairam Engineering College, Chennai
          </span>
          <span style={{ color: "var(--border)" }}>|</span>
          <span style={{ fontSize: "0.85rem", color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sparkles size={16} />
            All Transformations FREE
          </span>
          <span style={{ color: "var(--border)" }}>|</span>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Users size={16} />
            Squad-based Registration
          </span>
        </div>
      </div>

      {/* MY PROFILE & REGISTRATIONS SECTION */}
      <section className="section" style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-label" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Trophy size={14} />
              Cybertronian Registry
            </div>
            <h2 className="section-title">Registered Factions</h2>
            <p className="section-subtitle">
              Your registered Cybertronian factions are listed below. Download your Cybertron ID pass to present at the mission briefing.
            </p>
          </motion.div>

          {registrations.length > 0 ? (
            <div className="grid-2">
              {registrations.map((reg, index) => (
                <motion.div 
                  key={reg.registration_id} 
                  className="card" 
                  style={{ display: "flex", flexDirection: "column", gap: "1rem", position: "relative" }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5, boxShadow: "0 0 30px rgba(0, 212, 255, 0.2)" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem" }}>
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "var(--primary-light)", fontWeight: 700 }}>{reg.registration_id}</div>
                      <h3 style={{ fontSize: "1.2rem", color: "var(--text-primary)", marginTop: "0.2rem" }}>{reg.event_name}</h3>
                    </div>
                    <span className={`badge ${reg.checked_in ? "badge-success" : "badge-info"}`} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <CheckCircle size={12} />
                      {reg.checked_in ? "Checked In" : "Confirmed"}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                    <div>Team Name: <strong>{reg.team_name}</strong></div>
                    <div>College: <strong>{reg.college_name}</strong></div>
                    <div>Department: <strong>{reg.department}</strong></div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <Users size={14} />
                      Registered members: <strong>{reg.participantsCount}</strong>
                    </div>
                  </div>

                  <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn btn-primary btn-lg btn-block"
                      style={{
                        padding: "0.85rem 1.5rem",
                        fontSize: "1rem",
                        fontWeight: 700,
                        minHeight: "50px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        boxShadow: "0 4px 20px rgba(99, 102, 241, 0.4)",
                        borderRadius: "var(--radius-md)",
                        cursor: "pointer",
                      }}
                      onClick={() => handleDownloadPass(reg)}
                    >
                      <Download size={20} />
                      Download Cybertron ID Pass
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              style={{ textAlign: "center", padding: "4rem 2rem", background: "rgba(26, 26, 53, 0.2)", borderRadius: "var(--radius-lg)", border: "2px dashed var(--border)" }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "0.5rem" }}>
                <Zap size={40} style={{ display: "inline-block" }} />
              </span>
              <p style={{ color: "var(--text-muted)" }}>No active registrations. Cybertron Command awaits your squad.</p>
              <Link href="/register" className="btn btn-primary btn-sm" style={{ marginTop: "1rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <Zap size={16} />
                Choose Your Faction
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* EVENTS SECTION */}
      <section className="section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-label" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Zap size={14} />
              Tactical Arsenal
            </div>
            <h2 className="section-title">Choose Your Faction</h2>
            <p className="section-subtitle">
              Six Cybertronian factions, each with a unique mission profile. Pick your faction,
              assemble your squad, and prove your dominance on the battlefield.
            </p>
          </motion.div>

          <div className="grid-3">
            {events.map((event, index) => (
              <motion.div 
                key={event.id} 
                className="event-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.2 }
                }}
              >
                <motion.div 
                  className="event-icon"
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  {EVENT_ICONS[event.slug] || "🎯"}
                </motion.div>
                <div className="event-name">{event.name}</div>
                <p className="event-desc">{event.description}</p>
                <div className="event-meta">
                  <span className="event-meta-item" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Clock size={12} /> {event.duration}
                  </span>
                  <span className="event-meta-item" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Users size={12} /> {event.min_team_size === event.max_team_size
                      ? `${event.min_team_size} members`
                      : `${event.min_team_size}–${event.max_team_size} members`}
                  </span>
                  <span className="event-free-badge">FREE</span>
                </div>
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "auto" }}>
                  <Link href={`/events/${event.slug}`} className="btn btn-secondary btn-sm" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem" }}>
                    View Details
                  </Link>
                  <Link href={`/register?event=${event.id}`} className="btn btn-primary btn-sm" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem" }}>
                    Register
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-sm" style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-label" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Target size={14} />
              Protocol
            </div>
            <h2 className="section-title">Cybertron Protocol</h2>
          </motion.div>
          <div className="grid-4">
            {[
              { step: "01", icon: Zap, title: "Select Faction", desc: "Browse the tactical arsenal and choose your Cybertronian faction" },
              { step: "02", icon: Users, title: "Assemble Squad", desc: "Form a team of Autobot or Decepticon allies" },
              { step: "03", icon: Globe, title: "Input Alliance Data", desc: "Enter squad commander and member information" },
              { step: "04", icon: Rocket, title: "Deploy", desc: "Receive your Cybertron ID and mission QR pass" },
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div 
                  key={item.step} 
                  className="card" 
                  style={{ textAlign: "center" }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                >
                  <motion.div 
                    style={{ fontSize: "2rem", marginBottom: "0.75rem", display: "flex", justifyContent: "center" }}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <IconComponent size={32} style={{ color: "var(--primary)" }} />
                  </motion.div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--primary)", letterSpacing: "0.1em", marginBottom: "0.35rem", fontFamily: "var(--font-heading)" }}>PHASE {item.step}</div>
                  <h4 style={{ marginBottom: "0.5rem" }}>{item.title}</h4>
                  <p style={{ fontSize: "0.85rem" }}>{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      </div> {/* End of content wrapper with z-index */}
    </>
  );
}
