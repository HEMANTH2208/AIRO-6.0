"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface Event {
  id: number;
  name: string;
  slug: string;
  min_team_size: number;
  max_team_size: number;
  status: string;
  max_other_college_participants: number;
  other_college_count: number;
}

interface Member {
  name: string;
  student_id: string;
  email: string;
  phone: string;
  is_team_lead: boolean;
}

const emptyMember = (): Member => ({ name: "", student_id: "", email: "", phone: "", is_team_lead: false });

type Step = "event" | "team" | "members" | "review" | "submitting";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [events, setEvents] = useState<Event[]>([]);
  const [step, setStep] = useState<Step>("event");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [teamInfo, setTeamInfo] = useState({ team_name: "", college_name: "", department: "" });
  const [members, setMembers] = useState<Member[]>([{ ...emptyMember(), is_team_lead: true }, emptyMember()]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => {
        const active = (d.events || []).filter((e: Event) => e.status === "active");
        setEvents(active);
        const preselect = searchParams.get("event");
        if (preselect) {
          const found = active.find((e: Event) => String(e.id) === preselect);
          if (found) {
            setSelectedEvent(found);
            initMembersForEvent(found);
            setStep("team");
          }
        }
      });
  }, [searchParams]);

  const initMembersForEvent = useCallback((event: Event) => {
    const count = event.min_team_size;
    const arr: Member[] = Array.from({ length: count }, (_, i) => ({
      ...emptyMember(),
      is_team_lead: i === 0,
    }));
    setMembers(arr);
  }, []);

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    initMembersForEvent(event);
    setStep("team");
    setErrors({});
  };

  const addMember = () => {
    if (!selectedEvent || members.length >= selectedEvent.max_team_size) return;
    setMembers([...members, emptyMember()]);
  };

  const removeMember = (idx: number) => {
    if (!selectedEvent || members.length <= selectedEvent.min_team_size) return;
    if (members[idx].is_team_lead) return;
    setMembers(members.filter((_, i) => i !== idx));
  };

  const updateMember = (idx: number, field: keyof Member, value: string) => {
    const updated = [...members];
    const member = updated[idx];
    if (field === "name") member.name = value;
    else if (field === "student_id") member.student_id = value;
    else if (field === "email") member.email = value;
    else if (field === "phone") member.phone = value;
    setMembers(updated);
    if (errors[`member_${idx}_${field}`]) {
      setErrors((prev) => { const n = { ...prev }; delete n[`member_${idx}_${field}`]; return n; });
    }
  };

  const validateTeam = () => {
    const errs: Record<string, string> = {};
    if (!teamInfo.team_name.trim()) errs.team_name = "Team name is required";
    if (!teamInfo.college_name.trim()) errs.college_name = "College name is required";
    if (!teamInfo.department.trim()) errs.department = "Department is required";

    if (teamInfo.college_name.trim() && selectedEvent) {
      const isSairam = teamInfo.college_name.toLowerCase().includes("sairam");
      if (!isSairam && selectedEvent.other_college_count >= selectedEvent.max_other_college_participants) {
        errs.college_name = `Registration for this event is closed for other colleges (limit of ${selectedEvent.max_other_college_participants} reached).`;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateMembers = () => {
    const errs: Record<string, string> = {};
    const phoneRe = /^[6-9]\d{9}$/;
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const studentIds = new Set<string>();
    const emails = new Set<string>();
    const phones = new Set<string>();

    members.forEach((m, i) => {
      if (!m.name.trim()) errs[`member_${i}_name`] = "Name is required";
      if (!m.student_id.trim()) errs[`member_${i}_student_id`] = "Student ID is required";
      else if (studentIds.has(m.student_id)) errs[`member_${i}_student_id`] = "Duplicate Student ID";
      else studentIds.add(m.student_id);
      if (!m.email.trim()) errs[`member_${i}_email`] = "Email is required";
      else if (!emailRe.test(m.email)) errs[`member_${i}_email`] = "Invalid email";
      else if (emails.has(m.email)) errs[`member_${i}_email`] = "Duplicate email";
      else emails.add(m.email);
      if (!m.phone.trim()) errs[`member_${i}_phone`] = "Phone is required";
      else if (!phoneRe.test(m.phone)) errs[`member_${i}_phone`] = "Must be 10-digit Indian mobile (starts 6-9)";
      else if (phones.has(m.phone)) errs[`member_${i}_phone`] = "Duplicate phone";
      else phones.add(m.phone);
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    setStep("submitting");
    setSubmitError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: selectedEvent!.id,
          ...teamInfo,
          members,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      router.push(`/register/success?id=${data.registration_id}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Registration failed. Please try again.");
      setStep("review");
    }
  };

  const STEPS = ["Select Event", "Team Info", "Members", "Review & Submit"];
  const STEP_KEYS = ["event", "team", "members", "review"];
  const currentStepIdx = STEP_KEYS.indexOf(step);

  return (
    <div>
      {/* Header */}
      <div style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)", padding: "3rem 0 2rem" }}>
        <div className="container">
          <h1 style={{ marginBottom: "0.5rem" }}>Team Registration</h1>
          <p>Register your team for AIRO 6.0. All events are free.</p>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: "780px" }}>
          {/* Stepper */}
          {step !== "submitting" && (
            <div className="steps" style={{ marginBottom: "2.5rem" }}>
              {STEPS.map((label, i) => (
                <div key={label} className={`step ${i < currentStepIdx ? "done" : i === currentStepIdx ? "active" : ""}`}>
                  <div className="step-circle">{i < currentStepIdx ? "✓" : i + 1}</div>
                  <div className="step-label">{label}</div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 1: Event Selection */}
          {step === "event" && (
            <div>
              <h2 style={{ marginBottom: "0.5rem", fontSize: "1.25rem" }}>Select an Event</h2>
              <p style={{ marginBottom: "1.5rem", fontSize: "0.9rem" }}>Choose the event you want to participate in.</p>
              <div style={{ display: "grid", gap: "1rem" }}>
                {events.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => handleSelectEvent(event)}
                    style={{
                      background: "var(--bg-card)",
                      border: "1.5px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      padding: "1.25rem",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.background = "var(--bg-elevated)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-card)"; }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.25rem" }}>{event.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        Team: {event.min_team_size === event.max_team_size ? `${event.min_team_size}` : `${event.min_team_size}–${event.max_team_size}`} members
                      </div>
                    </div>
                    <span style={{ color: "var(--primary-light)", fontSize: "1.2rem" }}>→</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Team Info */}
          {step === "team" && selectedEvent && (
            <div>
              <div className="alert alert-info" style={{ marginBottom: "1.5rem" }}>
                <span>📋</span>
                <div>Registering for: <strong>{selectedEvent.name}</strong> · Team size: {selectedEvent.min_team_size === selectedEvent.max_team_size ? selectedEvent.min_team_size : `${selectedEvent.min_team_size}–${selectedEvent.max_team_size}`} members</div>
              </div>
              <h3 style={{ marginBottom: "1.25rem", fontSize: "1.1rem" }}>Team Information</h3>
              <div className="form-group">
                <label className="form-label">Team Name <span className="required">*</span></label>
                <input
                  className={`form-control${errors.team_name ? " error" : ""}`}
                  placeholder="Enter your team name"
                  value={teamInfo.team_name}
                  onChange={(e) => { setTeamInfo({ ...teamInfo, team_name: e.target.value }); setErrors((p) => { const n = { ...p }; delete n.team_name; return n; }); }}
                />
                {errors.team_name && <div className="form-error">{errors.team_name}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">College Name <span className="required">*</span></label>
                <input
                  className={`form-control${errors.college_name ? " error" : ""}`}
                  placeholder="e.g., Sairam Engineering College"
                  value={teamInfo.college_name}
                  onChange={(e) => { setTeamInfo({ ...teamInfo, college_name: e.target.value }); setErrors((p) => { const n = { ...p }; delete n.college_name; return n; }); }}
                />
                {errors.college_name && <div className="form-error">{errors.college_name}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Department <span className="required">*</span></label>
                <input
                  className={`form-control${errors.department ? " error" : ""}`}
                  placeholder="e.g., Artificial Intelligence and Data Science"
                  value={teamInfo.department}
                  onChange={(e) => { setTeamInfo({ ...teamInfo, department: e.target.value }); setErrors((p) => { const n = { ...p }; delete n.department; return n; }); }}
                />
                {errors.department && <div className="form-error">{errors.department}</div>}
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                <button className="btn btn-secondary" onClick={() => { setStep("event"); setErrors({}); }}>← Back</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { if (validateTeam()) setStep("members"); }}>
                  Next: Add Members →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Members */}
          {step === "members" && selectedEvent && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <h3 style={{ fontSize: "1.1rem" }}>Team Members ({members.length} / {selectedEvent.max_team_size})</h3>
                {members.length < selectedEvent.max_team_size && (
                  <button className="btn btn-outline btn-sm" onClick={addMember}>+ Add Member</button>
                )}
              </div>
              {selectedEvent.min_team_size !== selectedEvent.max_team_size && (
                <div className="alert alert-info" style={{ marginBottom: "1.25rem", fontSize: "0.85rem" }}>
                  <span>ℹ️</span> Team must have {selectedEvent.min_team_size}–{selectedEvent.max_team_size} members. Currently: {members.length}
                </div>
              )}

              {members.map((member, idx) => (
                <div key={idx} className="member-card">
                  <div className="member-card-header">
                    <div className="member-title">
                      {member.is_team_lead ? (
                        <><span className="badge badge-primary">Team Lead</span> Member {idx + 1}</>
                      ) : (
                        <>Member {idx + 1}</>
                      )}
                    </div>
                    {!member.is_team_lead && members.length > selectedEvent.min_team_size && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeMember(idx)}
                        style={{ padding: "0.3rem 0.75rem" }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="member-grid">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Full Name <span className="required">*</span></label>
                      <input
                        className={`form-control${errors[`member_${idx}_name`] ? " error" : ""}`}
                        placeholder="Full name"
                        value={member.name}
                        onChange={(e) => updateMember(idx, "name", e.target.value)}
                      />
                      {errors[`member_${idx}_name`] && <div className="form-error">{errors[`member_${idx}_name`]}</div>}
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Student ID <span className="required">*</span></label>
                      <input
                        className={`form-control${errors[`member_${idx}_student_id`] ? " error" : ""}`}
                        placeholder="Student / Roll number"
                        value={member.student_id}
                        onChange={(e) => updateMember(idx, "student_id", e.target.value)}
                      />
                      {errors[`member_${idx}_student_id`] && <div className="form-error">{errors[`member_${idx}_student_id`]}</div>}
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Email <span className="required">*</span></label>
                      <input
                        type="email"
                        className={`form-control${errors[`member_${idx}_email`] ? " error" : ""}`}
                        placeholder="email@example.com"
                        value={member.email}
                        onChange={(e) => updateMember(idx, "email", e.target.value)}
                      />
                      {errors[`member_${idx}_email`] && <div className="form-error">{errors[`member_${idx}_email`]}</div>}
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Phone Number <span className="required">*</span></label>
                      <input
                        type="tel"
                        className={`form-control${errors[`member_${idx}_phone`] ? " error" : ""}`}
                        placeholder="10-digit mobile number"
                        value={member.phone}
                        onChange={(e) => updateMember(idx, "phone", e.target.value)}
                      />
                      {errors[`member_${idx}_phone`] && <div className="form-error">{errors[`member_${idx}_phone`]}</div>}
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                <button className="btn btn-secondary" onClick={() => { setStep("team"); setErrors({}); }}>← Back</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { if (validateMembers()) setStep("review"); }}>
                  Review Registration →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review */}
          {step === "review" && selectedEvent && (
            <div>
              <h3 style={{ marginBottom: "1.25rem", fontSize: "1.1rem" }}>Review Your Registration</h3>
              {submitError && (
                <div className="alert alert-error" style={{ marginBottom: "1.25rem" }}>
                  <span>⚠️</span> {submitError}
                </div>
              )}

              <div className="review-section">
                <div className="review-section-title">Event</div>
                <div className="review-row">
                  <span className="review-label">Event Name</span>
                  <span className="review-value">{selectedEvent.name}</span>
                </div>
                <div className="review-row">
                  <span className="review-label">Entry Fee</span>
                  <span className="review-value text-success">FREE</span>
                </div>
              </div>

              <div className="review-section">
                <div className="review-section-title">Team Information</div>
                <div className="review-row">
                  <span className="review-label">Team Name</span>
                  <span className="review-value">{teamInfo.team_name}</span>
                </div>
                <div className="review-row">
                  <span className="review-label">College</span>
                  <span className="review-value">{teamInfo.college_name}</span>
                </div>
                <div className="review-row">
                  <span className="review-label">Department</span>
                  <span className="review-value">{teamInfo.department}</span>
                </div>
              </div>

              {members.map((m, i) => (
                <div key={i} className="review-section">
                  <div className="review-section-title">
                    {m.is_team_lead ? "Team Lead" : `Member ${i + 1}`}
                  </div>
                  <div className="review-row">
                    <span className="review-label">Name</span>
                    <span className="review-value">{m.name}</span>
                  </div>
                  <div className="review-row">
                    <span className="review-label">Student ID</span>
                    <span className="review-value">{m.student_id}</span>
                  </div>
                  <div className="review-row">
                    <span className="review-label">Email</span>
                    <span className="review-value">{m.email}</span>
                  </div>
                  <div className="review-row">
                    <span className="review-label">Phone</span>
                    <span className="review-value">{m.phone}</span>
                  </div>
                </div>
              ))}

              <div style={{ background: "rgba(0,212,170,0.07)", border: "1px solid rgba(0,212,170,0.2)", borderRadius: "var(--radius-md)", padding: "1rem", marginBottom: "1.5rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                By submitting, you confirm that all information provided is accurate.
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button className="btn btn-secondary" onClick={() => setStep("members")}>← Edit</button>
                <button className="btn btn-success" style={{ flex: 1 }} onClick={handleSubmit}>
                  ✓ Submit Registration
                </button>
              </div>
            </div>
          )}

          {/* Submitting */}
          {step === "submitting" && (
            <div className="page-loading">
              <div className="page-loading-spinner" />
              <p>Processing your registration...</p>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Generating your Registration ID and QR code</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="page-loading"><div className="page-loading-spinner" /></div>}>
      <RegisterForm />
    </Suspense>
  );
}
