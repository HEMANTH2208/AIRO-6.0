"use client";

import Link from "next/link";

/**
 * TransformerHeroFallback
 *
 * Renders when:
 * - `prefers-reduced-motion: reduce` is set
 * - WebGL is not available
 * - Low-end device detected (navigator.hardwareConcurrency <= 2)
 *
 * Pure CSS + SVG — zero JS animation, zero 3D.
 * All symposium info is always visible.
 */
export default function TransformerHeroFallback() {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "6rem 2rem 4rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background circuit glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,212,255,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Robot silhouette — built from CSS shapes */}
      <div
        aria-hidden="true"
        style={{
          position: "relative",
          width: 180,
          height: 280,
          marginBottom: "3rem",
          filter: "drop-shadow(0 0 24px rgba(0,212,255,0.45))",
        }}
      >
        <RobotSVG />
      </div>

      {/* Text content */}
      <div style={{ textAlign: "center", maxWidth: 600, position: "relative" }}>
        <div
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.25em",
            color: "var(--primary)",
            fontFamily: "var(--font-heading)",
            marginBottom: "1rem",
            textTransform: "uppercase",
          }}
        >
          CYBERTRON COMMAND ONLINE
        </div>

        <h1
          style={{
            fontSize: "clamp(2.5rem, 8vw, 5rem)",
            fontWeight: 900,
            fontFamily: "var(--font-heading)",
            background: "var(--gradient-primary)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "0.5rem",
            lineHeight: 1.1,
          }}
        >
          AIRO 6.0
        </h1>

        <p
          style={{
            fontSize: "0.9rem",
            fontFamily: "var(--font-heading)",
            letterSpacing: "0.08em",
            color: "var(--text-secondary)",
            marginBottom: "1.5rem",
          }}
        >
          TRANSFORM · INNOVATE · COMPETE
        </p>

        {/* Critical info — always visible, never gated */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
            marginBottom: "2.5rem",
          }}
        >
          <InfoBadge label="DATE" value="08 OCT 2026" />
          <InfoBadge label="VENUE" value="Sairam Engineering College, Chennai" />
          <InfoBadge label="DEPT" value="AI & Data Science" />
          <InfoBadge label="ENTRY" value="FREE" accent />
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/register"
            className="btn btn-primary btn-xl"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
          >
            ⚡ Transform Now
          </Link>
          <Link href="/events" className="btn btn-secondary btn-xl">
            View Events →
          </Link>
        </div>
      </div>
    </section>
  );
}

