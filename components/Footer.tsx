"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
              Annual Technical Symposium organized by the Department of Artificial Intelligence and
              Data Science, Sairam Engineering College.
            </p>
          </div>

          <div>
            <div className="footer-title">Quick Links</div>
            <ul className="footer-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/events">Events</Link></li>
              <li><Link href="/register">Register</Link></li>
              <li><Link href="/dashboard">My Registration</Link></li>
            </ul>
          </div>

          <div>
            <div className="footer-title">Events</div>
            <ul className="footer-links">
              <li><Link href="/events/tech-auction">Tech Auction</Link></li>
              <li><Link href="/events/tech-crime-scene">Tech Crime Scene</Link></li>
              <li><Link href="/events/agentic-paradox">Agentic Paradox</Link></li>
              <li><Link href="/events/prompt-to-product">Prompt-to-Product</Link></li>
              <li><Link href="/events/ai-pitch">AI Pitch</Link></li>
              <li><Link href="/events/vibecraft">VibeCraft</Link></li>
            </ul>
          </div>

          <div>
            <div className="footer-title">Contact</div>
            <ul className="footer-links">
              <li><Link href="/contact">About AIRO</Link></li>
              <li>
                <a href="mailto:airo@sairam.edu.in">airo@sairam.edu.in</a>
              </li>
              <li style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                West Tambaram, Chennai – 600 044
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2024 AIRO 6.0 · Dept. of AI & Data Science · Sairam Engineering College</span>
          <span>All events are FREE · Registration is team-based</span>
        </div>
      </div>
    </footer>
  );
}
