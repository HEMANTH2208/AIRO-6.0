"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields"); return; }
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push(callbackUrl);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-base)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            fontFamily: "var(--font-heading)",
            fontSize: "2rem",
            fontWeight: 900,
            background: "var(--gradient-primary)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "0.35rem",
          }}>
            AIRO 6.0
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Administration Panel</div>
        </div>

        <div className="card" style={{ padding: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.35rem" }}>Admin Login</h2>
          <p style={{ fontSize: "0.85rem", marginBottom: "2rem" }}>Sign in to access the admin dashboard.</p>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: "1.25rem" }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-block"
              style={{ marginTop: "0.5rem" }}
              disabled={loading}
            >
              {loading ? <><span className="loading-spinner" /> Signing in...</> : "Sign In"}
            </button>
          </form>

          <div style={{ marginTop: "1.5rem", padding: "0.75rem", background: "var(--bg-surface)", borderRadius: "var(--radius-sm)", fontSize: "0.78rem", color: "var(--text-muted)" }}>
            <div style={{ fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.35rem" }}>Default credentials:</div>
            <div>Email: admin@airo.sairamengineering.edu</div>
            <div>Password: King@2221</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="page-loading"><div className="page-loading-spinner" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
