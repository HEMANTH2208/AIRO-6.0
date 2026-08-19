import Link from "next/link";
import { prisma } from "@/lib/prisma";

interface Event {
  id: number;
  name: string;
  slug: string;
  description: string;
  duration: string;
  min_team_size: number;
  max_team_size: number;
  status: string;
}

const EVENT_ICONS: Record<string, string> = {
  "tech-auction": "🏷️",
  "tech-crime-scene": "🔍",
  "agentic-paradox": "🤖",
  "prompt-to-product": "⚡",
  "ai-pitch": "🚀",
  "vibecraft": "🎨",
};

async function getStats() {
  try {
    const totalTeams = await prisma.team.count();
    const totalEvents = await prisma.event.count({
      where: { status: "active" },
    });
    return { totalTeams, totalEvents };
  } catch {
    return { totalTeams: 0, totalEvents: 6 };
  }
}

async function getEvents(): Promise<Event[]> {
  try {
    const events = await prisma.event.findMany({
      where: { status: "active" },
      orderBy: { id: "asc" },
    });
    return events.map((e) => ({
      id: e.id,
      name: e.name,
      slug: e.slug,
      description: e.description || "",
      duration: e.duration || "",
      min_team_size: e.min_team_size,
      max_team_size: e.max_team_size,
      status: e.status,
    }));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [events, stats] = await Promise.all([getEvents(), getStats()]);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span>🎓</span>
              Sairam Engineering College
            </div>
            <div className="hero-title">
              <div className="gradient-text">AIRO 6.0</div>
            </div>
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginBottom: "0.25rem", fontWeight: 600 }}>
              Department of Artificial Intelligence and Data Science
            </p>
            <p className="hero-subtitle">
              Experience the future of technology at AIRO 6.0 — our annual technical symposium
              featuring AI, data science, and cutting-edge tech competitions. Open to all students.
              All events are FREE.
            </p>
            <div className="hero-actions">
              <Link href="/register" className="btn btn-primary btn-xl">
                ✦ Register Now
              </Link>
              <Link href="/events" className="btn btn-secondary btn-xl">
                View Events →
              </Link>
            </div>

            <div className="hero-stats">
              <div className="hero-stat-item">
                <div className="hero-stat-value">{stats.totalEvents}</div>
                <div className="hero-stat-label">Events</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-value">{stats.totalTeams > 0 ? stats.totalTeams + "+" : "Open"}</div>
                <div className="hero-stat-label">Teams Registered</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-value">FREE</div>
                <div className="hero-stat-label">Entry</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-value">1 Day</div>
                <div className="hero-stat-label">Symposium</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INFO BANNER */}
      <div style={{ background: "rgba(108,99,255,0.08)", borderTop: "1px solid rgba(108,99,255,0.2)", borderBottom: "1px solid rgba(108,99,255,0.2)", padding: "0.85rem 0" }}>
        <div className="container" style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>📅 Event Date: 08.10.26 (Thursday)</span>
          <span style={{ color: "var(--border)" }}>|</span>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>🏫 Sairam Engineering College, Chennai</span>
          <span style={{ color: "var(--border)" }}>|</span>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>🆓 All Events are FREE</span>
          <span style={{ color: "var(--border)" }}>|</span>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>👥 Team-based Registration</span>
        </div>
      </div>

      {/* EVENTS SECTION */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-label">⚡ Competition Events</div>
            <h2 className="section-title">Choose Your Challenge</h2>
            <p className="section-subtitle">
              Six unique events designed to test your technical skills, creativity, and teamwork.
              Register your team and compete with the best.
            </p>
          </div>

          <div className="grid-3">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-icon">{EVENT_ICONS[event.slug] || "🎯"}</div>
                <div className="event-name">{event.name}</div>
                <p className="event-desc">{event.description}</p>
                <div className="event-meta">
                  <span className="event-meta-item">⏱ {event.duration}</span>
                  <span className="event-meta-item">
                    👥 {event.min_team_size === event.max_team_size
                      ? `${event.min_team_size} members`
                      : `${event.min_team_size}–${event.max_team_size} members`}
                  </span>
                  <span className="event-free-badge">FREE</span>
                </div>
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "auto" }}>
                  <Link href={`/events/${event.slug}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                    View Details
                  </Link>
                  <Link href={`/register?event=${event.id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                    Register
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-sm" style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label">📋 Process</div>
            <h2 className="section-title">How to Register</h2>
          </div>
          <div className="grid-4">
            {[
              { step: "01", icon: "🎯", title: "Select Event", desc: "Browse events and pick your competition" },
              { step: "02", icon: "👥", title: "Form Your Team", desc: "Assemble your team as per event requirements" },
              { step: "03", icon: "📝", title: "Fill Details", desc: "Enter team and participant information" },
              { step: "04", icon: "🎫", title: "Get QR Pass", desc: "Receive your registration ID and QR code" },
            ].map((item) => (
              <div key={item.step} className="card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{item.icon}</div>
                <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--primary-light)", letterSpacing: "0.1em", marginBottom: "0.35rem" }}>STEP {item.step}</div>
                <h4 style={{ marginBottom: "0.5rem" }}>{item.title}</h4>
                <p style={{ fontSize: "0.85rem" }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link href="/register" className="btn btn-primary btn-lg">
              Start Registration →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div style={{
            background: "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(0,212,170,0.1))",
            border: "1px solid rgba(108,99,255,0.3)",
            borderRadius: "var(--radius-xl)",
            padding: "3rem",
            textAlign: "center",
          }}>
            <h2 style={{ marginBottom: "0.75rem" }}>Ready to Compete?</h2>
            <p style={{ maxWidth: "500px", margin: "0 auto 2rem" }}>
              Don&apos;t miss your chance to showcase your skills at AIRO 6.0. Registration is completely free. Form your team and register today!
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/register" className="btn btn-primary btn-lg">✦ Register Your Team</Link>
              <Link href="/contact" className="btn btn-secondary btn-lg">Learn More</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
