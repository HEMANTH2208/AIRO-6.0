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
      {/* Inner Dot */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isPointer ? "10px" : "6px",
          height: isPointer ? "10px" : "6px",
          backgroundColor: isPointer ? "var(--secondary)" : "var(--primary-light)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99999,
          transform: `translate3d(${pos.x - (isPointer ? 5 : 3)}px, ${pos.y - (isPointer ? 5 : 3)}px, 0) scale(${isClicking ? 0.7 : 1})`,
          transition: "width 0.15s ease, height 0.15s ease, background-color 0.15s ease, transform 0.05s ease",
          boxShadow: isPointer ? "0 0 10px var(--secondary)" : "0 0 8px var(--primary-light)",
        }}
      />
      {/* Outer Glow Ring */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isPointer ? "42px" : "28px",
          height: isPointer ? "42px" : "28px",
          border: `1.5px solid ${isPointer ? "rgba(0, 212, 170, 0.6)" : "rgba(108, 99, 255, 0.45)"}`,
          backgroundColor: isPointer ? "rgba(0, 212, 170, 0.08)" : "rgba(108, 99, 255, 0.04)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99998,
          transform: `translate3d(${trailPos.x - (isPointer ? 21 : 14)}px, ${trailPos.y - (isPointer ? 21 : 14)}px, 0) scale(${isClicking ? 0.85 : 1})`,
          transition: "width 0.2s ease, height 0.2s ease, border-color 0.2s ease, background-color 0.2s ease",
          backdropFilter: isPointer ? "blur(1px)" : "none",
        }}
      />
    </>
  );
}
