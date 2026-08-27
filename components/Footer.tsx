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
              The Omnitrix Symposium — powered by the Department of Artificial Intelligence and
              Data Science, Sairam Engineering College. Every hero starts here.
            </p>
          </div>

          <div>
            <div className="footer-title">Command Center</div>
            <ul className="footer-links">
              <li><Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Home size={14} />Home Base</Link></li>
              <li><Link href="/events" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Calendar size={14} />Alien Arsenal</Link></li>
              <li><Link href="/register" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><UserPlus size={14} />Transform</Link></li>
              <li><Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><LayoutDashboard size={14} />Mission Log</Link></li>
            </ul>
          </div>

          <div>
            <div className="footer-title">Alien Forms</div>
            <ul className="footer-links">
              <li><Link href="/events/tech-auction">💎 Diamondhead</Link></li>
              <li><Link href="/events/tech-crime-scene">🧠 Grey Matter</Link></li>
              <li><Link href="/events/agentic-paradox">⚡ Upgrade</Link></li>
              <li><Link href="/events/prompt-to-product">🏃 XLR8</Link></li>
              <li><Link href="/events/ai-pitch">🔥 Heatblast</Link></li>
              <li><Link href="/events/vibecraft">🌿 Wildvine</Link></li>
            </ul>
          </div>

          <div>
            <div className="footer-title">Plumber HQ</div>
            <ul className="footer-links">
              <li><Link href="/contact" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Info size={14} />About Omnitrix</Link></li>
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
          <span>© 2024 AIRO 6.0 · Plumber Division: AI & Data Science · Sairam Engineering College</span>
          <span>All transformations are FREE · Squad-based registration</span>
        </div>
      </div>
    </footer>
  );
}
