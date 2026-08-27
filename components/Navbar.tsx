"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Calendar, 
  UserPlus, 
  Info, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Zap,
  Trophy,
  Users,
  ChevronRight,
  Gavel,
  Search,
  Bot,
  Rocket,
  Mic,
  Palette,
  Code,
  FileText,
  Laptop
} from "lucide-react";

const EVENT_ICONS: Record<string, { emoji: string; component: any }> = {
  "tech-auction": { emoji: "🤖", component: Gavel },
  "tech-crime-scene": { emoji: "🔊", component: Search },
  "agentic-paradox": { emoji: "🦾", component: Bot },
  "prompt-to-product": { emoji: "⚡", component: Rocket },
  "ai-pitch": { emoji: "🦖", component: Mic },
  "vibecraft": { emoji: "⚔️", component: Palette },
  "code-combat": { emoji: "⚙️", component: Code },
  "paper-presentation": { emoji: "📡", component: FileText },
  "workshop": { emoji: "🔧", component: Laptop },
};

/* Inline Cybertron symbol SVG */
function CybertronSymbol() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: "6px", filter: "drop-shadow(0 0 4px rgba(0, 212, 255, 0.5))" }}>
      <polygon
        points="12,2 22,8 22,16 12,22 2,16 2,8"
        fill="none"
        stroke="#00d4ff"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="4" fill="none" stroke="#ffaa00" strokeWidth="1.5" />
    </svg>
  );
}

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
    { href: "/", label: "Home", icon: Home },
    ...(user
      ? [
          { href: "/events", label: "Events", icon: Calendar },
          { href: "/register", label: "Register", icon: UserPlus },
        ]
      : []),
    { href: "/contact", label: "About", icon: Info },
  ];

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="navbar-brand">
          <span className="brand-main" style={{ display: "flex", alignItems: "center" }}>
            <CybertronSymbol />
            AIRO 6.0
          </span>
          <span className="brand-sub">Sairam Engineering College</span>
        </Link>

        <ul className={`nav-links${menuOpen ? " open" : ""}`}>
          {links.map((link) => (
            <motion.li 
              key={link.href}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={link.href}
                className={pathname === link.href ? "active" : ""}
                onClick={() => setMenuOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            </motion.li>
          ))}
        </ul>

        <div className={`nav-cta${menuOpen ? " open" : ""}`} style={{ position: "relative" }}>
          {user ? (
            <div ref={profileRef} style={{ position: "relative" }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-secondary btn-sm"
                onClick={() => setProfileOpen(!profileOpen)}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderColor: "var(--primary)", color: "var(--primary)" }}
              >
                <User size={16} />
                Hero Profile
              </motion.button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "100%",
                      marginTop: "0.6rem",
                      width: "310px",
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-light)",
                      borderRadius: "var(--radius-lg)",
                      padding: "1.1rem",
                      boxShadow: "0 14px 35px rgba(0, 0, 0, 0.7), 0 0 20px rgba(57, 255, 20, 0.1)",
                      zIndex: 100,
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.85rem",
                    }}
                  >
                  {/* User Profile Header */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem" }}>
                    <div style={{
                      width: "38px", height: "38px", borderRadius: "50%",
                      background: "var(--gradient-primary)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, color: "#000", fontSize: "1rem", flexShrink: 0,
                      boxShadow: "0 2px 8px rgba(57, 255, 20, 0.4)",
                      fontFamily: "var(--font-heading)",
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
                      <span style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.06em", color: "var(--primary)", textTransform: "uppercase", fontFamily: "var(--font-heading)" }}>
                        Active Factions
                      </span>
                      <span style={{
                        fontSize: "0.66rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "999px",
                        background: "rgba(0, 212, 255, 0.1)", color: "var(--primary)", border: "1px solid rgba(0, 212, 255, 0.3)",
                        fontFamily: "var(--font-heading)",
                      }}>
                        {registrations.length} FACTION{registrations.length !== 1 ? "S" : ""}
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
                              e.currentTarget.style.boxShadow = "0 2px 10px rgba(0, 212, 255, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "var(--border)";
                              e.currentTarget.style.transform = "translateX(0)";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            <div style={{
                              fontSize: "1.2rem", width: "30px", height: "30px", borderRadius: "6px",
                              background: "rgba(0, 212, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                              border: "1px solid rgba(0, 212, 255, 0.15)",
                            }}>
                              {EVENT_ICONS[reg.event_slug]?.emoji || "🎯"}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: "0.83rem", fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {reg.event_name}
                              </div>
                              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {reg.team_name}
                              </div>
                            </div>
                            <span style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 700 }}><ChevronRight size={14} /></span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div style={{
                        padding: "1rem", textAlign: "center", borderRadius: "var(--radius-md)",
                        background: "var(--bg-surface)", border: "1px dashed var(--border)",
                        fontSize: "0.78rem", color: "var(--text-muted)"
                      }}>
                        No active transformations
                      </div>
                    )}
                  </div>

                  {/* Dropdown Quick Actions */}
                  <div style={{ display: "flex", gap: "0.5rem", borderTop: "1px solid var(--border)", paddingTop: "0.65rem" }}>
                    <Link href="/register" className="btn btn-primary btn-xs" style={{ flex: 1, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem" }} onClick={() => setProfileOpen(false)}>
                      <Zap size={12} />
                      Transform
                    </Link>
                    <button className="btn btn-xs" style={{ flex: 1, borderColor: "var(--error)", color: "var(--error)", border: "1px solid", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem" }} onClick={handleLogout}>
                      <LogOut size={12} />
                      Logout
                    </button>
                  </div>
                </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/" className="btn btn-primary btn-sm" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Zap size={16} />
              Access Command Core
            </Link>
          )}
        </div>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </nav>
  );
}
