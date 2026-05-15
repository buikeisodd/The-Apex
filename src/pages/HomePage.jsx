import {
  Play,
  ArrowRight,
  Mic2,
  Music,
  Star,
  Zap,
  ChevronDown,
} from "lucide-react";

const stats = [
  { label: "Beats Available", value: "500+", desc: "Across all genre" },
  { label: "Artists Signed", value: "40+", desc: "And growing" },
  { label: "Studio Hours", value: "10K+", desc: "Logged this year" },
  { label: "Chart Hits", value: "80+", desc: "Released" },
];

const testimonials = [
  {
    name: "DJ Kola",
    role: "Afrobeats Artist",
    text: "Apex Label changed my career. The beats are fire and the studio is world-class.",
    rating: 5,
  },
  {
    name: "Sade M.",
    role: "R&B Singer",
    text: "I booked a session and left with a finished single. The producers here are incredible.",
    rating: 5,
  },
  {
    name: "Draco P.",
    role: "Rap Artist",
    text: "The exclusive license deal was perfect. Got exactly the sound I needed.",
    rating: 5,
  },
];

const services = [
  {
    title: "Beat Store",
    desc: "Hundreds of premium beats across every genre — Trap, Afrobeats, Drill, R&B and more. Lease or exclusive rights.",
    page: "beats",
    color: "var(--gold)",
  },
  {
    title: "Studio Sessions",
    desc: "Book time in our state-of-the-art studio. Recording, mixing, mastering, and full production services.",
    page: "sessions",
    color: "var(--blue)",
  },
  {
    title: "Artist Development",
    desc: "A&R guidance, brand strategy, and promotional support to launch your music career to the next level.",
    page: "contact",
    color: "var(--purple)",
  },
];

