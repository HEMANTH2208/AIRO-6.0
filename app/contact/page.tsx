import Link from "next/link";

export const metadata = {
  title: "About AIRO 6.0 — Sairam Engineering College",
  description: "Learn about AIRO 6.0, the annual technical symposium by the Department of AI & Data Science at Sairam Engineering College.",
};

export default function ContactPage() {
  return (
    <div>
      <div style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)", padding: "4rem 0 3rem" }}>
        <div className="container">
          <div className="section-label" style={{ display: "inline-flex", marginBottom: "0.75rem" }}>🎓 About Us</div>
          <h1>About AIRO 6.0</h1>
          <p style={{ marginTop: "0.75rem", maxWidth: "600px" }}>
            The annual technical symposium of the Department of Artificial Intelligence and Data Science, Sairam Engineering College.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: "900px" }}>
          {/* About */}
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <div className="card-header"><div className="card-title">About the Symposium</div></div>
            <p style={{ lineHeight: 1.8, marginBottom: "1rem" }}>
              <strong style={{ color: "var(--text-primary)" }}>AIRO</strong> (Artificial Intelligence Research & Opportunities) is the flagship annual technical symposium
              organized by the Department of Artificial Intelligence and Data Science at Sairam Engineering College.
            </p>
            <p style={{ lineHeight: 1.8, marginBottom: "1rem" }}>
              Now in its sixth edition — <strong style={{ color: "var(--text-primary)" }}>AIRO 6.0</strong> — the event brings together students from colleges across
              Tamil Nadu to compete in exciting AI and data science challenges. The symposium aims to foster
              innovation, teamwork, and technical excellence.
            </p>
            <p style={{ lineHeight: 1.8 }}>
              All events are <strong style={{ color: "var(--success)" }}>free to participate</strong>. Registration is team-based, and all interested students are welcome.
            </p>
          </div>

          {/* Department */}
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <div className="card-header"><div className="card-title">Department of AI & Data Science</div></div>
            <p style={{ lineHeight: 1.8, marginBottom: "1rem" }}>
              The Department of Artificial Intelligence and Data Science at Sairam Engineering College is committed
              to producing industry-ready graduates with expertise in machine learning, deep learning, data analytics,
              and AI applications.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "1.25rem" }}>
              {[
                { icon: "🤖", title: "AI & Machine Learning", desc: "Advanced AI curriculum and research" },
                { icon: "📊", title: "Data Science", desc: "Analytics and data-driven insights" },
                { icon: "🔬", title: "Research", desc: "Active research initiatives" },
                { icon: "🏆", title: "Industry Connect", desc: "Strong industry partnerships" },
              ].map((item) => (
                <div key={item.title} style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-md)", padding: "1.25rem", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{item.icon}</div>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.9rem", marginBottom: "0.25rem" }}>{item.title}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <div className="card-header"><div className="card-title">Contact Information</div></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div>
                <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.75rem" }}>Sairam Engineering College</div>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.8 }}>
                  Sai Leo Nagar, West Tambaram<br />
                  Chennai – 600 044<br />
                  Tamil Nadu, India
                </p>
              </div>
              <div>
                <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.75rem" }}>AIRO 6.0 Committee</div>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.8 }}>
                  📧 <a href="mailto:airo@sairam.edu.in" style={{ color: "var(--primary-light)" }}>airo@sairam.edu.in</a><br />
                  🌐 <a href="https://www.sairamengineering.edu.in" target="_blank" rel="noreferrer" style={{ color: "var(--primary-light)" }}>sairamengineering.edu.in</a>
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center" }}>
            <Link href="/register" className="btn btn-primary btn-lg">Register for AIRO 6.0 →</Link>
            <Link href="/events" className="btn btn-secondary btn-lg" style={{ marginLeft: "1rem" }}>View Events</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
