"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/participant/me")
      .then((r) => r.json())
      .then((d) => {
        setIsLoggedIn(!!d.user);
      });
  }, [pathname]);

  const isAdmin = pathname?.startsWith("/admin");
  if (isAdmin) return null;

  const links = [
    { href: "/", label: "Home" },
    ...(isLoggedIn
      ? [
          { href: "/events", label: "Events" },
          { href: "/register", label: "Register" },
          { href: "/dashboard", label: "My Registration" },
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

        <div className={`nav-cta${menuOpen ? " open" : ""}`}>
          {isLoggedIn ? (
            <Link href="/register" className="btn btn-primary btn-sm">
              Register Now
            </Link>
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
