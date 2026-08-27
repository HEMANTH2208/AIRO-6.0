"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, UserPlus, LayoutDashboard, Mail, MapPin, Info } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  if (isAdmin) return null;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">AIRO 6.0</div>
            <p style={{ fontSize: "0.85rem", marginTop: "0.5rem", maxWidth: "280px" }}>
              The Transformers Cybernetic Symposium — powered by the Department of Artificial Intelligence and
              Data Science, Sairam Engineering College. Transform, Innovate, and Compete.
            </p>
          </div>

          <div>
            <div className="footer-title">Command Center</div>
            <ul className="footer-links">
              <li><Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Home size={14} />Home Base</Link></li>
              <li><Link href="/events" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Calendar size={14} />Tactical Arsenal</Link></li>
              <li><Link href="/register" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><UserPlus size={14} />Transform</Link></li>
              <li><Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><LayoutDashboard size={14} />Mission Log</Link></li>
            </ul>
          </div>

          <div>
            <div className="footer-title">Cybertronian Factions</div>
            <ul className="footer-links">
              <li><Link href="/events/tech-auction">🤖 Optimus Prime (Tech Auction)</Link></li>
              <li><Link href="/events/tech-crime-scene">🔊 Soundwave (Investigate)</Link></li>
              <li><Link href="/events/agentic-paradox">🦾 Megatron (AI Agents)</Link></li>
              <li><Link href="/events/prompt-to-product">⚡ Bumblebee (Prompt-to-Product)</Link></li>
              <li><Link href="/events/ai-pitch">🦖 Grimlock (AI Pitch)</Link></li>
              <li><Link href="/events/vibecraft">⚔️ Windblade (Design)</Link></li>
            </ul>
          </div>

          <div>
            <div className="footer-title">Cybertron Command</div>
            <ul className="footer-links">
              <li><Link href="/contact" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Info size={14} />About Command HQ</Link></li>
              <li>
                <a href="mailto:airo-6.0.sairam@gmail.com" style={{ color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Mail size={14} />
                  airo-6.0.sairam@gmail.com
                </a>
              </li>
              <li style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MapPin size={14} />
                West Tambaram, Chennai – 600 044
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 AIRO 6.0 · Alliance Division: AI & Data Science · Sairam Engineering College</span>
          <span>All transformations are FREE · Squad-based registration</span>
        </div>
      </div>
    </footer>
  );
}
