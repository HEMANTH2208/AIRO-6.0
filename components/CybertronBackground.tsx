"use client";

import { useEffect, useRef } from "react";

export default function CybertronBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      pulse: number;
    }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize floating nodes / sparks
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.15 + 0.04,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    let angle = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;

      // Draw dark grid lines (System Grid)
      ctx.strokeStyle = "rgba(0, 212, 255, 0.015)";
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw rotating HUD mechanical rings in the background
      ctx.save();
      ctx.translate(width / 2, height / 2);
      angle += 0.0012; // slow rotation speed

      // Ring 1 (Outer segmented ring)
      ctx.strokeStyle = "rgba(0, 212, 255, 0.02)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 320, angle, angle + Math.PI * 0.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 320, angle + Math.PI, angle + Math.PI * 1.6);
      ctx.stroke();

      // Ring 2 (Inner tech ring with dashed structure)
      ctx.strokeStyle = "rgba(0, 102, 255, 0.015)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([10, 25]);
      ctx.beginPath();
      ctx.arc(0, 0, 220, -angle * 1.5, -angle * 1.5 + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]); // Reset

      // Center crosshair markings
      ctx.strokeStyle = "rgba(0, 212, 255, 0.01)";
      ctx.beginPath();
      ctx.moveTo(-40, 0); ctx.lineTo(40, 0);
      ctx.moveTo(0, -40); ctx.lineTo(0, 40);
      ctx.stroke();

      ctx.restore();

      // Draw floating nodes & spark links
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.015;

        // Wrap around borders
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = p.alpha * (0.4 + 0.6 * Math.sin(p.pulse));

        // Radial glow
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6);
        gradient.addColorStop(0, `rgba(0, 212, 255, ${currentAlpha})`);
        gradient.addColorStop(1, "rgba(0, 212, 255, 0)");
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
        ctx.fill();

        // Node dot
        ctx.beginPath();
        ctx.fillStyle = `rgba(0, 212, 255, ${currentAlpha * 2.5})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw light circuit connection traces between nearby nodes
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.04 * (1 - dist / 180)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.8,
      }}
    />
  );
}
