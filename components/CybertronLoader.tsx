"use client";

import { useState, useEffect } from "react";

export default function CybertronLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [bootText, setBootText] = useState("INITIALIZING SYSTEM CORE...");

  useEffect(() => {
    const textTimer1 = setTimeout(() => setBootText("CONFIGURING COMMAND NETWORK..."), 500);
    const textTimer2 = setTimeout(() => setBootText("CALIBRATING ALLIANCE FACTIONS..."), 1000);
    const textTimer3 = setTimeout(() => setBootText("SYSTEM ONLINE // READY TO TRANSFORM"), 1500);

    const fadeTimer = setTimeout(() => setFading(true), 2000);
    const removeTimer = setTimeout(() => setVisible(false), 2500);

    return () => {
      clearTimeout(textTimer1);
      clearTimeout(textTimer2);
      clearTimeout(textTimer3);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#08080c",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.5s ease",
        pointerEvents: fading ? "none" : "all",
      }}
    >
      {/* Cybertron Command Shield Logo Interface */}
      <div
        style={{
          position: "relative",
          width: "140px",
          height: "140px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Outer Rotating HUD Ring (Electric Cyan) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "3px dashed rgba(0, 212, 255, 0.2)",
            borderTopColor: "#00d4ff",
            borderBottomColor: "#00d4ff",
            animation: "cybertronSpin 2s linear infinite",
          }}
        />

        {/* Middle Counter-Rotating Gear Ring (Energetic Blue) */}
        <div
          style={{
            position: "absolute",
            inset: "16px",
            borderRadius: "50%",
            border: "2px solid rgba(0, 102, 255, 0.1)",
            borderLeftColor: "#0066ff",
            borderRightColor: "#0066ff",
            animation: "cybertronSpin 3s linear infinite reverse",
          }}
        />

        {/* Inner Core (Amber warning highlight) */}
        <div
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, rgba(0, 102, 255, 0.05) 70%, transparent 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "cybertronPulse 1.8s ease-in-out infinite",
          }}
        >
          {/* Cybernetic HUD Target SVG */}
          <svg
            viewBox="0 0 40 40"
            width="40"
            height="40"
            style={{ filter: "drop-shadow(0 0 8px rgba(0, 212, 255, 0.7))" }}
          >
            {/* Center target circle */}
            <circle cx="20" cy="20" r="14" fill="none" stroke="#00d4ff" strokeWidth="1.5" strokeDasharray="6 3" />
            <circle cx="20" cy="20" r="4" fill="#ffaa00" />
            {/* HUD reticle brackets */}
            <path d="M 12 10 L 8 10 L 8 14" fill="none" stroke="#00d4ff" strokeWidth="2.5" />
            <path d="M 28 10 L 32 10 L 32 14" fill="none" stroke="#00d4ff" strokeWidth="2.5" />
            <path d="M 12 30 L 8 30 L 8 26" fill="none" stroke="#00d4ff" strokeWidth="2.5" />
            <path d="M 28 30 L 32 30 L 32 26" fill="none" stroke="#00d4ff" strokeWidth="2.5" />
          </svg>
        </div>
      </div>

      {/* Primary Logo Header */}
      <div
        style={{
          marginTop: "1.8rem",
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "1.6rem",
          fontWeight: 900,
          color: "#00d4ff",
          letterSpacing: "0.15em",
          textShadow: "0 0 15px rgba(0, 212, 255, 0.5)",
        }}
      >
        AIRO 6.0
      </div>

      {/* Booting Terminal Status Text */}
      <div
        style={{
          marginTop: "0.5rem",
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "0.65rem",
          fontWeight: 700,
          color: "#ffaa00",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          textShadow: "0 0 8px rgba(255, 170, 0, 0.3)",
        }}
      >
        {bootText}
      </div>
    </div>
  );
}