export default function HomePage({ setActivePage }) {
  return (
    <div style={{ position: "relative" }}>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          paddingTop: 80,
        }}
      >
        {/* Background elements */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            right: "-8%",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(212,168,67,0.06) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "5%",
            left: "-10%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(138,92,246,0.05) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />

        {/* Horizontal lines */}
        <div className="hero-line" style={{ top: "30%" }} />
        <div className="hero-line" style={{ top: "70%" }} />

        {/* Vertical accent */}
        <div
          style={{
            position: "absolute",
            left: "12%",
            top: "20%",
            width: 1,
            height: "60%",
            background:
              "linear-gradient(to bottom, transparent, rgba(212,168,67,0.15), transparent)",
            pointerEvents: "none",
          }}
        />

        <div
          className="container"
          style={{
            padding: "5rem 1.5rem",
            width: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ maxWidth: 760 }}>
            {/* Label */}
            <div
              className="animate-fadeUp reveal"
              style={{ marginBottom: "1.75rem", opacity: 1 }}
            >
              <span className="section-label">Est. 2026 · Lagos, Nigeria</span>
            </div>

            {/* Headline */}
            <h1
              className="font-display animate-fadeUp stagger-1"
              style={{
                fontFamily: "Bebas Neue",
                fontSize: "clamp(4rem, 11vw, 8rem)",
                lineHeight: 0.88,
                letterSpacing: "0.02em",
                marginBottom: "2rem",
                opacity: 0,
                animationFillMode: "forwards",
              }}
            >
              WHERE SOUND
              <br />
              <span className="gold-text">BECOMES</span>
              <br />
              <span style={{ color: "var(--text-secondary)" }}>LEGACY</span>
            </h1>

            {/* Sub */}
            <p
              className="animate-fadeUp stagger-2"
              style={{
                fontSize: "1.1rem",
                color: "var(--text-secondary)",
                lineHeight: 1.85,
                maxWidth: 520,
                marginBottom: "3rem",
                opacity: 0,
                animationFillMode: "forwards",
                fontWeight: 400,
              }}
            >
              Premium beats. Professional studio sessions. Music that moves.
              Apex Label is where Africa's next generation of artists is forged.
            </p>

            {/* CTAs */}
            <div
              className="animate-fadeUp stagger-3"
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
                opacity: 0,
                animationFillMode: "forwards",
              }}
            >
              <button
                onClick={() => setActivePage("beats")}
                className="btn-gold"
                style={{
                  padding: "10px",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.875rem",
                }}
              >
                Browse Beats
              </button>
              <button
                onClick={() => setActivePage("sessions")}
                className="btn-outline"
                style={{
                  padding: "10px",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.875rem",
                }}
              >
                Book a Session
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "0",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "var(--bg-raised)",
        }}
      >
        <div className="container" style={{ padding: "0 1.5rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              textAlign: "center",
            }}
          >
            {stats.map((s, i) => (
              <div
                key={s.label}
                style={{
                  padding: "3rem 1.5rem",
                  borderRight:
                    i < stats.length - 1
                      ? "1px solid rgba(255,255,255,0.05)"
                      : "none",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(212,168,67,0.03)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <p
                  className="stat-value"
                  style={{
                    fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                    color: "var(--gold)",
                    marginBottom: "0.4rem",
                  }}
                >
                  {s.value}
                </p>
                <p
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "var(--text)",
                    marginBottom: "0.2rem",
                  }}
                >
                  {s.label}
                </p>
                <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">What We Offer</span>
            <h2
              className="font-display"
              style={{
                fontFamily: "Bebas Neue",

                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                letterSpacing: "0.08em",
                lineHeight: 1,
              }}
            >
              BUILT FOR ARTISTS
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {services.map((s) => (
              <div
                key={s.title}
                className="card"
                style={{
                  borderRadius: "var(--radius-xl)",
                  padding: "2.5rem",
                  cursor: "pointer",
                }}
                onClick={() => setActivePage(s.page)}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "var(--radius-md)",
                    background: `${s.color}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: s.color,
                    marginBottom: "1.75rem",
                  }}
                >
                  {s.icon}
                </div>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    marginBottom: "0.875rem",
                    lineHeight: 1.3,
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.8,
                    marginBottom: "1.5rem",
                  }}
                >
                  {s.desc}
                </p>
                <span
                  style={{
                    fontSize: "0.78rem",
                    color: s.color,
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  Explore
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section
        className="section"
        style={{
          background: "var(--bg-raised)",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="container">
          <div className="section-header">
            <span className="section-label">Artist Stories</span>
            <h2
              className="font-display"
              style={{
                fontFamily: "Bebas Neue",
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                letterSpacing: "0.08em",
                lineHeight: 1,
              }}
            >
              THEY MADE IT HERE
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="card"
                style={{ borderRadius: "var(--radius-xl)", padding: "2.25rem" }}
              >
                <div
                  style={{ display: "flex", gap: 3, marginBottom: "1.5rem" }}
                >
                  {Array(t.rating)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        style={{ color: "var(--gold)", fill: "var(--gold)" }}
                      />
                    ))}
                </div>
                <p
                  style={{
                    fontSize: "0.925rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.85,
                    marginBottom: "1.75rem",
                    fontStyle: "italic",
                  }}
                >
                  "{t.text}"
                </p>
                <div>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {t.name}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--gold)" }}>
                    {t.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="section" style={{ textAlign: "center" }}>
        <div className="container-sm">
          <span
            className="section-label"
            style={{ justifyContent: "center", marginBottom: "1.25rem" }}
          >
            Ready to Start?
          </span>
          <h2
            className="font-display"
            style={{
              fontFamily: "Bebas Neue",
              fontSize: "clamp(2.5rem, 7vw, 5rem)",
              letterSpacing: "0.05em",
              lineHeight: 0.92,
              marginBottom: "1.5rem",
            }}
          >
            READY TO MAKE
            <br />
            <span className="gold-text">HISTORY?</span>
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              marginBottom: "2.75rem",
              lineHeight: 1.85,
              fontSize: "1rem",
              maxWidth: 480,
              margin: "0 auto 2.75rem",
            }}
          >
            Join hundreds of artists who've built their careers with Apex Label.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setActivePage("beats")}
              className="btn-gold"
              style={{ padding: "10px", borderRadius: "var(--radius-md)" }}
            >
              Shop Beats
            </button>
            <button
              onClick={() => setActivePage("contact")}
              className="btn-outline"
              style={{ padding: "10px", borderRadius: "var(--radius-md)" }}
            >
              Get in Touch
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "2.5rem 1.5rem",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <p
              className="font-display"
              style={{
                fontFamily: "Bebas Neue",
                fontSize: "1.3rem",
                letterSpacing: "0.2em",
                color: "var(--gold)",
                marginBottom: "0.25rem",
              }}
            >
              APEX LABEL
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              © 2026 Apex Label. Lagos, Nigeria.
            </p>
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
