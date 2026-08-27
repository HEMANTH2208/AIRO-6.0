"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV = [
  { section: "Mission Control" },
  { href: "/admin/dashboard", icon: "📊", label: "Dashboard" },
  { section: "Cybertronian Registry" },
  { href: "/admin/events", icon: "⚡", label: "Events" },
  { href: "/admin/registrations", icon: "📋", label: "Registrations" },
  { href: "/admin/teams", icon: "👥", label: "Squads" },
  { href: "/admin/participants", icon: "🤖", label: "Transformers" },
  { section: "Field Ops" },
  { href: "/admin/qr-verify", icon: "🔍", label: "QR Scanner" },
  { href: "/admin/export", icon: "📥", label: "Data Extract" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <div className="brand">AIRO 6.0</div>
        <div className="sub">Cybertron HQ</div>
      </div>

      <ul className="sidebar-nav">
        {NAV.map((item, i) => {
          if ("section" in item && !("href" in item)) {
            return <li key={i} className="sidebar-nav-section">{item.section}</li>;
          }
          if ("href" in item) {
            return (
              <li key={item.href}>
                <Link href={item.href!} className={pathname === item.href ? "active" : ""}>
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          }
          return null;
        })}
      </ul>

      <div style={{ padding: "1rem 0.75rem", borderTop: "1px solid var(--border)", marginTop: "auto" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--text-muted)", padding: "0.5rem", marginBottom: "0.35rem" }}>
          ← Back to Field
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--error)", width: "100%", background: "none", border: "none", cursor: "pointer", padding: "0.5rem", borderRadius: "var(--radius-sm)" }}
        >
          🚪 Deactivate
        </button>
      </div>
    </aside>
  );
}
