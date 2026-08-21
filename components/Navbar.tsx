"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/participant/me")
      .then((r) => r.json())
      .then((d) => {
        setUser(d.user);
        setRegistrations(d.registrations || []);
      });
  }, [pathname]);

  const handleLogout = async () => {
    setProfileOpen(false);
    await fetch("/api/participant/logout", { method: "POST" });
    setUser(null);
    setRegistrations([]);
    window.location.href = "/";
  };

  const isAdmin = pathname?.startsWith("/admin");
  if (isAdmin) return null;

  const links = [
    { href: "/", label: "Home" },
    ...(user
      ? [
          { href: "/events", label: "Events" },
          { href: "/register", label: "Register" },
        ]
      : []),
    { href: "/contact", label: "About" },
  ];

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="navbar-brand">
          <span className="brand-main">AIRO 6.0</span>
          <span className="brand-sub">Sairam Engineering College</span>
        </Link>

        <ul className={`nav-links${menuOpen ? " open" : ""}`}>
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={pathname === link.href ? "active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={`nav-cta${menuOpen ? " open" : ""}`} style={{ position: "relative" }}>
          {user ? (
            <div style={{ position: "relative" }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setProfileOpen(!profileOpen)}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                👤 My Profile
              </button>

              {profileOpen && (
                <div style={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  marginTop: "0.5rem",
                  width: "260px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  padding: "1rem",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                  zIndex: 100,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem"
                }}>
                  <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>
                    <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{user.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", wordBreak: "break-all" }}>{user.email}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--primary-light)", marginBottom: "0.25rem" }}>My Registered Events</div>
                    {registrations.length > 0 ? (
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        {registrations.map(reg => (
                          <li key={reg.registration_id} style={{ fontSize: "0.8rem" }}>
                            <Link href={`/dashboard?id=${reg.registration_id}`} style={{ color: "var(--text-secondary)", textDecoration: "none" }} onClick={() => setProfileOpen(false)}>
                              • {reg.event_name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>No registrations yet</div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", borderTop: "1px solid var(--border)", paddingTop: "0.5rem" }}>
                    <Link href="/register" className="btn btn-primary btn-xs" style={{ flex: 1, textAlign: "center" }} onClick={() => setProfileOpen(false)}>
                      Register
                    </Link>
                    <button className="btn btn-xs" style={{ flex: 1, borderColor: "var(--error)", color: "var(--error)" }} onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/" className="btn btn-primary btn-sm">
              Sign In
            </Link>
          )}
        </div>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "" }} />
          <span style={{ opacity: menuOpen ? 0 : 1 }} />
          <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "" }} />
        </button>
      </div>
    </nav>
  );
}
