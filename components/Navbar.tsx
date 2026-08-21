"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const EVENT_ICONS: Record<string, string> = {
  "tech-auction": "🏷️",
  "tech-crime-scene": "🔍",
  "agentic-paradox": "🤖",
  "prompt-to-product": "⚡",
  "ai-pitch": "🚀",
  "vibecraft": "🎨",
};

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/participant/me")
      .then((r) => r.json())
      .then((d) => {
        setUser(d.user);
        setRegistrations(d.registrations || []);
      });
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            <div ref={profileRef} style={{ position: "relative" }}>
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
                  marginTop: "0.6rem",
                  width: "310px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.1rem",
                  boxShadow: "0 14px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(108, 99, 255, 0.15)",
                  zIndex: 100,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.85rem",
                  animation: "slideDown 0.2s ease",
                }}>
                  {/* User Profile Header */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem" }}>
                    <div style={{
                      width: "38px", height: "38px", borderRadius: "50%",
                      background: "var(--gradient-primary)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, color: "#fff", fontSize: "1rem", flexShrink: 0,
                      boxShadow: "0 2px 8px rgba(108, 99, 255, 0.4)",
                    }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.95rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
                      <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
                    </div>
                  </div>

                  {/* Registered Events Section */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.06em", color: "var(--primary-light)", textTransform: "uppercase" }}>
                        My Registered Events
                      </span>
                      <span style={{
                        fontSize: "0.68rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "999px",
                        background: "rgba(0, 212, 170, 0.12)", color: "var(--secondary)", border: "1px solid rgba(0, 212, 170, 0.3)"
                      }}>
                        {registrations.length} Event{registrations.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {registrations.length > 0 ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", maxHeight: "220px", overflowY: "auto", paddingRight: "0.2rem" }}>
                        {registrations.map(reg => (
                          <Link
                            key={reg.registration_id}
                            href={`/dashboard?id=${reg.registration_id}`}
                            onClick={() => setProfileOpen(false)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.65rem",
                              padding: "0.55rem 0.7rem",
                              borderRadius: "var(--radius-md)",
                              background: "var(--bg-elevated)",
                              border: "1px solid var(--border)",
                              textDecoration: "none",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "var(--primary)";
                              e.currentTarget.style.transform = "translateX(3px)";
                              e.currentTarget.style.boxShadow = "0 2px 10px rgba(108, 99, 255, 0.2)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "var(--border)";
                              e.currentTarget.style.transform = "translateX(0)";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            <div style={{
                              fontSize: "1.2rem", width: "30px", height: "30px", borderRadius: "6px",
                              background: "rgba(108, 99, 255, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                            }}>
                              {EVENT_ICONS[reg.event_slug] || "🎯"}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: "0.83rem", fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {reg.event_name}
                              </div>
                              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {reg.team_name}
                              </div>
                            </div>
                            <span style={{ fontSize: "0.75rem", color: "var(--primary-light)", fontWeight: 700 }}>→</span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div style={{
                        padding: "1rem", textAlign: "center", borderRadius: "var(--radius-md)",
                        background: "var(--bg-surface)", border: "1px dashed var(--border)",
                        fontSize: "0.78rem", color: "var(--text-muted)"
                      }}>
                        No registered events yet
                      </div>
                    )}
                  </div>

                  {/* Dropdown Quick Actions */}
                  <div style={{ display: "flex", gap: "0.5rem", borderTop: "1px solid var(--border)", paddingTop: "0.65rem" }}>
                    <Link href="/register" className="btn btn-primary btn-xs" style={{ flex: 1, textAlign: "center" }} onClick={() => setProfileOpen(false)}>
                      + Register Event
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