function InfoBadge({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        background: accent ? "rgba(0,212,255,0.08)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${accent ? "rgba(0,212,255,0.3)" : "var(--border)"}`,
        borderRadius: "var(--radius-md)",
        padding: "0.5rem 1rem",
        textAlign: "left",
      }}
    >
      <div
        style={{
          fontSize: "0.6rem",
          letterSpacing: "0.15em",
          color: accent ? "var(--primary)" : "var(--text-muted)",
          fontFamily: "var(--font-heading)",
          marginBottom: "0.15rem",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "0.85rem",
          fontWeight: 600,
          color: accent ? "var(--primary-light)" : "var(--text-primary)",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function RobotSVG() {
  return (
    <svg
      viewBox="0 0 180 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="180"
      height="280"
      style={{
        animation: "robotPulse 3s ease-in-out infinite",
      }}
    >
      <style>{`
        @keyframes robotPulse {
          0%, 100% { opacity: 0.85; filter: brightness(1); }
          50% { opacity: 1; filter: brightness(1.25) drop-shadow(0 0 16px #00d4ff); }
        }
        @keyframes eyeGlow {
          0%, 100% { fill: #00d4ff; opacity: 0.8; }
          50% { fill: #4df0ff; opacity: 1; }
        }
      `}</style>

      {/* Head */}
      <rect x="55" y="10" width="70" height="55" rx="6" fill="#0f1e30" stroke="#00d4ff" strokeWidth="1.5" />
      {/* Antenna */}
      <rect x="87" y="2" width="6" height="12" rx="3" fill="#00d4ff" opacity="0.7" />
      {/* Eyes */}
      <rect x="65" y="28" width="18" height="10" rx="3" fill="#00d4ff" style={{ animation: "eyeGlow 2s ease-in-out infinite" }} />
      <rect x="97" y="28" width="18" height="10" rx="3" fill="#00d4ff" style={{ animation: "eyeGlow 2s ease-in-out infinite 0.5s" }} />
      {/* Mouth grille */}
      <rect x="68" y="48" width="44" height="6" rx="2" fill="none" stroke="#1e4a6e" strokeWidth="1" />
      <line x1="80" y1="48" x2="80" y2="54" stroke="#1e4a6e" strokeWidth="0.5" />
      <line x1="92" y1="48" x2="92" y2="54" stroke="#1e4a6e" strokeWidth="0.5" />
      <line x1="104" y1="48" x2="104" y2="54" stroke="#1e4a6e" strokeWidth="0.5" />

      {/* Neck */}
      <rect x="78" y="65" width="24" height="12" rx="2" fill="#0d1a28" stroke="#14293d" strokeWidth="1" />

      {/* Torso */}
      <rect x="40" y="77" width="100" height="80" rx="6" fill="#0f1e30" stroke="#00d4ff" strokeWidth="1.5" />
      {/* Chest plate / Autobot symbol area */}
      <rect x="65" y="90" width="50" height="35" rx="4" fill="#0a1524" stroke="#1e4a6e" strokeWidth="1" />
      {/* Chest emissive strips */}
      <rect x="68" y="93" width="44" height="3" rx="1" fill="#00d4ff" opacity="0.6" />
      <rect x="68" y="100" width="44" height="3" rx="1" fill="#00d4ff" opacity="0.4" />
      <rect x="68" y="107" width="44" height="3" rx="1" fill="#ffaa00" opacity="0.35" />
      {/* Core energy orb */}
      <circle cx="90" cy="126" r="10" fill="#00d4ff" opacity="0.15" stroke="#00d4ff" strokeWidth="1" />
      <circle cx="90" cy="126" r="5" fill="#00d4ff" opacity="0.6" />

      {/* Left arm */}
      <rect x="8" y="80" width="28" height="70" rx="5" fill="#0d1a28" stroke="#14293d" strokeWidth="1.5" />
      {/* Left shoulder pad */}
      <rect x="5" y="77" width="34" height="18" rx="4" fill="#0f1e30" stroke="#00d4ff" strokeWidth="1" />
      {/* Left hand */}
      <rect x="10" y="150" width="24" height="18" rx="3" fill="#0a1524" stroke="#14293d" strokeWidth="1" />

      {/* Right arm */}
      <rect x="144" y="80" width="28" height="70" rx="5" fill="#0d1a28" stroke="#14293d" strokeWidth="1.5" />
      {/* Right shoulder pad */}
      <rect x="141" y="77" width="34" height="18" rx="4" fill="#0f1e30" stroke="#00d4ff" strokeWidth="1" />
      {/* Right hand */}
      <rect x="146" y="150" width="24" height="18" rx="3" fill="#0a1524" stroke="#14293d" strokeWidth="1" />

      {/* Waist */}
      <rect x="50" y="157" width="80" height="20" rx="3" fill="#0a1524" stroke="#14293d" strokeWidth="1" />
      <rect x="60" y="160" width="60" height="3" rx="1" fill="#00d4ff" opacity="0.3" />

      {/* Left leg */}
      <rect x="48" y="177" width="34" height="75" rx="5" fill="#0d1a28" stroke="#14293d" strokeWidth="1.5" />
      {/* Left knee joint */}
      <rect x="50" y="222" width="30" height="10" rx="3" fill="#0f1e30" stroke="#00d4ff" strokeWidth="0.8" />
      {/* Left foot */}
      <rect x="44" y="250" width="42" height="18" rx="4" fill="#0a1524" stroke="#14293d" strokeWidth="1" />

      {/* Right leg */}
      <rect x="98" y="177" width="34" height="75" rx="5" fill="#0d1a28" stroke="#14293d" strokeWidth="1.5" />
      {/* Right knee joint */}
      <rect x="100" y="222" width="30" height="10" rx="3" fill="#0f1e30" stroke="#00d4ff" strokeWidth="0.8" />
      {/* Right foot */}
      <rect x="94" y="250" width="42" height="18" rx="4" fill="#0a1524" stroke="#14293d" strokeWidth="1" />

      {/* Edge highlight lines (mechanical detail) */}
      <line x1="40" y1="77" x2="40" y2="157" stroke="rgba(0,212,255,0.08)" strokeWidth="1" />
      <line x1="140" y1="77" x2="140" y2="157" stroke="rgba(0,212,255,0.08)" strokeWidth="1" />
    </svg>
  );
}
