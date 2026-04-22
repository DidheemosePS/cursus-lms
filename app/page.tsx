import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="landing">
      {/* NAV */}
      <nav className="l-nav">
        <Link href="#" className="l-nav-logo">
          Cursus<span>.</span>
        </Link>
        <div className="l-nav-links">
          <Link href="#features">Features</Link>
          <Link href="#roles">Who it&apos;s for</Link>
          <Link href="#about">About</Link>
        </div>
        <Link href="/login" className="l-nav-cta">
          Sign in
        </Link>
      </nav>

      {/* HERO */}
      <section className="l-hero">
        <div className="l-hero-bg" />
        <div className="l-hero-grid" />
        <div className="l-hero-eyebrow">
          <span className="l-eyebrow-dot" />
          Multi-Organisation Learning Management
        </div>
        <h1 className="l-hero-title">
          Where <em>organisations</em> build great learners
        </h1>
        <p className="l-hero-sub">
          Cursus gives every organisation a complete learning infrastructure —
          courses, modules, instructors, learners, and submissions — managed
          from a single intelligent platform.
        </p>
        <div className="l-hero-actions">
          <Link href="/login" className="l-btn-primary">
            Get started
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <Link href="#features" className="l-btn-secondary">
            See how it works
          </Link>
        </div>
      </section>

      {/* STATS */}
      <div className="l-stats">
        {[
          { value: "3", suffix: "+", label: "User Roles" },
          { value: "∞", suffix: "", label: "Organisations" },
          { value: "100", suffix: "%", label: "Real-time" },
          { value: "1", suffix: "x", label: "Unified Platform" },
        ].map((s) => (
          <div key={s.label} className="l-stat">
            <div className="l-stat-value">
              {s.value}
              <span>{s.suffix}</span>
            </div>
            <div className="l-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* DASHBOARD PREVIEW */}
      <div className="l-preview-section">
        <div className="l-preview-label">Platform Preview</div>
        <div className="l-preview-title">
          Everything you need, nothing you don&apos;t
        </div>
        <div className="l-preview-window">
          <div className="l-preview-bar">
            <div className="l-preview-dot" style={{ background: "#ff5f57" }} />
            <div className="l-preview-dot" style={{ background: "#ffbd2e" }} />
            <div className="l-preview-dot" style={{ background: "#28c840" }} />
            <div className="l-preview-url">app.cursus.io/admin</div>
          </div>
          <div className="l-preview-content">
            <div className="l-preview-sidebar">
              {[
                "Dashboard",
                "Courses",
                "Instructors",
                "Learners",
                "Submissions",
                "Settings",
              ].map((item, i) => (
                <div
                  key={item}
                  className={`l-sidebar-item${i === 0 ? " active" : ""}`}
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="l-preview-main">
              <div className="l-preview-stat-row">
                {[
                  { label: "Total Courses", value: "24", gold: false },
                  { label: "Active Learners", value: "312", gold: false },
                  { label: "Instructors", value: "18", gold: false },
                  { label: "Completion Rate", value: "76%", gold: true },
                ].map((s) => (
                  <div key={s.label} className="l-preview-stat-card">
                    <div className="l-preview-stat-label">{s.label}</div>
                    <div
                      className={`l-preview-stat-value${s.gold ? " gold" : ""}`}
                    >
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="l-preview-table">
                <div className="l-preview-table-header">
                  <span>Course</span>
                  <span>Learners</span>
                  <span>Progress</span>
                  <span>Status</span>
                </div>
                {[
                  {
                    name: "Advanced Web Development",
                    learners: "48",
                    progress: 82,
                    status: "active",
                  },
                  {
                    name: "Data Science Foundations",
                    learners: "31",
                    progress: 64,
                    status: "active",
                  },
                  {
                    name: "UX Design Principles",
                    learners: "27",
                    progress: 45,
                    status: "draft",
                  },
                  {
                    name: "Cloud Architecture",
                    learners: "19",
                    progress: 91,
                    status: "active",
                  },
                ].map((row) => (
                  <div key={row.name} className="l-preview-table-row">
                    <span className="name">{row.name}</span>
                    <span>{row.learners}</span>
                    <span>
                      <div className="l-progress-wrap">
                        <div
                          className="l-progress-fill"
                          style={{ width: `${row.progress}%` }}
                        />
                      </div>
                    </span>
                    <span>
                      <span
                        className={`l-badge ${row.status === "active" ? "l-badge-active" : "l-badge-draft"}`}
                      >
                        {row.status}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="l-features" id="features">
        <div className="l-section-header">
          <div className="l-section-eyebrow">Features</div>
          <h2 className="l-section-title">
            Built for how organisations actually teach
          </h2>
        </div>
        <div className="l-features-grid">
          {[
            {
              icon: "🏛️",
              title: "Multi-Organisation",
              desc: "Every organisation gets its own isolated environment — courses, users, and data are fully scoped. One platform, infinite tenants.",
            },
            {
              icon: "📋",
              title: "Course Management",
              desc: "Build rich courses with ordered modules, due dates, and file submissions. Drag to reorder. Publish when ready.",
            },
            {
              icon: "👥",
              title: "Role-Based Access",
              desc: "Admins manage everything. Instructors own their courses. Learners progress through modules. Each role sees exactly what they need.",
            },
            {
              icon: "📤",
              title: "Submission System",
              desc: "Learners upload assignments per module. Instructors review, give written feedback, and mark submissions. Full attempt history preserved.",
            },
            {
              icon: "💬",
              title: "Real-Time Messaging",
              desc: "Direct chats between learners and instructors. Course group conversations. Unread badges. Powered by Pusher for instant delivery.",
            },
            {
              icon: "📊",
              title: "Progress Tracking",
              desc: "Live completion rates, late submission alerts, module-level progress. Admins see the full picture. Learners see their path.",
            },
          ].map((f) => (
            <div key={f.title} className="l-feature-card">
              <div className="l-feature-icon">{f.icon}</div>
              <div className="l-feature-title">{f.title}</div>
              <p className="l-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ROLES */}
      <section className="l-roles" id="roles">
        <div className="l-roles-inner">
          <div className="l-section-header">
            <div className="l-section-eyebrow">Who it&apos;s for</div>
            <h2 className="l-section-title">
              One platform, three distinct experiences
            </h2>
          </div>
          <div className="l-roles-grid">
            {[
              {
                tag: "Administrator",
                title: "Full control, complete visibility",
                desc: "Admins manage the entire organisation — users, courses, enrollments, and system health — from a single dashboard.",
                items: [
                  "Invite learners and instructors",
                  "Create and publish courses",
                  "Monitor system alerts",
                  "View platform-wide analytics",
                ],
              },
              {
                tag: "Instructor",
                title: "Teach with confidence",
                desc: "Instructors focus on what matters — delivering content, reviewing submissions, and communicating with their learners.",
                items: [
                  "Manage assigned courses and modules",
                  "Review and give feedback on submissions",
                  "Track learner progress",
                  "Message learners directly",
                ],
              },
              {
                tag: "Learner",
                title: "Learn at your own pace",
                desc: "Learners have a clear view of their enrolled courses, module progress, and feedback — all in one place.",
                items: [
                  "Progress through course modules",
                  "Submit assignments per module",
                  "View instructor feedback",
                  "Chat with instructors",
                ],
              },
            ].map((r) => (
              <div key={r.tag} className="l-role-card">
                <div className="l-role-tag">{r.tag}</div>
                <div className="l-role-title">{r.title}</div>
                <p className="l-role-desc">{r.desc}</p>
                <ul className="l-role-list">
                  {r.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="l-testimonial">
        <p className="l-testimonial-quote">
          &quot;We replaced three separate tools with Cursus. Our instructors
          spend less time on admin and <em>more time teaching</em>.&quot;
        </p>
        <div className="l-testimonial-author">
          <strong>Sarah Mitchell</strong>
          Head of Learning & Development, Meridian Group
        </div>
      </section>

      {/* CTA */}
      <section className="l-cta">
        <div className="l-cta-bg" />
        <h2 className="l-cta-title">
          Ready to transform
          <br />
          how your team <em>learns?</em>
        </h2>
        <p className="l-cta-sub">
          Sign in to your organisation or contact us to get started.
        </p>
        <div className="l-hero-actions">
          <Link href="/login" className="l-btn-primary">
            Sign in to your organisation
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="l-footer">
        <div className="l-footer-logo">
          Cursus<span>.</span>
        </div>
        <div className="l-footer-copy">
          © {new Date().getFullYear()} Cursus. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
