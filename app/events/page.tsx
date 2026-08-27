import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Clock, Users, CheckCircle, XCircle, ArrowRight, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

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
  "tech-auction": "🤖",
  "tech-crime-scene": "🔊",
  "agentic-paradox": "🦾",
  "prompt-to-product": "⚡",
  "ai-pitch": "🦖",
  "vibecraft": "⚔️",
  "code-combat": "⚙️",
  "paper-presentation": "📡",
  "workshop": "🔧",
};

const EVENT_COLORS: Record<string, string> = {
  "tech-auction": "linear-gradient(135deg, #FF6B00, #FF9F43)",
  "tech-crime-scene": "linear-gradient(135deg, #9B59B6, #8E44AD)",
  "agentic-paradox": "linear-gradient(135deg, #00D4AA, #00B894)",
  "prompt-to-product": "linear-gradient(135deg, #FECA57, #FFC312)",
  "ai-pitch": "linear-gradient(135deg, #54A0FF, #2E86DE)",
  "vibecraft": "linear-gradient(135deg, #FD79A8, #E84393)",
  "code-combat": "linear-gradient(135deg, #00CEC9, #00B894)",
  "paper-presentation": "linear-gradient(135deg, #6C5CE7, #A29BFE)",
  "workshop": "linear-gradient(135deg, #FDCB6E, #E17055)",
};

async function getEvents(): Promise<Event[]> {
  try {
    const events = await prisma.event.findMany({
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

export default async function EventsPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("participant_session")?.value;
  if (!session) {
    redirect("/");
  }

  const events = await getEvents();

  return (
    <div>
      {/* Header */}
      <div style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)", padding: "4rem 0 3rem" }}>
        <div className="container">
          <div className="section-label" style={{ marginBottom: "0.75rem", display: "inline-flex" }}>⚡ AIRO 6.0</div>
          <h1>Competition Events</h1>
          <p style={{ marginTop: "0.75rem", maxWidth: "550px" }}>
            Six carefully designed events covering AI, cybersecurity, product development, and creative technology.
            All events are free and team-based. Happening on <strong>08.10.26 (Thursday)</strong>.
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="section">
        <div className="container">
          <div style={{ display: "grid", gap: "2rem" }}>
            {events.map((event, idx) => (
              <div key={event.id} className="card" style={{ padding: "2rem" }}>
                <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                  {/* Icon */}
                  <div style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "var(--radius-lg)",
                    background: EVENT_COLORS[event.slug] || "var(--gradient-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2.5rem",
                    flexShrink: 0,
                  }}>
                    {EVENT_ICONS[event.slug] || "🎯"}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <h3 style={{ fontSize: "1.35rem" }}>{event.name}</h3>
                      <span className="event-free-badge">FREE</span>
                    </div>
                    <p style={{ marginBottom: "1rem", lineHeight: 1.7 }}>{event.description}</p>

                    <div className="event-meta">
                      <span className="event-meta-item" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                        <Clock size={14} /> {event.duration}
                      </span>
                      <span className="event-meta-item" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                        <Users size={14} /> {event.min_team_size === event.max_team_size
                          ? `${event.min_team_size} members`
                          : `${event.min_team_size}–${event.max_team_size} members`}
                      </span>
                      <span className={`badge ${event.status === "active" ? "badge-success" : "badge-warning"}`} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                        {event.status === "active" ? (
                          <>
                            <CheckCircle size={12} /> Open
                          </>
                        ) : (
                          <>
                            <XCircle size={12} /> Closed
                          </>
                        )}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
                      <Link href={`/events/${event.slug}`} className="btn btn-outline btn-sm" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Eye size={16} />
                        View Details & Rules
                      </Link>
                      {event.status === "active" && (
                        <Link href={`/register?event=${event.id}`} className="btn btn-primary btn-sm" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          Register
                          <ArrowRight size={16} />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Event number */}
                  <div style={{ fontSize: "4rem", fontWeight: 900, color: "var(--border)", lineHeight: 1, alignSelf: "center", flexShrink: 0 }}>
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {events.length === 0 && (
            <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
              No events available at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
