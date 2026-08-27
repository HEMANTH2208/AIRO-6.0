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
      {/* Inner — Cybernetic target reticle center */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isPointer ? "8px" : "4px",
          height: isPointer ? "8px" : "4px",
          backgroundColor: "#00d4ff",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99999,
          transform: `translate3d(${pos.x - (isPointer ? 4 : 2)}px, ${pos.y - (isPointer ? 4 : 2)}px, 0) scale(${isClicking ? 0.7 : 1})`,
          transition: "width 0.15s ease, height 0.15s ease, background-color 0.15s ease, transform 0.05s ease",
          boxShadow: isPointer
            ? "0 0 10px #00d4ff, 0 0 20px rgba(0, 212, 255, 0.6)"
            : "0 0 6px rgba(0, 212, 255, 0.8)",
        }}
      />
      {/* Outer — Cybernetic bracket/target circle */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isPointer ? "36px" : "24px",
          height: isPointer ? "36px" : "24px",
          border: `1.5px solid ${isPointer ? "rgba(0, 212, 255, 0.8)" : "rgba(0, 212, 255, 0.3)"}`,
          backgroundColor: isPointer ? "rgba(0, 212, 255, 0.05)" : "transparent",
          borderRadius: isPointer ? "4px" : "50%",
          pointerEvents: "none",
          zIndex: 99998,
          transform: `translate3d(${trailPos.x - (isPointer ? 18 : 12)}px, ${trailPos.y - (isPointer ? 18 : 12)}px, 0) scale(${isClicking ? 0.85 : 1}) ${isPointer ? "rotate(45deg)" : "rotate(0deg)"}`,
          transition: "width 0.2s ease, height 0.2s ease, border-color 0.2s ease, background-color 0.2s ease, border-radius 0.2s ease, transform 0.2s ease",
          boxShadow: isPointer ? "0 0 12px rgba(0, 212, 255, 0.2)" : "none",
        }}
      />
      {/* Click burst ripple effect */}
      {isClicking && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            border: "1.5px solid rgba(0, 212, 255, 0.5)",
            pointerEvents: "none",
            zIndex: 99997,
            transform: `translate3d(${pos.x - 25}px, ${pos.y - 25}px, 0)`,
            animation: "cybertronPulse 0.3s ease-out forwards",
          }}
        />
      )}
    </>
  );
}
