import { notFound } from "next/navigation";
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

const EVENT_DETAILS: Record<string, { rounds: string[]; rules: string[] }> = {
  "tech-auction": {
    rounds: [
      "Round 1 — Auction Phase: Each team receives virtual currency. Technologies are auctioned; teams bid strategically to acquire their stack.",
      "Round 2 — Build Phase: Using only the technologies won at auction, teams develop a working solution to the given problem statement.",
      "Round 3 — Presentation: Teams present their solution, explaining their technology choices and the trade-offs made.",
    ],
    rules: [
      "Teams must consist of 3–4 members.",
      "Each team starts with an equal budget of virtual currency.",
      "Teams cannot trade or share technologies after the auction.",
      "The solution must use only the technologies acquired during the auction.",
      "Plagiarism or use of pre-built templates will lead to disqualification.",
    ],
  },
  "tech-crime-scene": {
    rounds: [
      "Round 1 — Evidence Analysis: Teams receive a packet of digital evidence (logs, screenshots, files) from a simulated cybercrime.",
      "Round 2 — Investigation: Teams analyze the evidence to identify the attacker, the attack method, and the vulnerability exploited.",
      "Round 3 — Report Submission: Teams submit a written incident report and present their findings to the judges.",
    ],
    rules: [
      "Teams must consist of 2–3 members.",
      "No internet access is permitted during the investigation phase.",
      "All findings must be backed by the provided evidence.",
      "Teams must submit their report within the allotted time.",
      "Judges' decisions on findings are final.",
    ],
  },
  "agentic-paradox": {
    rounds: [
      "Round 1 — Theme Selection & Design: Teams select a theme and design their AI agent's architecture and capabilities.",
      "Round 2 — Development: Teams build the AI agent within the time limit.",
      "Round 3 — Unseen Challenge: Teams are given an unexpected scenario. Their agent must adapt and respond effectively.",
    ],
    rules: [
      "Teams must consist of exactly 3 members.",
      "Agents must be built using approved AI frameworks and APIs.",
      "The agent must be original work created during the event.",
      "Pre-trained models may be used, but the agent logic must be original.",
      "Teams must demonstrate live agent functionality during evaluation.",
    ],
  },
  "prompt-to-product": {
    rounds: [
      "Round 1 — Problem Statement: Teams receive a real-world problem and must define an AI-powered solution using prompt engineering.",
      "Round 2 — Prototype Development: Teams build a functional prototype leveraging AI tools, APIs, or models.",
      "Round 3 — Demo & Pitch: Teams demonstrate the working prototype and explain the AI components used.",
    ],
    rules: [
      "Teams must consist of 2–4 members.",
      "Solutions must integrate at least one AI/ML component.",
      "All AI tools, APIs, and frameworks used must be disclosed.",
      "The prototype must be functional and demonstrable.",
      "Prototype must be developed during the event; pre-built solutions are not allowed.",
    ],
  },
  "ai-pitch": {
    rounds: [
      "Preparation Phase (45–60 min): Teams develop their AI startup concept, prototype, and presentation materials.",
      "Pitch Round (5 min per team): Teams present their solution covering: problem, AI solution, prototype demo, market feasibility, and business model.",
      "Q&A Round: Judges ask questions about the technical and business aspects of the solution.",
    ],
    rules: [
      "Teams must consist of 2–4 members.",
      "The solution must be AI-based and address a real-world problem.",
      "Pitch duration is strictly 5 minutes; exceeding time will result in point deduction.",
      "A working prototype or MVP must be demonstrated.",
      "Presentation slides must be prepared during the event.",
    ],
  },
  "vibecraft": {
    rounds: [
      "Round 1 — Image Recreation: Teams receive a reference design and must recreate it using AI image generation tools.",
      "Round 2 — Design Adaptation: Teams adapt the recreated design to a new context or theme provided by organizers.",
      "Round 3 — AI-Assisted Website: Using the designs created, teams build a simple responsive web page using AI coding tools.",
    ],
    rules: [
      "Teams must consist of exactly 2 members.",
      "Only AI-assisted tools are permitted for design and development.",
      "All assets must be generated or adapted during the event.",
      "The website must be functional and viewable in a browser.",
      "Teams must document the AI tools and prompts used.",
    ],
  },
};

