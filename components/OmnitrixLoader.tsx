"use client";

import { useState, useEffect } from "react";

export default function OmnitrixLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setFading(true), 1800);
    const timer2 = setTimeout(() => setVisible(false), 2300);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#0a0a0f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.5s ease",
        pointerEvents: fading ? "none" : "all",
      }}
    >
      {/* Omnitrix Watch Face */}
      <div
        style={{
          position: "relative",
          width: "120px",
          height: "120px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Outer spinning ring */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "3px solid rgba(57, 255, 20, 0.15)",
            borderTopColor: "#39FF14",
            borderRightColor: "#39FF14",
            animation: "omnitrixSpin 1.5s linear infinite",
          }}
        />

        {/* Middle ring */}
        <div
          style={{
            position: "absolute",
            inset: "12px",
            borderRadius: "50%",
            border: "2px solid rgba(57, 255, 20, 0.1)",
            borderBottomColor: "rgba(57, 255, 20, 0.5)",
            animation: "omnitrixSpin 2.5s linear infinite reverse",
          }}
        />

        {/* Inner core */}
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(57, 255, 20, 0.2) 0%, rgba(57, 255, 20, 0.05) 70%, transparent 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "omnitrixPulse 2s ease-in-out infinite",
          }}
        >
          {/* Hourglass SVG */}
          <svg
            viewBox="0 0 40 40"
            width="36"
            height="36"
            style={{ filter: "drop-shadow(0 0 8px rgba(57, 255, 20, 0.6))" }}
          >
            {/* Hourglass shape */}
            <polygon
              points="8,6 32,6 22,20 32,34 8,34 18,20"
              fill="none"
              stroke="#39FF14"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Inner diamond */}
            <polygon
              points="15,14 25,14 20,20 25,26 15,26 20,20"
              fill="rgba(57, 255, 20, 0.3)"
              stroke="#39FF14"
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>

      {/* Text */}
      <div
        style={{
          marginTop: "1.5rem",
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "1.4rem",
          fontWeight: 900,
          color: "#39FF14",
          letterSpacing: "0.12em",
          textShadow: "0 0 20px rgba(57, 255, 20, 0.4)",
        }}
      >
        AIRO 6.0
      </div>
      <div
        style={{
          marginTop: "0.3rem",
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "0.6rem",
          fontWeight: 500,
          color: "rgba(57, 255, 20, 0.5)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        Omnitrix Initializing...
      </div>
    </div>
  );
}
