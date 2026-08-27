"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailPos, setTrailPos] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on fine pointer devices (desktop)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.closest("button") ||
          target.closest("a") ||
          target.getAttribute("role") === "button" ||
          target.tagName === "INPUT" ||
          target.tagName === "SELECT")
      ) {
        setIsPointer(true);
      } else {
        setIsPointer(false);
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  // Smooth lerp trail effect
  useEffect(() => {
    let animId: number;
    const follow = () => {
      setTrailPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.18,
        y: prev.y + (pos.y - prev.y) * 0.18,
      }));
      animId = requestAnimationFrame(follow);
    };
    animId = requestAnimationFrame(follow);
    return () => cancelAnimationFrame(animId);
  }, [pos]);

  if (!isVisible) return null;

  return (
    <>
      {/* Inner — Omnitrix hourglass dot */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isPointer ? "10px" : "6px",
          height: isPointer ? "10px" : "6px",
          backgroundColor: "#39FF14",
          borderRadius: isPointer ? "2px" : "50%",
          pointerEvents: "none",
          zIndex: 99999,
          transform: `translate3d(${pos.x - (isPointer ? 5 : 3)}px, ${pos.y - (isPointer ? 5 : 3)}px, 0) scale(${isClicking ? 0.7 : 1}) ${isPointer ? "rotate(45deg)" : ""}`,
          transition: "width 0.15s ease, height 0.15s ease, background-color 0.15s ease, transform 0.05s ease, border-radius 0.15s ease",
          boxShadow: isPointer
            ? "0 0 12px #39FF14, 0 0 25px rgba(57, 255, 20, 0.4)"
            : "0 0 8px rgba(57, 255, 20, 0.6)",
        }}
      />
      {/* Outer — Omnitrix energy ring */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isPointer ? "42px" : "28px",
          height: isPointer ? "42px" : "28px",
          border: `1.5px solid ${isPointer ? "rgba(57, 255, 20, 0.7)" : "rgba(57, 255, 20, 0.35)"}`,
          backgroundColor: isPointer ? "rgba(57, 255, 20, 0.06)" : "rgba(57, 255, 20, 0.02)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99998,
          transform: `translate3d(${trailPos.x - (isPointer ? 21 : 14)}px, ${trailPos.y - (isPointer ? 21 : 14)}px, 0) scale(${isClicking ? 0.85 : 1})`,
          transition: "width 0.2s ease, height 0.2s ease, border-color 0.2s ease, background-color 0.2s ease",
          backdropFilter: isPointer ? "blur(1px)" : "none",
          boxShadow: isPointer ? "0 0 15px rgba(57, 255, 20, 0.15)" : "none",
        }}
      />
      {/* Click burst effect */}
      {isClicking && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "2px solid rgba(57, 255, 20, 0.4)",
            pointerEvents: "none",
            zIndex: 99997,
            transform: `translate3d(${pos.x - 30}px, ${pos.y - 30}px, 0)`,
            animation: "omnitrixPulse 0.3s ease-out forwards",
          }}
        />
      )}
    </>
  );
}