async function getEvent(slug: string): Promise<Event | null> {
  try {
    const e = await prisma.event.findUnique({
      where: { slug },
    });
    if (!e) return null;
    return {
      id: e.id,
      name: e.name,
      slug: e.slug,
      description: e.description || "",
      duration: e.duration || "",
      min_team_size: e.min_team_size,
      max_team_size: e.max_team_size,
      status: e.status,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: "Event Not Found" };
  return {
    title: `${event.name} — AIRO 6.0`,
    description: event.description,
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const details = EVENT_DETAILS[event.slug];

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)", padding: "1rem 0" }}>
        <div className="container" style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          <Link href="/" style={{ color: "var(--text-muted)" }}>Home</Link>
          <span style={{ margin: "0 0.5rem" }}>›</span>
          <Link href="/events" style={{ color: "var(--text-muted)" }}>Events</Link>
          <span style={{ margin: "0 0.5rem" }}>›</span>
          <span style={{ color: "var(--text-primary)" }}>{event.name}</span>
        </div>
      </div>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, var(--bg-surface), var(--bg-card))", borderBottom: "1px solid var(--border)", padding: "3rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{
              width: "80px", height: "80px",
              background: "var(--gradient-primary)",
              borderRadius: "var(--radius-lg)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2.5rem", flexShrink: 0,
            }}>
              {EVENT_ICONS[event.slug] || "🎯"}
            </div>
            <div>
              <h1 style={{ marginBottom: "0.5rem" }}>{event.name}</h1>
              <div className="event-meta">
                <span className="event-meta-item">⏱ {event.duration}</span>
                <span className="event-meta-item">
                  👥 {event.min_team_size === event.max_team_size
                    ? `${event.min_team_size} members`
                    : `${event.min_team_size}–${event.max_team_size} members`}
                </span>
                <span className="event-meta-item">📅 08.10.26 (Thursday)</span>
                <span className="event-free-badge">FREE</span>
                {event.status === "active" ? (
                  <span className="badge badge-success">Registration Open</span>
                ) : (
                  <span className="badge badge-warning">Registration Closed</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem", alignItems: "start" }}>
            {/* Main Content */}
            <div>
              {/* Description */}
              <div className="card" style={{ marginBottom: "1.5rem" }}>
                <div className="card-header">
                  <div className="card-title">About This Event</div>
                </div>
                <p style={{ lineHeight: 1.8 }}>{event.description}</p>
              </div>

              {/* Rounds */}
              {details?.rounds && (
                <div className="card" style={{ marginBottom: "1.5rem" }}>
                  <div className="card-header">
                    <div className="card-title">Event Rounds</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {details.rounds.map((round, i) => (
                      <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                        <div style={{
                          width: "32px", height: "32px", borderRadius: "50%",
                          background: "var(--gradient-primary)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.8rem", fontWeight: 700, flexShrink: 0,
                          color: "#fff",
                        }}>
                          {i + 1}
                        </div>
                        <p style={{ lineHeight: 1.7, marginTop: "0.25rem" }}>{round}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rules */}
              {details?.rules && (
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Rules & Guidelines</div>
                  </div>
                  <ul style={{ display: "flex", flexDirection: "column", gap: "0.65rem", paddingLeft: "0", listStyle: "none" }}>
                    {details.rules.map((rule, i) => (
                      <li key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                        <span style={{ color: "var(--primary-light)", fontWeight: 700, flexShrink: 0 }}>→</span>
                        <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div className="card" style={{ marginBottom: "1rem", position: "sticky", top: "80px" }}>
                <div style={{ textAlign: "center", padding: "0.5rem 0" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>{EVENT_ICONS[event.slug] || "🎯"}</div>
                  <h3 style={{ marginBottom: "0.25rem" }}>{event.name}</h3>
                  <div style={{ color: "var(--success)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>✓ FREE Entry</div>
                  <div className="divider" />
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                    <div className="review-row">
                      <span className="review-label">Event Date</span>
                      <span className="review-value">08.10.26 (Thursday)</span>
                    </div>
                    <div className="review-row">
                      <span className="review-label">Duration</span>
                      <span className="review-value">{event.duration}</span>
                    </div>
                    <div className="review-row">
                      <span className="review-label">Team Size</span>
                      <span className="review-value">
                        {event.min_team_size === event.max_team_size
                          ? `${event.min_team_size} members`
                          : `${event.min_team_size}–${event.max_team_size} members`}
                      </span>
                    </div>
                    <div className="review-row">
                      <span className="review-label">Entry Fee</span>
                      <span className="review-value text-success">FREE</span>
                    </div>
                    <div className="review-row">
                      <span className="review-label">Status</span>
                      <span className={event.status === "active" ? "text-success review-value" : "text-warning review-value"}>
                        {event.status === "active" ? "Open" : "Closed"}
                      </span>
                    </div>
                  </div>

                  {event.status === "active" ? (
                    <Link href={`/register?event=${event.id}`} className="btn btn-primary btn-block">
                      Register for This Event →
                    </Link>
                  ) : (
                    <div className="alert alert-warning" style={{ fontSize: "0.85rem" }}>
                      Registration is currently closed for this event.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
